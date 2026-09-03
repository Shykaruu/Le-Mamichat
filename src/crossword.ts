/**
 * Les mots croisés interactifs.
 *
 * Chaque case blanche est une vraie case de saisie : le clavier du téléphone
 * s'ouvre tout seul, la lettre saisie fait avancer d'une case, et le mot en
 * cours reste surligné. Un clic sur une case déjà active bascule entre
 * horizontal et vertical, comme dans une vraie grille.
 *
 * La grille remplie est conservée : on peut fermer le journal et revenir.
 */

import {
  CASES,
  HAUTEUR,
  HORIZONTAL,
  LARGEUR,
  MOT_FINAL,
  VERTICAL,
  type Definition,
} from './crossword-data'
import { store } from './store'

type Sens = 'h' | 'v'

const CLE = 'motscroises'
const VIDE = '.'

interface Contexte {
  grille: HTMLElement
  clue: HTMLElement | null
  statut: HTMLElement | null
  motFinal: HTMLElement | null
  cellules: (HTMLInputElement | null)[][]
  sens: Sens
  actif: { r: number; c: number } | null
}

export function setupCrossword(root: ParentNode = document): void {
  const grille = root.querySelector<HTMLElement>('[data-crossword-grid]')
  if (!grille) return

  const ctx: Contexte = {
    grille,
    clue: root.querySelector<HTMLElement>('[data-crossword-clue]'),
    statut: root.querySelector<HTMLElement>('[data-crossword-status]'),
    motFinal: root.querySelector<HTMLElement>('[data-crossword-final]'),
    cellules: [],
    sens: 'h',
    actif: null,
  }

  construireGrille(ctx)
  construireDefinitions(ctx, root)
  construireMotFinal(ctx)
  brancherOutils(ctx, root)
  ajusterTaille(ctx)

  void restaurer(ctx)
}

/**
 * Cale la grille sur la place disponible.
 *
 * Le cadre a une hauteur imposée par la mise en page (contain: size), donc la
 * mesurer ne relance pas le calcul. On prend le plus petit des deux côtés
 * possibles : la grille reste carrée et ne déborde jamais de la page.
 */
function ajusterTaille(ctx: Contexte): void {
  const cadre = ctx.grille.parentElement
  if (!cadre) return

  const poser = (): void => {
    const { width, height } = cadre.getBoundingClientRect()
    if (width < 1 || height < 1) return
    const largeur = Math.floor(Math.min(width, (height * LARGEUR) / HAUTEUR))
    ctx.grille.style.setProperty('--cw-w', `${largeur}px`)
    ctx.grille.style.setProperty('--cw-h', `${Math.floor((largeur * HAUTEUR) / LARGEUR)}px`)
  }

  poser()
  new ResizeObserver(poser).observe(cadre)
  void document.fonts.ready.then(poser)
}

// --- Construction ---------------------------------------------------------

