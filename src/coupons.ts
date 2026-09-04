/**
 * Bons a detacher.
 *
 * Un bon se dechire pour de vrai : le papier pivote le long de la ligne de
 * perforation, tombe hors de la page, et laisse un talon dans le journal.
 *
 * Rien n'est conserve : au rechargement, tous les bons sont de nouveau
 * attaches. C'est un geste, pas une comptabilite -- et chacun doit pouvoir
 * refaire le geste.
 */

const TEAR_MS = 900

export function setupCoupons(root: ParentNode = document): void {
  const coupons = root.querySelectorAll<HTMLElement>('.coupon[data-coupon]')

  for (const coupon of coupons) {
    const button = coupon.querySelector<HTMLButtonElement>('.coupon__tear')
    const stub = coupon.querySelector<HTMLElement>('.coupon__stub')

    button?.addEventListener('click', () => {
      if (coupon.classList.contains('is-torn') || coupon.classList.contains('is-tearing')) return

      coupon.classList.add('is-tearing')
      button.disabled = true

      window.setTimeout(() => {
        coupon.classList.remove('is-tearing')
        coupon.classList.add('is-torn')
        writeStubDate(stub, new Date())
      }, TEAR_MS)
    })
  }
}

/** Inscrit la date d'utilisation sur le talon, comme un tampon de caisse. */
function writeStubDate(stub: HTMLElement | null, date: Date): void {
  const slot = stub?.querySelector<HTMLElement>('[data-stub-date]')
  if (!slot) return

  slot.textContent = date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
