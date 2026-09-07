export type SingerId = 'voice-a' | 'voice-b' | 'duo'

export type Singer = {
  id: SingerId
  name: string
  cssClass: string
}

export type KaraokeWord = {
  text: string
  start: number
  end: number
}

export type KaraokeLine = {
  singer: SingerId
  words: KaraokeWord[]
}

export type KaraokeTrack = {
  title: string
  artist: string
  singers: Singer[]
  lines: KaraokeLine[]
}

export const karaokeTrack: KaraokeTrack = {
  title: 'Tunis Goulette Marsa',
  artist: 'Deux interprètes',

  singers: [
    {
      id: 'voice-a',
      name: 'Dalichat',
      cssClass: 'music-rubric--voice-a',
    },
    {
      id: 'voice-b',
      name: 'Fabien Deloin',
      cssClass: 'music-rubric--voice-b',
    },
    {
      id: 'duo',
      name: 'Ensemble',
      cssClass: 'music-rubric--duo',
    },
  ],

  lines: [
    {
      singer: 'voice-a',
      words: [
        { text: 'Première', start: 4.20, end: 4.72 },
        { text: 'phrase',   start: 4.72, end: 5.20 },
        { text: 'chantée',  start: 5.20, end: 5.92 },
      ],
    },
    {
      singer: 'voice-b',
      words: [
        { text: 'Puis',     start: 6.50, end: 6.88 },
        { text: 'la',       start: 6.88, end: 7.08 },
        { text: 'deuxième', start: 7.08, end: 7.68 },
        { text: 'voix',     start: 7.68, end: 8.20 },
      ],
    },
    {
      singer: 'duo',
      words: [
        { text: 'Et',       start: 9.00, end: 9.25 },
        { text: 'les',      start: 9.25, end: 9.48 },
        { text: 'deux',     start: 9.48, end: 9.88 },
        { text: 'ensemble', start: 9.88, end: 10.72 },
      ],
    },
  ],
}
