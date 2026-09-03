/**
 * Detecteur de debordement.
 *
 * Une page de journal a une hauteur fixe : tout ce qui depasse est perdu, a
 * l'ecran comme a l'impression. Ce module mesure chaque page et signale celles
 * qui sont trop pleines, pour qu'on coupe ou qu'on deplace le texte en trop.
 *
 * Actif uniquement en developpement : `npm run dev`.
 */

export interface PageFit {
  /** Numero de page tel qu'il est imprime en bas de page. */
  folio: number
  /** Hauteur du contenu, en pixels. */
  content: number
  /** Hauteur disponible, en pixels. */
  available: number
  /** Depassement en pourcentage de la hauteur disponible. Negatif = il reste de la place. */
  overflow: number
}

const TOLERANCE = 1 // px : marge d'arrondi du navigateur

export function checkFit(root: ParentNode = document): PageFit[] {
  const pages = root.querySelectorAll<HTMLElement>('.page')
  const report: PageFit[] = []

  pages.forEach((page, index) => {
    const content = page.scrollHeight
    const available = page.clientHeight
    const excess = content - available
    const ratio = available === 0 ? 0 : (excess / available) * 100

    page.classList.toggle('is-overflowing', excess > TOLERANCE)
    if (excess > TOLERANCE) {
      page.dataset.overflow = `page ${index + 1} : +${Math.round(excess)} px (${ratio.toFixed(0)} %)`
    } else {
      delete page.dataset.overflow
    }

    report.push({
      folio: index + 1,
      content,
      available,
      overflow: Number(ratio.toFixed(1)),
    })
  })

  return report
}

/** Branche le detecteur : au chargement, puis a chaque redimensionnement. */
export function watchFit(): void {
  const run = (): void => {
    const report = checkFit()
    const tooFull = report.filter((p) => p.overflow > 0)

    if (tooFull.length === 0) {
      console.info('%cMise en page : les 16 pages tiennent.', 'color:#1F6FA8;font-weight:bold')
      return
    }

    console.warn(`Mise en page : ${tooFull.length} page(s) débordent.`)
    console.table(tooFull)
  }

  // Les polices changent les hauteurs : on attend qu'elles soient chargees.
  void document.fonts.ready.then(() => window.setTimeout(run, 60))

  let timer = 0
  window.addEventListener('resize', () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(run, 200)
  })
}
