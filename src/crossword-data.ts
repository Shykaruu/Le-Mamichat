/**
 * Grille des mots croisés — données générées, ne pas modifier à la main.
 *
 * Produites par un générateur qui croise les 22 mots sans jamais créer de mot
 * parasite, puis choisit six cases qui, lues de gauche à droite et de haut en
 * bas, épellent le mot final.
 */

export interface Case {
  /** La lettre attendue. */
  l: string
  /** Numéro affiché, si la case commence un mot. */
  n?: number
  /** Case entourée : elle participe au mot final. */
  o?: boolean
}

export interface Definition {
  n: number
  mot: string
  def: string
  r: number
  c: number
}

export const LARGEUR = 24
export const HAUTEUR = 24
export const MOT_FINAL = "HABIBI"

export const CASES: readonly (Case | null)[][] = [
  [null, null, null, null, null, null, null, null, null, null, null, null, null, { l: "G", n: 1 }, null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null, null, null, { l: "J", n: 2 }, { l: "A" }, { l: "S" }, { l: "M" }, { l: "I" }, { l: "N" }, null, null, null, null, null, null],
  [null, null, { l: "J", n: 3 }, null, null, null, null, null, null, null, null, null, null, { l: "L" }, null, null, null, null, null, null, null, null, null, { l: "B", n: 4 }],
  [null, { l: "M", n: 5 }, { l: "A" }, { l: "R" }, { l: "I" }, { l: "N" }, { l: "E" }, null, null, { l: "M", n: 6 }, { l: "I" }, { l: "C" }, { l: "H", o: true }, { l: "A", o: true }, { l: "E" }, { l: "L" }, null, null, null, null, null, null, null, { l: "I" }],
  [null, null, { l: "N" }, null, null, null, null, null, null, { l: "A" }, null, null, null, { l: "P" }, null, null, null, null, null, null, null, null, null, { l: "Z" }],
  [null, null, { l: "D" }, null, null, null, null, null, null, { l: "K" }, null, { l: "P", n: 7 }, null, { l: "A", n: 8 }, { l: "N" }, { l: "T" }, { l: "A" }, { l: "R" }, { l: "C" }, { l: "T" }, { l: "I" }, { l: "Q" }, { l: "U" }, { l: "E" }],
  [null, null, { l: "I" }, null, null, null, { l: "M", n: 9 }, { l: "O" }, { l: "O" }, { l: "R" }, { l: "E" }, { l: "A" }, null, { l: "G" }, null, null, null, null, null, null, null, null, null, { l: "R" }],
  [null, null, { l: "R" }, null, { l: "P", n: 10 }, null, { l: "A" }, null, null, { l: "O" }, null, { l: "C" }, null, { l: "O" }, null, null, { l: "K", n: 11 }, null, null, null, null, null, null, { l: "T" }],
  [null, { l: "G", n: 12 }, { l: "A" }, { l: "F" }, { l: "O" }, { l: "U" }, { l: "R" }, null, null, { l: "U" }, null, { l: "H" }, null, { l: "S", n: 13 }, { l: "A" }, { l: "L" }, { l: "A" }, { l: "M" }, { l: "M" }, { l: "B", n: 14, o: true }, { l: "O" }, null, null, { l: "E" }],
  [null, null, null, null, { l: "M" }, null, { l: "I", o: true }, null, null, { l: "D" }, null, { l: "A" }, null, null, null, null, { l: "R" }, null, null, { l: "O" }, null, { l: "T", n: 15 }, null, null],
  [null, null, null, null, { l: "P" }, null, { l: "E" }, null, null, null, null, null, { l: "M", n: 16 }, { l: "O" }, { l: "N" }, { l: "O" }, { l: "I" }, null, { l: "G", n: 17 }, { l: "U" }, { l: "Y" }, { l: "A" }, { l: "N" }, { l: "E" }],
  [null, null, null, null, { l: "I" }, null, { l: "T" }, null, null, null, null, { l: "S", n: 18 }, null, null, null, null, { l: "N" }, null, null, { l: "S" }, null, { l: "M" }, null, null],
  [null, null, null, { l: "C", n: 19 }, { l: "E" }, { l: "S" }, { l: "T" }, { l: "I" }, { l: "N" }, { l: "C" }, { l: "R" }, { l: "O" }, { l: "Y" }, { l: "A" }, { l: "B", o: true }, { l: "L" }, { l: "E" }, null, null, { l: "S" }, null, { l: "P" }, null, null],
  [null, null, null, null, { l: "R" }, null, { l: "A" }, null, null, null, null, { l: "U" }, null, null, null, null, null, null, { l: "U", n: 20 }, { l: "A" }, { l: "P" }, { l: "O" }, { l: "U" }, null],
  [null, null, { l: "C", n: 21 }, null, { l: "S" }, null, null, null, { l: "D", n: 22 }, { l: "J" }, { l: "E" }, { l: "R" }, { l: "B" }, { l: "A" }, null, null, null, { l: "S", n: 23 }, null, { l: "Y" }, null, { l: "N" }, null, { l: "O", n: 24 }],
  [null, null, { l: "H" }, null, null, null, null, null, null, null, null, { l: "I", o: true }, null, null, null, null, null, { l: "O" }, null, null, null, null, null, { l: "C" }],
  [null, null, { l: "A" }, null, null, null, { l: "S", n: 25 }, null, null, { l: "E", n: 26 }, { l: "L" }, { l: "S" }, { l: "A" }, null, null, { l: "L", n: 27 }, null, { l: "L", n: 28 }, { l: "E" }, { l: "C" }, { l: "T" }, { l: "U" }, { l: "R" }, { l: "E" }],
  [null, null, { l: "R" }, null, null, null, { l: "H" }, null, null, null, null, { l: "B" }, null, { l: "F", n: 29 }, null, { l: "U" }, null, { l: "E" }, null, null, null, null, null, { l: "A" }],
  [{ l: "D", n: 30 }, { l: "O" }, { l: "L" }, { l: "I" }, { l: "P" }, { l: "R" }, { l: "A" }, { l: "N" }, { l: "E" }, null, null, { l: "L" }, null, { l: "R" }, null, { l: "C" }, null, { l: "I" }, null, null, null, null, null, { l: "N" }],
  [null, null, { l: "O" }, null, null, null, { l: "L" }, null, null, null, { l: "F", n: 31 }, { l: "A" }, { l: "R" }, { l: "E" }, { l: "W" }, { l: "E" }, { l: "L" }, { l: "L" }, null, null, null, null, null, null],
  [null, null, { l: "T" }, null, null, null, { l: "I" }, null, null, null, null, { l: "N" }, null, { l: "G" }, null, { l: "T" }, null, null, null, null, null, null, null, null],
  [null, null, null, { l: "Z", n: 32 }, { l: "O" }, { l: "U" }, { l: "M" }, { l: "B" }, { l: "A" }, null, null, { l: "C", n: 33 }, { l: "H" }, { l: "A" }, { l: "N" }, { l: "T" }, { l: "I" }, { l: "L" }, { l: "L" }, { l: "Y" }, null, null, null, null],
  [null, null, null, null, null, null, { l: "A" }, null, null, null, null, { l: "H" }, null, { l: "T" }, null, { l: "E" }, null, null, null, null, null, null, null, null],
  [null, null, null, null, { l: "C", n: 34 }, { l: "A" }, { l: "R" }, { l: "T" }, { l: "H" }, { l: "A" }, { l: "G" }, { l: "E" }, null, { l: "E" }, null, null, null, null, null, null, null, null, null, null],
]

