// Hilfsfunktionen für die Monatsansicht. Die Woche beginnt (wie in Deutschland üblich) am Montag.

export const WEEKDAYS_LONG = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']
export const WEEKDAYS_SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

// Liefert alle Felder des Monatsrasters: zuerst leere Felder (null) bis zum richtigen Wochentag,
// dann jeden Tag des Monats. `month` zählt wie bei JavaScript ab 0 (0 = Januar).
export function monthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  // getDay(): 0 = Sonntag … 6 = Samstag. Umrechnen auf 0 = Montag … 6 = Sonntag.
  const offset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (Date | null)[] = Array.from({ length: offset }, () => null)
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day))
  }
  return cells
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

// Schlüssel wie "2026-10-09" – praktisch, um Tage in einem Set nachzuschlagen.
export function dayKey(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}