function construireGrille(ctx: Contexte): void {
  const { grille } = ctx
  grille.textContent = ''
  grille.style.setProperty('--cw-cols', String(LARGEUR))
  grille.style.setProperty('--cw-rows', String(HAUTEUR))

  for (let r = 0; r < HAUTEUR; r += 1) {
    const ligne: (HTMLInputElement | null)[] = []
    for (let c = 0; c < LARGEUR; c += 1) {
      const donnee = CASES[r]?.[c] ?? null

      if (!donnee) {
        const noire = document.createElement('div')
        noire.className = 'cw-cell cw-cell--pleine'
        noire.setAttribute('aria-hidden', 'true')
        grille.append(noire)
        ligne.push(null)
        continue
      }

      const cell = document.createElement('label')
      cell.className = 'cw-cell'
      if (donnee.o) cell.classList.add('cw-cell--finale')

      if (donnee.n) {
        const num = document.createElement('span')
        num.className = 'cw-num'
        num.textContent = String(donnee.n)
        cell.append(num)
      }

      const input = document.createElement('input')
      input.className = 'cw-input'
      input.type = 'text'
      input.maxLength = 1
      input.autocomplete = 'off'
      input.autocapitalize = 'characters'
      input.spellcheck = false
      input.dataset.r = String(r)
      input.dataset.c = String(c)
      input.setAttribute('aria-label', `Ligne ${r + 1}, colonne ${c + 1}`)
      cell.append(input)

      grille.append(cell)
      ligne.push(input)
    }
    ctx.cellules.push(ligne)
  }

  grille.addEventListener('focusin', (e) => {
    const input = e.target as HTMLInputElement
    if (!input.dataset.r) return
    ctx.actif = { r: Number(input.dataset.r), c: Number(input.dataset.c) }
    surligner(ctx)
  })

  // Un clic sur la case deja active bascule le sens.
  grille.addEventListener('pointerdown', (e) => {
    const input = (e.target as HTMLElement).closest?.('.cw-cell')?.querySelector('input')
    if (!input) return
    const r = Number(input.dataset.r)
    const c = Number(input.dataset.c)
    if (ctx.actif && ctx.actif.r === r && ctx.actif.c === c) {
      ctx.sens = ctx.sens === 'h' ? 'v' : 'h'
    } else {
      // On choisit le sens qui a un mot ici, en preferant l horizontal.
      ctx.sens = motA(r, c, 'h') ? 'h' : 'v'
    }

    // Sur une case deja active, le focus ne bouge pas : focusin ne se
    // redeclenche donc pas et il faut rafraichir l affichage nous-memes.
    ctx.actif = { r, c }
    surligner(ctx)
  })

  grille.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement
    if (!input.dataset.r) return

    const brut = input.value.replace(/[^a-zA-ZÀ-ÿ]/g, '').toUpperCase()
    input.value = brut.slice(-1)
    input.parentElement?.classList.remove('cw-cell--fausse')

    if (input.value) avancer(ctx, 1)
    void sauvegarder(ctx)
    majMotFinal(ctx)
  })

  grille.addEventListener('keydown', (e) => {
    const input = e.target as HTMLInputElement
    if (!input.dataset.r) return
    const r = Number(input.dataset.r)
    const c = Number(input.dataset.c)

    switch (e.key) {
      case 'ArrowRight': e.preventDefault(); ctx.sens = 'h'; aller(ctx, r, c + 1, 0, 1); break
      case 'ArrowLeft': e.preventDefault(); ctx.sens = 'h'; aller(ctx, r, c - 1, 0, -1); break
      case 'ArrowDown': e.preventDefault(); ctx.sens = 'v'; aller(ctx, r + 1, c, 1, 0); break
      case 'ArrowUp': e.preventDefault(); ctx.sens = 'v'; aller(ctx, r - 1, c, -1, 0); break
      case ' ':
        e.preventDefault()
        ctx.sens = ctx.sens === 'h' ? 'v' : 'h'
        surligner(ctx)
        break
      case 'Backspace':
        if (input.value === '') {
          e.preventDefault()
          avancer(ctx, -1)
        } else {
          input.parentElement?.classList.remove('cw-cell--fausse')
          window.setTimeout(() => void sauvegarder(ctx), 0)
        }
        break
      case 'Tab':
        e.preventDefault()
        motSuivant(ctx, e.shiftKey ? -1 : 1)
        break
      default:
        break
    }
  })
}

function construireDefinitions(ctx: Contexte, root: ParentNode): void {
  const rendre = (liste: readonly Definition[], cible: HTMLElement | null, sens: Sens): void => {
    if (!cible) return
    cible.textContent = ''
    for (const d of liste) {
      const li = document.createElement('li')
      li.className = 'clue'
      li.dataset.n = String(d.n)
      li.dataset.sens = sens
      li.innerHTML = `<b>${d.n}.</b> `
      li.append(document.createTextNode(d.def))
      li.addEventListener('click', () => {
        ctx.sens = sens
        const cible2 = ctx.cellules[d.r]?.[d.c]
        if (cible2) poserActif(ctx, d.r, d.c, cible2)
      })
      cible.append(li)
    }
  }

  rendre(HORIZONTAL, root.querySelector<HTMLElement>('[data-clues="horizontal"]'), 'h')
  rendre(VERTICAL, root.querySelector<HTMLElement>('[data-clues="vertical"]'), 'v')
}

