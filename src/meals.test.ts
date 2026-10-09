import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db'
import { addMeal, currentTimeString, dayRange, mealsOfDay, timeOnDay } from './meals'

describe('Zeit-Hilfsfunktionen', () => {
  it('formatiert die Uhrzeit als HH:MM', () => {
    expect(currentTimeString(new Date(2026, 9, 8, 7, 5))).toBe('07:05')
  })

  it('kombiniert Tag und Uhrzeit', () => {
    expect(timeOnDay(new Date(2026, 9, 8, 23, 59), '12:30')).toBe(new Date(2026, 9, 8, 12, 30).getTime())
  })

  it('berechnet den Tagesbereich', () => {
    const [start, end] = dayRange(new Date(2026, 9, 8, 15, 0))
    expect(start).toBe(new Date(2026, 9, 8).getTime())
    expect(end).toBe(new Date(2026, 9, 9).getTime())
  })
})

describe('Mahlzeiten in der Datenbank', () => {
  beforeEach(async () => {
    await db.meals.clear()
  })

  it('liefert nur Mahlzeiten des gewünschten Tages, nach Uhrzeit sortiert', async () => {
    const day = new Date(2026, 9, 8)
    await addMeal('Abendessen', timeOnDay(day, '19:00'))
    await addMeal('  Frühstück  ', timeOnDay(day, '07:30'))
    await addMeal('Gestern', timeOnDay(new Date(2026, 9, 7), '12:00'))
    await addMeal('Morgen', timeOnDay(new Date(2026, 9, 9), '00:00'))

    const meals = await mealsOfDay(day)
    expect(meals.map((m) => m.description)).toEqual(['Frühstück', 'Abendessen'])
  })
})
