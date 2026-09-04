import { defineConfig } from 'vite'

// Le port peut etre impose par l'environnement (PORT), pour qu'on puisse
// ouvrir deux previsualisations du journal en meme temps. `process` n'est pas
// type ici : le projet n'embarque pas @types/node, et c'est le seul endroit
// qui en aurait besoin.
const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
const port = Number(env?.PORT) || 5173

export default defineConfig({
  base: './',
  server: { port, strictPort: false },
  build: { outDir: 'dist', assetsDir: 'assets' },
})
