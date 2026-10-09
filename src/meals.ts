import { db, type Meal } from './db'

// Liefert Beginn (inklusive) und Ende (exklusive) des Tages, in dem `date` liegt – in lokaler Zeit.
export function dayRange(date: Date): [number, number] {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  return [start.getTime(), end.getTime()]
}

// Aktuelle Uhrzeit im Format "HH:MM" für ein <input type="time">.
export function currentTimeString(now: Date = new Date()): string {
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

// Kombiniert ein Datum mit einer Uhrzeit "HH:MM" zu einem Zeitstempel.
export function timeOnDay(day: Date, time: string): number {
  const [hh, mm] = time.split(':').map(Number)
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hh, mm).getTime()
}

export async function addMeal(description: string, eatenAt: number): Promise<number> {
  return db.meals.add({ description: description.trim(), eatenAt, createdAt: Date.now() })
}

export async function mealsOfDay(date: Date): Promise<Meal[]> {
  const [start, end] = dayRange(date)
  return db.meals.where('eatenAt').between(start, end, true, false).sortBy('eatenAt')
}

export async function deleteMeal(id: number): Promise<void> {
  await db.meals.delete(id)
}
