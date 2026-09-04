import './styles/tokens.css'
import './styles/base.css'
import './styles/book.css'
import './styles/newspaper.css'
import './styles/sections.css'
import './styles/astres.css'
import './styles/rubriques.css'
import './styles/crossword.css'
import './styles/print.css'

import { Flipbook, type FlipbookState } from './flipbook'
import { setupCoupons } from './coupons'
import { setupCrossword } from './crossword'
import { setupLightbox } from './lightbox'
import { setupFilm } from './film'
import { watchFit } from './fit'

const book = document.querySelector<HTMLElement>('.book')
const prevBtn = document.querySelector<HTMLButtonElement>('[data-action="prev"]')
const nextBtn = document.querySelector<HTMLButtonElement>('[data-action="next"]')
const counter = document.querySelector<HTMLElement>('[data-counter]')
const progress = document.querySelector<HTMLElement>('[data-progress]')
const pager = document.querySelector<HTMLElement>('[data-pager]')

if (!book) throw new Error('Aucun element .book dans le document.')

// Declare avant le Flipbook : son constructeur declenche deja un update().
const dots: HTMLButtonElement[] = []

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
