/**
 * Bons a detacher.
 *
 * Un bon se dechire pour de vrai : le papier pivote le long de la ligne de
 * perforation, tombe hors de la page, et laisse un talon dans le journal.
 * L'etat est conserve, donc un bon utilise le reste.
 */

import { store } from './store'

const TEAR_MS = 900

export function setupCoupons(root: ParentNode = document): void {
  const coupons = root.querySelectorAll<HTMLElement>('.coupon[data-coupon]')

  for (const coupon of coupons) {
    const id = coupon.dataset.coupon
    if (!id) continue

    const button = coupon.querySelector<HTMLButtonElement>('.coupon__tear')
    const stub = coupon.querySelector<HTMLElement>('.coupon__stub')

    // Restauration : un bon deja detache repart directement sur son talon.
    void store.get(`coupon:${id}`).then((value) => {
      if (!value) return
      coupon.classList.add('is-torn')
      writeStubDate(stub, value)
    })

    button?.addEventListener('click', () => {
      if (coupon.classList.contains('is-torn') || coupon.classList.contains('is-tearing')) return

      const stamp = new Date().toISOString()
      coupon.classList.add('is-tearing')
      button.disabled = true

      window.setTimeout(() => {
        coupon.classList.remove('is-tearing')
        coupon.classList.add('is-torn')
        writeStubDate(stub, stamp)
      }, TEAR_MS)

      void store.set(`coupon:${id}`, stamp)
    })
  }
}

/** Inscrit la date d'utilisation sur le talon, comme un tampon de caisse. */
function writeStubDate(stub: HTMLElement | null, iso: string): void {
  const slot = stub?.querySelector<HTMLElement>('[data-stub-date]')
  if (!slot) return

  const date = new Date(iso)
  slot.textContent = Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}