function construireMotFinal(ctx: Contexte): void {
  if (!ctx.motFinal) return
  ctx.motFinal.textContent = ''
  for (let i = 0; i < MOT_FINAL.length; i += 1) {
    const slot = document.createElement('span')
    slot.className = 'cw-final__case'
    ctx.motFinal.append(slot)
  }
}

function brancherOutils(ctx: Contexte, root: ParentNode): void {
  root.querySelector<HTMLButtonElement>('[data-crossword-check]')?.addEventListener('click', () => {
    verifier(ctx)
  })
  root.querySelector<HTMLButtonElement>('[data-crossword-clear]')?.addEventListener('click', () => {
    effacer(ctx)
  })
}

// --- Navigation -----------------------------------------------------------

/** Le mot qui passe par (r, c) dans ce sens, ou null s il n y en a pas. */
function motA(r: number, c: number, sens: Sens): { r: number; c: number; long: number } | null {
  if (!CASES[r]?.[c]) return null
  const dr = sens === 'v' ? 1 : 0
  const dc = sens === 'h' ? 1 : 0

  let r0 = r
  let c0 = c
  while (CASES[r0 - dr]?.[c0 - dc]) { r0 -= dr; c0 -= dc }

  let long = 0
  while (CASES[r0 + dr * long]?.[c0 + dc * long]) long += 1

  return long > 1 ? { r: r0, c: c0, long } : null
}

function surligner(ctx: Contexte): void {
  for (const el of ctx.grille.querySelectorAll('.cw-cell--mot')) {
    el.classList.remove('cw-cell--mot')
  }
  for (const el of document.querySelectorAll('.clue--active')) {
    el.classList.remove('clue--active')
  }

  const a = ctx.actif
  if (!a) return

  const mot = motA(a.r, a.c, ctx.sens) ?? motA(a.r, a.c, ctx.sens === 'h' ? 'v' : 'h')
  if (!mot) return
  if (!motA(a.r, a.c, ctx.sens)) ctx.sens = ctx.sens === 'h' ? 'v' : 'h'

  const dr = ctx.sens === 'v' ? 1 : 0
  const dc = ctx.sens === 'h' ? 1 : 0
  for (let i = 0; i < mot.long; i += 1) {
    ctx.cellules[mot.r + dr * i]?.[mot.c + dc * i]?.parentElement?.classList.add('cw-cell--mot')
  }

  const liste = ctx.sens === 'h' ? HORIZONTAL : VERTICAL
  const def = liste.find((d) => d.r === mot.r && d.c === mot.c)
  if (!def) return

  if (ctx.clue) {
    ctx.clue.innerHTML = `<b>${def.n} ${ctx.sens === 'h' ? 'horizontalement' : 'verticalement'}</b> — `
    ctx.clue.append(document.createTextNode(def.def))
  }

  const item = document.querySelector(`.clue[data-n="${def.n}"][data-sens="${ctx.sens}"]`)
  item?.classList.add('clue--active')
}

function aller(ctx: Contexte, r: number, c: number, dr: number, dc: number): void {
  let rr = r
  let cc = c
  while (rr >= 0 && cc >= 0 && rr < HAUTEUR && cc < LARGEUR) {
    const cible = ctx.cellules[rr]?.[cc]
    if (cible) { poserActif(ctx, rr, cc, cible); return }
    rr += dr
    cc += dc
  }
}

/**
 * Place le curseur sur une case.
 *
 * On met l etat a jour nous-memes au lieu d attendre focusin : cet evenement
 * ne part pas toujours (case deja active, fenetre sans le focus), et la saisie
 * restait alors bloquee sur la meme case.
 */
function poserActif(ctx: Contexte, r: number, c: number, input: HTMLInputElement): void {
  ctx.actif = { r, c }
  input.focus()
  input.select()
  surligner(ctx)
}

