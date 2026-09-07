import './styles/tokens.css'
import './styles/base.css'
import './styles/book.css'
import './styles/newspaper.css'
import './styles/sections.css'
import './styles/astres.css'
import './styles/rubriques.css'
import './styles/crossword.css'
import './styles/bons.css'
import './styles/world-tour.css'
import './styles/print.css'
import './styles/music.css'
import './styles/bonus.css'

import { Flipbook, type FlipbookState } from './flipbook'
import { setupCoupons } from './coupons'
import { setupCrossword } from './crossword'
import { setupLightbox } from './lightbox'
import { setupFilm } from './film'
import { setupMusicPlayer } from './music'
import { watchFit } from './fit'

const book = document.querySelector<HTMLElement>('.book')
const prevBtn = document.querySelector<HTMLButtonElement>('[data-action="prev"]')
const nextBtn = document.querySelector<HTMLButtonElement>('[data-action="next"]')
const counter = document.querySelector<HTMLElement>('[data-counter]')
const progress = document.querySelector<HTMLElement>('[data-progress]')
const pager = document.querySelector<HTMLElement>('[data-pager]')

const READING_POSITION_KEY = 'mamichat:reading-position'

type ReadingPosition = {
  page: number
  spread: number
}

function loadReadingPosition(): ReadingPosition | null {
  try {
    const raw = localStorage.getItem(READING_POSITION_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<ReadingPosition>

    if (
        typeof parsed.page !== 'number' ||
        typeof parsed.spread !== 'number'
    ) {
      return null
    }

    return {
      page: parsed.page,
      spread: parsed.spread,
    }
  } catch {
    return null
  }
}

function loadPageFromUrl(): number | null {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('page')

  if (!raw) return null

  const page = Number.parseInt(raw, 10)

  if (!Number.isInteger(page) || page < 1) {
    return null
  }

  // L'URL utilise des pages humaines : page=19.
  // Flipbook utilise un index commençant à 0 : 18.
  return page - 1
}

function saveReadingPosition(state: FlipbookState): void {
  try {
    localStorage.setItem(
        READING_POSITION_KEY,
        JSON.stringify({
          page: state.page,
          spread: state.spread,
        }),
    )
  } catch {
    // localStorage indisponible : on laisse simplement le journal fonctionner.
  }
}

if (!book) throw new Error('Aucun element .book dans le document.')

// La page 20 remplace l'ancien player : le feuillet historique en doublon ne
// doit pas compter dans la pagination ni initialiser un deuxième lecteur.
const legacyMusicSheet = book
  .querySelectorAll<HTMLElement>('[data-music-player]')[1]
  ?.closest<HTMLElement>('.sheet')
legacyMusicSheet?.remove()

// Le cahier bonus se lit avant la dernière : le feuillet de clôture reste bien
// la conclusion du journal, quelle que soit la quantité de bonus ajoutés.
const finalSheet = book.querySelector<HTMLElement>('.finale')?.closest<HTMLElement>('.sheet')
if (finalSheet) book.append(finalSheet)

function mergeArticleContinuation(
  root: HTMLElement,
  selector: string,
  contentSelector: string,
): void {
  const pages = Array.from(root.querySelectorAll<HTMLElement>(selector))
  const [first, continuation] = pages
  const target = first?.querySelector<HTMLElement>(contentSelector)
  const source = continuation?.querySelector<HTMLElement>(contentSelector)

  if (!first || !continuation || !target || !source) return

  target.append(...Array.from(source.children))
  continuation.querySelector<HTMLElement>('.sources')?.remove()
  continuation.closest<HTMLElement>('.face')?.remove()
}

mergeArticleContinuation(book, '[data-rub="philo"]', '.bonus-copy')
mergeArticleContinuation(book, '[data-rub="faits"]', '.faits')

// Les articles regroupés laissent deux faces vides : on recompose les
// feuillets dans l'ordre éditorial plutôt que de conserver des pages blanches.
const faces = Array.from(book.querySelectorAll<HTMLElement>('.face'))
book.querySelectorAll<HTMLElement>('.sheet').forEach((sheet) => sheet.remove())
for (let index = 0; index < faces.length; index += 2) {
  const sheet = document.createElement('div')
  sheet.className = 'sheet'

  faces.slice(index, index + 2).forEach((face, faceIndex) => {
    face.classList.remove('face--front', 'face--back')
    face.classList.add(faceIndex === 0 ? 'face--front' : 'face--back')
    sheet.append(face)
  })

  book.append(sheet)
}

book.querySelectorAll<HTMLElement>('.face .page').forEach((page, index) => {
  const folio = index + 1
  page.querySelector<HTMLElement>('.flag__folio b')?.replaceChildren(String(folio))
  const colophon = page.querySelector<HTMLElement>('.colophon')
  if (colophon) {
    colophon.querySelector<HTMLElement>('span:last-child')?.replaceChildren(`Page ${folio}`)
  } else if (!page.classList.contains('page--field')) {
    const footer = document.createElement('footer')
    footer.className = 'colophon'
    footer.innerHTML = `<span>Le Mamichat</span><span>Page ${folio}</span>`
    page.append(footer)
  }
})

// Declare avant le Flipbook : son constructeur declenche deja un update().
const dots: HTMLButtonElement[] = []

const requestedPage = loadPageFromUrl()
const savedReadingPosition = loadReadingPosition()
let restoringReadingPosition = true

const flipbook = new Flipbook(book, { onChange: update })

// --- Pastilles de navigation (une par feuille + la couverture) -------------
if (pager) {
  for (let index = 0; index <= flipbook.spreadCount; index += 1) {
    const dot = document.createElement('button')
    dot.type = 'button'
    dot.className = 'pager__dot'
    dot.dataset.spread = String(index)
    dot.setAttribute('aria-label', index === 0 ? 'Couverture' : `Feuillet ${index}`)
    dot.addEventListener('click', () => goToSpread(index))
    pager.append(dot)
    dots.push(dot)
  }
}

// --- Restauration de la position de lecture -------------------------------
// Priorité :
// 1. ?page=XX dans l'URL
// 2. dernière position enregistrée dans localStorage
// 3. couverture par défaut

if (requestedPage !== null) {
  const page = Math.max(
      0,
      Math.min(
          requestedPage,
          flipbook.state.pageCount - 1,
      ),
  )

  flipbook.goToPage(page)
} else if (savedReadingPosition) {
  if (flipbook.state.mode === 'single') {
    const page = Math.max(
        0,
        Math.min(
            savedReadingPosition.page,
            flipbook.state.pageCount - 1,
        ),
    )

    flipbook.goToPage(page)
  } else {
    const spread = Math.max(
        0,
        Math.min(
            savedReadingPosition.spread,
            flipbook.spreadCount,
        ),
    )

    flipbook.goToSpread(spread)
  }
}

restoringReadingPosition = false

// Enregistre aussi immédiatement la position réellement restaurée.
saveReadingPosition(flipbook.state)

function goToSpread(index: number): void {
  if (flipbook.state.mode === 'single') {
    flipbook.goToPage(index === 0 ? 0 : index * 2 - 1)
  } else {
    flipbook.goToSpread(index)
  }
}

// --- Boutons ---------------------------------------------------------------
prevBtn?.addEventListener('click', () => flipbook.prev())
nextBtn?.addEventListener('click', () => flipbook.next())

// --- Synchronisation de l'interface ---------------------------------------
function update(state: FlipbookState): void {
  if (prevBtn) prevBtn.disabled = !state.canPrev
  if (nextBtn) nextBtn.disabled = !state.canNext

  if (counter) {
    counter.innerHTML = `<b>${pad(state.page + 1)}</b> / ${pad(state.pageCount)}`
  }

  if (progress) {
    progress.style.width = `${Math.round(state.progress * 100)}%`
  }

  dots.forEach((dot, index) => {
    dot.setAttribute('aria-current', index === state.spread ? 'true' : 'false')
  })

  const root = document.documentElement
  root.dataset.spread = String(state.spread)

  // Derniere feuille tournee : plus de page a droite, on recentre.
  if (state.spread >= state.spreadCount) root.dataset.closing = ''
  else delete root.dataset.closing

  if (!restoringReadingPosition) {
    saveReadingPosition(state)
  }
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

// Rend le journal accessible depuis la console pour bidouiller pendant le dev.
declare global {
  interface Window {
    flipbook: Flipbook
  }
}

window.flipbook = flipbook

setupCoupons()
setupCrossword()
setupLightbox()
setupFilm()
setupMusicPlayer()

// Controle de mise en page : signale les pages trop pleines pendant le dev.
if (import.meta.env.DEV) watchFit()

// Les pastilles sont creees apres coup : on resynchronise l'interface.
update(flipbook.state)

// Export PDF : on passe par l'impression du navigateur, qui sait enregistrer
// en PDF. La feuille de style d'impression remet au passage tous les bons.

document.querySelector<HTMLButtonElement>('[data-action="pdf"]')?.addEventListener(
  'click',
  () => window.print(),
)
