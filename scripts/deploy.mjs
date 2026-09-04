/**
 * Mise en ligne sur l'hebergement mutualise OVH.
 *
 * Le journal est un site statique : il suffit de recopier `dist/` dans un
 * sous-dossier de `www/`. Ce script le fait en SFTP, fichier par fichier, via
 * curl -- aucune dependance a installer.
 *
 *   npm run deploy -- --dry-run    liste ce qui serait envoye, sans rien envoyer
 *   npm run deploy                 envoie
 *
 * Les identifiants ne sont JAMAIS dans le depot : ils viennent de
 * `.env.deploy` (ignore par git) ou de l'environnement.
 *
 *   FTP_HOST=ftp.cluster0XX.hosting.ovh.net
 *   FTP_USER=skymme
 *   FTP_PASS=...
 *   FTP_DIR=www/le-mamichat
 *
 * L'hebergement gratuit d'OVH est limite a 100 Mo. Le script refuse donc
 * d'envoyer plus que le quota, et met de cote les fichiers trop lourds --
 * la video d'Antarctique, en pratique.
 *
 * Le transfert passe par SFTP : le FTP de ce cluster n'offre pas AUTH TLS, et
 * en FTP simple le mot de passe circulerait en clair. La cle du serveur est
 * relevee une fois puis epinglee dans .sftp_known_hosts.
 */
import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs'
import { join, posix, relative, sep } from 'node:path'

const DIST = 'dist'
const DRY = process.argv.includes('--dry-run')

/** Quota de l'hebergement, en Mo. */
const QUOTA_MB = Number(process.env.FTP_QUOTA_MB) || 100
/** Au-dela, un fichier est mis de cote : aucune page du journal n'en a besoin. */
const MAX_FILE_MB = Number(process.env.FTP_MAX_FILE_MB) || 40
/** Cle publique du serveur, relevee au premier envoi. */
const KNOWN_HOSTS = '.sftp_known_hosts'

/**
 * Epingle la cle SSH du serveur. Sans elle, curl refuse de se connecter en
 * SFTP ; avec elle, on sait qu'on parle toujours a la meme machine.
 */
function pinHostKey(host) {
  if (existsSync(KNOWN_HOSTS) && readFileSync(KNOWN_HOSTS, 'utf8').includes(host)) return

  console.log(`Premiere connexion : releve de la cle SSH de ${host}...`)
  const keys = execFileSync('ssh-keyscan', ['-T', '10', host], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
  })
  if (!keys.trim()) {
    console.error(`Impossible de relever la cle SSH de ${host}.`)
    process.exit(1)
  }
  writeFileSync(KNOWN_HOSTS, keys)
  console.log(`Cle enregistree dans ${KNOWN_HOSTS}.`)
}

// --- Identifiants ----------------------------------------------------------
function config() {
  const env = { ...process.env }

  if (existsSync('.env.deploy')) {
    for (const line of readFileSync('.env.deploy', 'utf8').split('\n')) {
      const match = /^\s*([A-Z_]+)\s*=\s*(.*)\s*$/.exec(line)
      if (match) env[match[1]] ??= match[2].replace(/^["']|["']$/g, '')
    }
  }

  const missing = ['FTP_HOST', 'FTP_USER', 'FTP_PASS', 'FTP_DIR'].filter((k) => !env[k])
  if (missing.length && !DRY) {
    console.error(
      existsSync('.env.deploy')
        ? `\nIl reste a renseigner ${missing.join(' et ')} dans .env.deploy\n` +
          'Espace client OVH > Hebergements > skymme.com > onglet FTP - SSH.\n'
        : '\nPas de fichier .env.deploy a la racine du projet.\n' +
          'Creez-le (il est ignore par git) avec :\n\n' +
          '  FTP_HOST=ftp.cluster121.hosting.ovh.net\n' +
          '  FTP_USER=votre-login-ftp\n' +
          '  FTP_PASS=votre-mot-de-passe\n' +
          '  FTP_DIR=www/le-mamichat\n',
    )
    process.exit(1)
  }
  return env
}

// --- Inventaire ------------------------------------------------------------
// Les notes internes (LISEZMOI.md et compagnie) voyagent avec le dossier
// public/ mais n'ont rien a faire en ligne.
const SKIP = /\.md$/i

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (!SKIP.test(entry)) out.push(full)
  }
  return out
}

if (!existsSync(DIST)) {
  console.error('Pas de dossier `dist/`. Lancez `npm run build` d\'abord.')
  process.exit(1)
}

const env = config()
const mb = (bytes) => bytes / 1024 / 1024

const all = walk(DIST)
const heavy = all.filter((f) => mb(statSync(f).size) > MAX_FILE_MB)
const files = all.filter((f) => !heavy.includes(f))
const total = files.reduce((sum, f) => sum + statSync(f).size, 0)

for (const file of heavy) {
  console.log(
    `  mis de cote : ${relative(DIST, file).split(sep).join('/')} ` +
    `(${mb(statSync(file).size).toFixed(0)} Mo, au-dela de ${MAX_FILE_MB} Mo)`,
  )
}

console.log(`${files.length} fichiers, ${mb(total).toFixed(1)} Mo sur ${QUOTA_MB} Mo`)

if (mb(total) > QUOTA_MB) {
  console.error(
    `\nTrop lourd pour l'hebergement (${mb(total).toFixed(1)} Mo > ${QUOTA_MB} Mo).\n` +
    'Allegez dist/, ou relevez FTP_QUOTA_MB si le quota a change.',
  )
  process.exit(1)
}

if (DRY) {
  const dir = env.FTP_DIR ?? 'www/<dossier>'
  for (const file of files) {
    const remote = posix.join(dir, relative(DIST, file).split(sep).join('/'))
    console.log(`  ${(statSync(file).size / 1024).toFixed(0).padStart(7)} Ko  ->  ${remote}`)
  }
  console.log('\nEssai a blanc : rien n\'a ete envoye.')
  process.exit(0)
}

// --- Envoi -----------------------------------------------------------------
// `--ftp-create-dirs` vaut aussi pour SFTP : l'arborescence distante est creee
// au fil de l'eau, on n'a pas a preparer les dossiers a l'avance.
pinHostKey(env.FTP_HOST)

let done = 0
for (const file of files) {
  const rel = relative(DIST, file).split(sep).join('/')
  // En SFTP, le chemin part de la racine du systeme : /~/ ramene au home.
  const url = `sftp://${env.FTP_HOST}/~/${posix.join(env.FTP_DIR, rel)}`
  try {
    execFileSync('curl', [
      '--silent', '--show-error', '--ftp-create-dirs',
      '--knownhosts', KNOWN_HOSTS,
      '--user', `${env.FTP_USER}:${env.FTP_PASS}`,
      '--upload-file', file, url,
    ], { stdio: ['ignore', 'ignore', 'pipe'] })
    done += 1
    console.log(`  ${String(done).padStart(3)}/${files.length}  ${rel}`)
  } catch (error) {
    // Le message de curl peut contenir l'URL, donc le login : on ne le
    // reaffiche pas tel quel.
    console.error(`\nEchec sur ${rel} (curl ${error.status}).`)
    console.error('Verifiez FTP_HOST, FTP_USER, FTP_PASS et FTP_DIR.')
    process.exit(1)
  }
}

console.log(`\nEn ligne : ${files.length} fichiers deposes dans ${env.FTP_DIR}.`)
