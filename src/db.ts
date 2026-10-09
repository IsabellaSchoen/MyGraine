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

export const db = new Dexie('MyGraine') as Dexie & {
  meals: EntityTable<Meal, 'id'>
  users: EntityTable<User, 'id'>
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
