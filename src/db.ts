import Dexie, { type EntityTable } from 'dexie'

// Eine Mahlzeit, wie sie in der lokalen Datenbank (IndexedDB) gespeichert wird.
export interface Meal {
  id: number
  description: string
  // Zeitpunkt der Mahlzeit als Millisekunden seit 1970 (lässt sich gut sortieren und filtern)
  eatenAt: number
  createdAt: number
}

// Ein Benutzerkonto. Das Passwort selbst wird nie gespeichert, nur ein Hash davon.
export interface User {
  id: number
  username: string
  // Hash und Salz als Hex-Text (siehe auth.ts)
  passwordHash: string
  salt: string
  createdAt: number
}

// Persönliche Angaben, eine Zeile pro Benutzerkonto (userId ist gleichzeitig der Schlüssel).
export interface Profile {
  userId: number
  displayName: string
  // Geburtsdatum als "JJJJ-MM-TT" (so liefert es <input type="date">), leer = keine Angabe
  birthDate: string
  // Freitextfelder; bei Profilen von vor dieser Erweiterung fehlen sie (dann gilt: leer)
  contraception?: string
  illnesses?: string
  allergies?: string
  migraineStart?: string
  notes: string
  updatedAt: number
}

// Die allgemeine Stimmung eines Tages, höchstens ein Eintrag pro Tag.
export interface Mood {
  // Der Tag als "JJJJ-MM-TT" (siehe dayKey in calendar.ts), gleichzeitig der Schlüssel
  day: string
  // 1 = gar nicht gut … 5 = sehr gut
  level: number
  updatedAt: number
}

export const db = new Dexie('MyGraine') as Dexie & {
  meals: EntityTable<Meal, 'id'>
  moods: EntityTable<Mood, 'day'>
  users: EntityTable<User, 'id'>
  profiles: EntityTable<Profile, 'userId'>
}

// Version 1 des Schemas: "++id" = automatisch hochzählende ID, "eatenAt" = Index für Zeitabfragen
db.version(1).stores({
  meals: '++id, eatenAt',
})

// Version 2: Benutzerkonten. "&username" = eindeutiger Index, jeder Name nur einmal.
db.version(2).stores({
  meals: '++id, eatenAt',
  users: '++id, &username',
})

// Version 3: persönliche Angaben. "userId" ist der Schlüssel, damit jedes Konto genau ein Profil hat.
db.version(3).stores({
  meals: '++id, eatenAt',
  users: '++id, &username',
  profiles: 'userId',
})

// Version 4: Stimmung pro Tag. "day" ist der Schlüssel, damit jeder Tag genau eine Stimmung hat.
db.version(4).stores({
  meals: '++id, eatenAt',
  users: '++id, &username',
  profiles: 'userId',
  moods: 'day',
})
