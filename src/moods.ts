import { dayKey } from './calendar'
import { db } from './db'

export type MoodLevel = 1 | 2 | 3 | 4 | 5

// Die fünf Stimmungen, von sehr gut bis gar nicht gut.
// `color` füllt den Kreis im Kalender, `text` ist die gut lesbare Schriftfarbe darauf.
export const MOODS: { level: MoodLevel; emoji: string; label: string; color: string; text: string }[] = [
  { level: 5, emoji: '😄', label: 'Sehr gut', color: '#2e9e5b', text: '#ffffff' },
  { level: 4, emoji: '🙂', label: 'Gut', color: '#9ccc65', text: '#1f2328' },
  { level: 3, emoji: '😐', label: 'Mittel', color: '#f4d03f', text: '#1f2328' },
  { level: 2, emoji: '🙁', label: 'Nicht gut', color: '#f39c3d', text: '#1f2328' },
  { level: 1, emoji: '😣', label: 'Gar nicht gut', color: '#e04f3c', text: '#ffffff' },
]

export function moodInfo(level: number) {
  return MOODS.find((m) => m.level === level)
}

// Speichert die Stimmung eines Tages. Eine schon vorhandene Stimmung wird ersetzt.
export async function setMood(day: Date, level: MoodLevel): Promise<void> {
  await db.moods.put({ day: dayKey(day), level, updatedAt: Date.now() })
}

export async function clearMood(day: Date): Promise<void> {
  await db.moods.delete(dayKey(day))
}

export async function moodOfDay(day: Date): Promise<MoodLevel | undefined> {
  const mood = await db.moods.get(dayKey(day))
  return mood?.level as MoodLevel | undefined
}

// Alle Stimmungen eines Monats als Nachschlagetabelle "JJJJ-MM-TT" → Stufe.
export async function moodsOfMonth(year: number, month: number): Promise<Map<string, MoodLevel>> {
  const first = dayKey(new Date(year, month, 1))
  const last = dayKey(new Date(year, month + 1, 0))
  const moods = await db.moods.where('day').between(first, last, true, true).toArray()
  return new Map(moods.map((m) => [m.day, m.level as MoodLevel]))
}