function avancer(ctx: Contexte, pas: number): void {
  const a = ctx.actif
  if (!a) return
  const dr = ctx.sens === 'v' ? pas : 0
  const dc = ctx.sens === 'h' ? pas : 0
  const cible = ctx.cellules[a.r + dr]?.[a.c + dc]
  if (cible) poserActif(ctx, a.r + dr, a.c + dc, cible)
}

function motSuivant(ctx: Contexte, pas: number): void {
  const liste = [...HORIZONTAL.map((d) => ({ d, sens: 'h' as Sens })), ...VERTICAL.map((d) => ({ d, sens: 'v' as Sens }))]
  const a = ctx.actif
  const courant = a
    ? liste.findIndex(({ d, sens }) => {
        const m = motA(a.r, a.c, sens)
        return sens === ctx.sens && m?.r === d.r && m?.c === d.c
      })
    : -1
  const suivant = liste[(courant + pas + liste.length) % liste.length]
  if (!suivant) return
  ctx.sens = suivant.sens
  const cible = ctx.cellules[suivant.d.r]?.[suivant.d.c]
  if (cible) poserActif(ctx, suivant.d.r, suivant.d.c, cible)
}

// --- Outils ---------------------------------------------------------------

function verifier(ctx: Contexte): void {
  let justes = 0
  let remplies = 0

  for (let r = 0; r < HAUTEUR; r += 1) {
    for (let c = 0; c < LARGEUR; c += 1) {
      const input = ctx.cellules[r]?.[c]
      const attendu = CASES[r]?.[c]?.l
      if (!input || !attendu) continue
      const cell = input.parentElement
      cell?.classList.remove('cw-cell--fausse')
      if (input.value === '') continue
      remplies += 1
      if (input.value === attendu) justes += 1
      else cell?.classList.add('cw-cell--fausse')
    }
  }

  if (!ctx.statut) return
  if (remplies === 0) {
    ctx.statut.textContent = 'Grille vide.'
  } else if (justes === remplies) {
    ctx.statut.textContent = `${justes} lettre${justes > 1 ? 's' : ''}, aucune erreur.`
  } else {
    const fausses = remplies - justes
    ctx.statut.textContent = `${fausses} lettre${fausses > 1 ? 's' : ''} à revoir.`
  }
}

function effacer(ctx: Contexte): void {
  for (const ligne of ctx.cellules) {
    for (const input of ligne) {
      if (!input) continue
      input.value = ''
      input.parentElement?.classList.remove('cw-cell--fausse')
    }
  }
  if (ctx.statut) ctx.statut.textContent = ''
  majMotFinal(ctx)
  void sauvegarder(ctx)
}

/** Les cases orange alimentent le mot final, dans l ordre de lecture. */
function majMotFinal(ctx: Contexte): void {
  if (!ctx.motFinal) return
  const slots = [...ctx.motFinal.children]
  let i = 0
  for (let r = 0; r < HAUTEUR; r += 1) {
    for (let c = 0; c < LARGEUR; c += 1) {
      if (!CASES[r]?.[c]?.o) continue
      const slot = slots[i]
      if (slot) slot.textContent = ctx.cellules[r]?.[c]?.value ?? ''
      i += 1
    }
  }
}

// --- Mémoire --------------------------------------------------------------

function sauvegarder(ctx: Contexte): Promise<void> {
  let s = ''
  for (let r = 0; r < HAUTEUR; r += 1) {
    for (let c = 0; c < LARGEUR; c += 1) {
      if (!CASES[r]?.[c]) continue
      s += ctx.cellules[r]?.[c]?.value || VIDE
    }
  }
  return store.set(CLE, s)
}

async function restaurer(ctx: Contexte): Promise<void> {
  const s = await store.get(CLE)
  if (!s) return
  let i = 0
  for (let r = 0; r < HAUTEUR; r += 1) {
    for (let c = 0; c < LARGEUR; c += 1) {
      if (!CASES[r]?.[c]) continue
      const ch = s[i] ?? VIDE
      i += 1
      const input = ctx.cellules[r]?.[c]
      if (input && ch !== VIDE) input.value = ch
    }
  }
  majMotFinal(ctx)
}