export const HORIZONTAL: readonly Definition[] = [
  { n: 2, mot: "JASMIN", def: "Fleur blanche de Tunis", r: 1, c: 12 },
  { n: 5, mot: "MARINE", def: "Née à Moorea en 1979", r: 3, c: 1 },
  { n: 6, mot: "MICHAEL", def: "Son fils né à Cayenne", r: 3, c: 9 },
  { n: 8, mot: "ANTARCTIQUE", def: "Où elle est partie cuisiner", r: 5, c: 13 },
  { n: 9, mot: "MOOREA", def: "L'île de Marine", r: 6, c: 6 },
  { n: 12, mot: "GAFOUR", def: "Le village de Marietta", r: 8, c: 1 },
  { n: 13, mot: "SALAMMBO", def: "Faubourg des dimanches en famille", r: 8, c: 13 },
  { n: 16, mot: "MONOI", def: "Huile parfumée des îles", r: 10, c: 12 },
  { n: 17, mot: "GUYANE", def: "Où elle rencontre Fabien", r: 10, c: 18 },
  { n: 19, mot: "CESTINCROYABLE", def: "Son expression favorite", r: 12, c: 3 },
  { n: 20, mot: "UAPOU", def: "L'île où elle a enseigné", r: 13, c: 18 },
  { n: 22, mot: "DJERBA", def: "On y campait sur la plage", r: 14, c: 8 },
  { n: 26, mot: "ELSA", def: "Née à Nuku-Hiva", r: 16, c: 9 },
  { n: 28, mot: "LECTURE", def: "Voyager sans quitter son fauteuil", r: 16, c: 17 },
  { n: 30, mot: "DOLIPRANE", def: "Le comprimé qui arrange tout", r: 18, c: 0 },
  { n: 31, mot: "FAREWELL", def: "La goélette du tour du monde", r: 19, c: 10 },
  { n: 32, mot: "ZOUMBA", def: "La chienne du bord", r: 21, c: 3 },
  { n: 33, mot: "CHANTILLY", def: "Sa crème, forcément", r: 21, c: 11 },
  { n: 34, mot: "CARTHAGE", def: "Sa ville natale", r: 23, c: 4 },
]

