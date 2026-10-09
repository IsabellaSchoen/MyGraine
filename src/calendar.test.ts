import { describe, expect, it } from 'vitest'
import { dayKey, isSameDay, monthGrid } from './calendar'

describe('Monatsraster', () => {
  it('beginnt am richtigen Wochentag (Oktober 2026 startet an einem Donnerstag)', () => {
    const cells = monthGrid(2026, 9)
    // Mo, Di, Mi bleiben leer, dann kommt der 1.
    expect(cells.slice(0, 3)).toEqual([null, null, null])
    expect(cells[3]?.getDate()).toBe(1)
    expect(cells.filter(Boolean)).toHaveLength(31)
  })

  it('hat keine leeren Felder, wenn der Monat an einem Montag beginnt (Juni 2026)', () => {
    expect(monthGrid(2026, 5)[0]?.getDate()).toBe(1)
  })

  it('setzt einen Sonntag als 1. in die letzte Spalte (Februar 2026)', () => {
    const cells = monthGrid(2026, 1)
    expect(cells.indexOf(null)).toBe(0)
    expect(cells[6]?.getDate()).toBe(1)
    expect(cells.filter(Boolean)).toHaveLength(28)
  })

  it('kennt Schaltjahre', () => {
    expect(monthGrid(2028, 1).filter(Boolean)).toHaveLength(29)
  })
})

describe('Tages-Hilfsfunktionen', () => {
  it('vergleicht nur den Tag, nicht die Uhrzeit', () => {
    expect(isSameDay(new Date(2026, 9, 9, 8), new Date(2026, 9, 9, 23))).toBe(true)
    expect(isSameDay(new Date(2026, 9, 9), new Date(2026, 9, 10))).toBe(false)
  })

  it('erzeugt einen Schlüssel mit führenden Nullen', () => {
    expect(dayKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})
