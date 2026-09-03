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
  { n: 2, mot: "JASMIN", def: "Fleur blanche au parfum délicat.", r: 1, c: 12 },
  { n: 5, mot: "MARINE", def: "Sœur née à Moorea, le 1er septembre 1979.", r: 3, c: 1 },
  { n: 6, mot: "MICHAEL", def: "Frère né en Guyane, explorateur des étoiles, consultant au GEIPAN.", r: 3, c: 9 },
  { n: 8, mot: "ANTARCTIQUE", def: "Destination du Golden Fleece, en 2014 : elle y est partie cuisiner.", r: 5, c: 13 },
  { n: 9, mot: "MOOREA", def: "Île de Polynésie où est née Marine.", r: 6, c: 6 },
  { n: 12, mot: "GAFOUR", def: "Village tunisien de la grand-mère Marietta.", r: 8, c: 1 },
  { n: 13, mot: "SALAMMBO", def: "Faubourg de Carthage des dimanches en famille.", r: 8, c: 13 },
  { n: 16, mot: "MONOI", def: "Huile parfumée des îles, synonyme de vacances et de douceur.", r: 10, c: 12 },
  { n: 17, mot: "GUYANE", def: "Département d'outre-mer où elle a rencontré Fabien.", r: 10, c: 18 },
  { n: 19, mot: "CESTINCROYABLE", def: "Expression favorite, prononcée avec conviction.", r: 12, c: 3 },
  { n: 20, mot: "UAPOU", def: "Île des Marquises où Maman a repris le métier de professeure.", r: 13, c: 18 },
  { n: 22, mot: "DJERBA", def: "Île où l'on campait sur la plage, avant les hôtels.", r: 14, c: 8 },
  { n: 26, mot: "ELSA", def: "Sœur née à Nuku Hiva.", r: 16, c: 9 },
  { n: 28, mot: "LECTURE", def: "Façon de voyager sans bouger de son fauteuil.", r: 16, c: 17 },
  { n: 30, mot: "DOLIPRANE", def: "Le petit comprimé qui peut parfois tout arranger.", r: 18, c: 0 },
  { n: 31, mot: "FAREWELL", def: "Goélette de dix-sept mètres du tour du monde vers l'ouest.", r: 19, c: 10 },
  { n: 32, mot: "ZOUMBA", def: "Petite chienne adorable, fidèle compagne de tous leurs périples.", r: 21, c: 3 },
  { n: 33, mot: "CHANTILLY", def: "Crème célèbre… et mot qui lui ressemble forcément.", r: 21, c: 11 },
  { n: 34, mot: "CARTHAGE", def: "Cité tunisienne chargée d'histoire et de souvenirs.", r: 23, c: 4 },
]

export const VERTICAL: readonly Definition[] = [
  { n: 1, mot: "GALAPAGOS", def: "Archipel croisé sur Jandira, entre Panama et les Marquises.", r: 0, c: 13 },
  { n: 3, mot: "JANDIRA", def: "Premier bateau avec lequel l'aventure a commencé en famille.", r: 2, c: 2 },
  { n: 4, mot: "BIZERTE", def: "En 1961, sa guerre a écourté la colonie de vacances.", r: 2, c: 23 },
  { n: 6, mot: "MAKROUD", def: "Gâteau tunisien aux dattes, à déguster sans modération.", r: 3, c: 9 },
  { n: 7, mot: "PACHA", def: "Surnom de Fabien à bord du grand voyage.", r: 5, c: 11 },
  { n: 9, mot: "MARIETTA", def: "Grand-mère sicilienne, pâtissière et championne de tir à la carabine.", r: 6, c: 6 },
  { n: 10, mot: "POMPIERS", def: "« Je vais appeler les… » quand personne ne répond.", r: 7, c: 4 },
  { n: 11, mot: "KARINE", def: "Son « soleil »… et la fille qui signe ce journal.", r: 7, c: 16 },
  { n: 14, mot: "BOUSSAY", def: "Village d'Indre-et-Loire, cœur géographique de la famille.", r: 8, c: 19 },
  { n: 15, mot: "TAMPON", def: "La commune de La Réunion où la famille s'est posée en 1982.", r: 9, c: 21 },
  { n: 18, mot: "SOURISBLANCHE", def: "La maison de La Réunion, qu'un sous-préfet a inaugurée.", r: 11, c: 11 },
  { n: 21, mot: "CHARLOT", def: "Personnage que Marc imitait pour faire rire toute la famille.", r: 14, c: 2 },
  { n: 23, mot: "SOLEIL", def: "Ce que Karine est pour sa Maman.", r: 14, c: 17 },
  { n: 24, mot: "OCEAN", def: "Immense étendue bleue qui a accompagné tant de voyages.", r: 14, c: 23 },
  { n: 25, mot: "SHALIMAR", def: "Parfum précieux… et souvenir d'un flacon cassé à l'adolescence.", r: 16, c: 6 },
  { n: 27, mot: "LUCETTE", def: "Sa mère, infirmière des écoles de la banlieue nord de Tunis.", r: 16, c: 15 },
  { n: 29, mot: "FREGATE", def: "La voiture qui a succédé à la 203, coffre plein de matériel de camping.", r: 17, c: 13 },
]