export const VERTICAL: readonly Definition[] = [
  { n: 1, mot: "GALAPAGOS", def: "Archipel croisé sur Jandira", r: 0, c: 13 },
  { n: 3, mot: "JANDIRA", def: "Le premier bateau", r: 2, c: 2 },
  { n: 4, mot: "BIZERTE", def: "Sa guerre de 1961", r: 2, c: 23 },
  { n: 6, mot: "MAKROUD", def: "Gâteau tunisien aux dattes", r: 3, c: 9 },
  { n: 7, mot: "PACHA", def: "Le surnom de Fabien", r: 5, c: 11 },
  { n: 9, mot: "MARIETTA", def: "Grand-mère sicilienne et pâtissière", r: 6, c: 6 },
  { n: 10, mot: "POMPIERS", def: "« Je vais appeler les… »", r: 7, c: 4 },
  { n: 11, mot: "KARINE", def: "Sa fille, qui signe ce journal", r: 7, c: 16 },
  { n: 14, mot: "BOUSSAY", def: "Le village d'Indre-et-Loire", r: 8, c: 19 },
  { n: 15, mot: "TAMPON", def: "Sa commune de La Réunion", r: 9, c: 21 },
  { n: 18, mot: "SOURISBLANCHE", def: "La maison de La Réunion", r: 11, c: 11 },
  { n: 21, mot: "CHARLOT", def: "Imité par son frère Marc", r: 14, c: 2 },
  { n: 23, mot: "SOLEIL", def: "Ce que Karine est pour elle", r: 14, c: 17 },
  { n: 24, mot: "OCEAN", def: "Immense étendue bleue", r: 14, c: 23 },
  { n: 25, mot: "SHALIMAR", def: "Le flacon cassé à l'adolescence", r: 16, c: 6 },
  { n: 27, mot: "LUCETTE", def: "Sa mère, infirmière à Tunis", r: 16, c: 15 },
  { n: 29, mot: "FREGATE", def: "La voiture d'après la 203", r: 17, c: 13 },
]
