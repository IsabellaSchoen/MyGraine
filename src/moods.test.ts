import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db'
import { clearMood, MOODS, moodOfDay, moodsOfMonth, setMood } from './moods'

describe('Stimmungen', () => {
  beforeEach(async () => {
    await db.moods.clear()
  })

  it('gibt es in fünf Stufen mit unterschiedlichen Farben', () => {
    expect(MOODS.map((m) => m.level).sort()).toEqual([1, 2, 3, 4, 5])
    expect(new Set(MOODS.map((m) => m.color)).size).toBe(5)
  })

  it('speichert pro Tag nur eine Stimmung und ersetzt die alte', async () => {
    const day = new Date(2026, 9, 10, 8)
    await setMood(day, 2)
    await setMood(new Date(2026, 9, 10, 22), 5)
    expect(await moodOfDay(day)).toBe(5)
    expect(await db.moods.count()).toBe(1)
  })

  it('kann eine Stimmung wieder entfernen', async () => {
    const day = new Date(2026, 9, 10)
    await setMood(day, 3)
    await clearMood(day)
    expect(await moodOfDay(day)).toBeUndefined()
  })

  it('liefert nur die Stimmungen des gewünschten Monats', async () => {
    await setMood(new Date(2026, 8, 30), 1)
    await setMood(new Date(2026, 9, 1), 4)
    await setMood(new Date(2026, 9, 31), 2)
    await setMood(new Date(2026, 10, 1), 5)

    const moods = await moodsOfMonth(2026, 9)
    expect([...moods.entries()]).toEqual([
      ['2026-10-01', 4],
      ['2026-10-31', 2],
    ])
  })
})
