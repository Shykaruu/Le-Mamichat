/**
 * Stockage de ce qui doit survivre a un rechargement.
 *
 * Une seule chose en depend : la grille de mots croises en cours, qu'il serait
 * cruel de perdre en rafraichissant. Les bons a detacher, eux, ne sont
 * volontairement PAS conserves -- se dechirer est un geste, et chacun doit
 * pouvoir le refaire.
 */

export interface JournalStore {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<void>
  remove(key: string): Promise<void>
}

const PREFIX = 'mamichat:'

/** Implementation locale. Silencieuse si le navigateur refuse le stockage. */
class LocalStore implements JournalStore {
  async get(key: string): Promise<string | null> {
    try {
      return window.localStorage.getItem(PREFIX + key)
    } catch {
      return null
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      window.localStorage.setItem(PREFIX + key, value)
    } catch {
      /* navigation privee, quota plein : on continue sans mémoriser */
    }
  }

  async remove(key: string): Promise<void> {
    try {
      window.localStorage.removeItem(PREFIX + key)
    } catch {
      /* idem */
    }
  }
}

export const store: JournalStore = new LocalStore()
