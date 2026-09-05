/**
 * Grave les QR codes du journal, une fois pour toutes.
 *
 * Un QR est une image fixe : le generer dans le navigateur a chaque impression
 * obligeait a embarquer une bibliotheque de 25 ko dans le journal, et ne
 * fonctionnait que si le lecteur passait par le bouton -- un Ctrl+P donnait un
 * cadre vide. On le fabrique donc ici, et le journal se contente d'un <img>.
 *
 *   npm run qr        regenere les images
 *
 * A relancer seulement si une adresse change ci-dessous.
 */
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import QRCode from 'qrcode'

/** Une entree = un fichier a graver. */
const CODES = [
  {
    fichier: 'public/images/divers/qr-antartica.png',
    url: 'https://photos.er-974.com/s/mamicha-video',
    quoi: 'le film Antartica',
  },
]

// Correction d'erreur haute : un QR imprime puis photographie de travers, sur
// du papier qui aura vecu, doit rester lisible.
const OPTIONS = {
  width: 640,
  margin: 2,
  errorCorrectionLevel: 'H',
  color: { dark: '#1F1B16', light: '#F6F1E7' },
}

for (const { fichier, url, quoi } of CODES) {
  await mkdir(dirname(fichier), { recursive: true })
  await QRCode.toFile(fichier, url, OPTIONS)
  console.log(`${fichier}  ->  ${url}  (${quoi})`)
}
