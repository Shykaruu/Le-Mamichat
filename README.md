# Le Canard Orange

Maquette de **journal rétro interactif** : on tourne les pages à l'écran comme on
tournerait celles d'un quotidien papier.

Le contenu actuel est provisoire — le but de cette première version est la
maquette : palette, typographie, grille et moteur de tourne-page.

## Direction artistique

| Rôle | Couleur | Variable |
| --- | --- | --- |
| Fond papier | `#EDE5D7` | `--paper-100` |
| Encre | `#1F1B16` | `--ink` |
| Accent primaire | `#F0692F` | `--orange` |
| Accent secondaire (complémentaire) | `#1F6FA8` | `--blue` |

Typographie : `UnifrakturCook` (bandeau de titre), **`Rubik Dirt`** (gros titres),
`Archivo` (intertitres, boutons), `Source Serif 4` (labeur), `Space Mono`
(mentions, folios). Un grain SVG en `mix-blend-mode: multiply` donne le rendu
« imprimé ».

Le titrage est volontairement **imparfait** : Rubik Dirt est une grasse large aux
bords rongés, façon tampon encré. Pour repasser à une condensée nette, il suffit
d'inverser deux tokens dans `tokens.css` :

```css
--font-display: var(--font-display-alt); /* Anton */
```

Attention si vous changez de police de titrage : le `line-height` des `.headline`
est réglé à `1.05` parce que les bords rongés débordent du cadran. Une condensée
comme Anton supporte `0.98`, pas moins — en dessous les lignes se chevauchent.

## Démarrer

```bash
npm install
```

```bash
npm run dev
```

Puis `npm run build` (typecheck + bundle dans `dist/`) et `npm run preview`.

## Naviguer dans le journal

- `←` / `→` ou `Page préc.` / `Page suiv.` : tourner une page
- `Début` / `Fin` : couverture / dernière page
- Balayage horizontal au doigt sur mobile
- Pastilles rondes : accès direct à un feuillet

Au-dessus de 900 px, le journal s'affiche en **double page** avec rotation 3D
autour de la reliure. En dessous, il bascule automatiquement en **page unique**
avec transition latérale.


## La règle des pages : rien ne défile

Une page de journal a une hauteur fixe. Ce qui ne rentre pas doit être **coupé,
raccourci ou déplacé sur une autre page** — jamais mis derrière une barre de
défilement. Les pages sont donc en `overflow: hidden`.

Pour ne pas juger ça à l’œil, `npm run dev` active un détecteur : toute page
trop pleine est cerclée de rouge et affiche son dépassement en pixels, et la
console résume l’état des 18 pages. Voir [src/fit.ts](src/fit.ts).

Tout est dimensionné en `cqw` (pourcentage de la largeur de page) et la page
garde le même rapport 0,74 partout — écran large, téléphone, papier. Une mise en
page qui tient à une taille tient donc à toutes.

## Version imprimée

`Ctrl` + `P` : le livre se déplie, une page du journal par feuille, dans
l’ordre. Pas de 3D, pas de commandes, pas de grain, et les aplats de couleur
sortent bien à l’impression. Voir [src/styles/print.css](src/styles/print.css).

## Photos et vidéos

Tout se dépose dans [public/images/](public/images/LISEZMOI.md), un sous-dossier
par thème. Les vidéos vont dans `public/images/videos/` : elles sont exclues
de git (limite de 100 Mo par fichier sur GitHub) mais partent bien avec le site.

## Structure

```
index.html              tout le contenu éditorial (une page = une .face)
src/main.ts             câblage de l'interface (boutons, pastilles, compteur)
src/flipbook.ts         moteur de tourne-page, sans dépendance
src/styles/tokens.css   couleurs, typo, espacements, textures
src/styles/base.css     reset et fondations
src/styles/book.css     mise en scène du livre + commandes
src/styles/newspaper.css composants éditoriaux (titres, colonnes, encarts)
```

## Ajouter une page

Les pages vont **par deux** : une feuille (`.sheet`) porte un recto
(`.face--front`) et un verso (`.face--back`). Pour allonger le journal, ajoutez
une `.sheet` complète dans `.book` — le compteur, les pastilles et la barre de
progression s'adaptent tout seuls.

```html
<div class="sheet">
  <div class="face face--front"><article class="page">…</article></div>
  <div class="face face--back"><article class="page">…</article></div>
</div>
```

## Boîte à outils éditoriale

Classes disponibles dans `newspaper.css` :

- Titres : `.kicker` (+ `--orange`, `--ghost`), `.headline` (+ `--xl`, `--md`,
  `--sm`, `--orange`, `--blue`), `.deck`, `.byline`, `.subhead`
- Texte : `.columns` (+ `--1`, `--3`), `.dropcap`, `.pullquote`
- Encadrés : `.box` (+ `--accent`, `--blue`), `.stamp` (+ `--blue`), `.toc`
- Images : `.plate` (+ `--orange`, `--paper`, `--tall`, `--wide`), `.caption`
- Filets : `.rule` (+ `--thick`, `--double`, `--orange`)

Chaque page est un *container* CSS : les tailles sont exprimées en `cqw`, donc la
maquette reste identique quelle que soit la taille de l'écran.

## Notes techniques

- Aucune dépendance d'exécution : le tourne-page est écrit à la main en
  TypeScript.
- `prefers-reduced-motion` est respecté (rotation désactivée).
- Les pages non visibles sont `inert` + `aria-hidden`.
