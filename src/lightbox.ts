/**
 * La loupe.
 *
 * Les pages du carnet de Tunisie sont ecrites a la main : a la taille d'une
 * colonne de journal, on voit que c'est une belle page, on ne la lit pas. Un
 * clic ouvre donc l'image en grand, avec sa legende.
 *
 * On s'appuie sur <dialog> : le navigateur fournit le fond, le piege a focus
 * et la fermeture par Echap. Il ne reste que l'ouverture et le contenu.
 */

const ZOOMABLE = '.photo__frame img, .photo__slot img'

let dialog: HTMLDialogElement | null = null
let picture: HTMLImageElement | null = null
let legend: HTMLElement | null = null

function build(): HTMLDialogElement {
  const el = document.createElement('dialog')
  el.className = 'loupe'
  el.innerHTML = `
    <button class="loupe__close" type="button" aria-label="Fermer">&times;</button>
    <img class="loupe__img" alt="" />
    <p class="loupe__legend"></p>
  `
  document.body.append(el)

  picture = el.querySelector('.loupe__img')
  legend = el.querySelector('.loupe__legend')

  el.querySelector('.loupe__close')?.addEventListener('click', () => el.close())

  // Un clic hors de l'image ferme : le <dialog> occupe tout l'ecran, on
  // regarde donc si le clic a touche l'image ou la legende.
  el.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.loupe__img, .loupe__legend')) el.close()
  })

  return el
}

/** Legende affichee sous l'image agrandie : celle de la figure, sinon l'alt. */
function captionFor(img: HTMLImageElement): string {
  const figure = img.closest('figure')
  const caption = figure?.querySelector('figcaption')?.textContent?.trim()
  return caption || img.alt
}

function open(img: HTMLImageElement): void {
  dialog ??= build()
  if (!picture || !legend) return

  picture.src = img.currentSrc || img.src
  picture.alt = img.alt
  legend.textContent = captionFor(img)
  dialog.showModal()
}

export function setupLightbox(): void {
  document.querySelectorAll<HTMLImageElement>(ZOOMABLE).forEach((img) => {
    const frame = img.parentElement
    if (!frame) return

    frame.classList.add('is-zoomable')
    frame.tabIndex = 0
    frame.setAttribute('role', 'button')
    frame.setAttribute('aria-label', `Agrandir : ${captionFor(img)}`)

    // Le journal ecoute les balayages : un clic sur l'image ne doit pas
    // tourner la page.
    frame.addEventListener('click', (event) => {
      event.stopPropagation()
      open(img)
    })

    frame.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      open(img)
    })
  })
}
