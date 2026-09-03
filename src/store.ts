/**
 * Stockage de l'etat du journal (bons detaches, et plus tard tout ce qui
 * doit survivre a un rechargement).
 *
 * Aujourd'hui : le navigateur du lecteur, chacun voit ses propres bons.
 * Demain : une vraie base partagee, pour que toute la famille voie les memes.
 * Tout passe par cette interface, donc le jour ou l'on branche une base,
 * rien d'autre ne bouge dans le journal.
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
