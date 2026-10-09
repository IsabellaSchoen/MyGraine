import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { dayKey, isSameDay, monthGrid, WEEKDAYS_LONG, WEEKDAYS_SHORT } from './calendar'
import { db } from './db'

const monthFormat = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' })
const dayLabelFormat = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })

interface Props {
  onSelectDay: (day: Date) => void
}

function CalendarPage({ onSelectDay }: Props) {
  const [today] = useState(() => new Date())
  // Der angezeigte Monat, immer als 1. des Monats gespeichert.
  const [shown, setShown] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

  const year = shown.getFullYear()
  const month = shown.getMonth()
  const cells = monthGrid(year, month)

  // Welche Tage dieses Monats haben schon Einträge? Die bekommen einen kleinen Punkt.
  const daysWithEntries = useLiveQuery(async () => {
    const start = new Date(year, month, 1).getTime()
    const end = new Date(year, month + 1, 1).getTime()
    const meals = await db.meals.where('eatenAt').between(start, end, true, false).toArray()
    return new Set(meals.map((m) => dayKey(new Date(m.eatenAt))))
  }, [year, month])

  function changeMonth(delta: number) {
    setShown(new Date(year, month + delta, 1))
  }

  return (
    <main className="page">
      <header className="calendar-header">
        <button type="button" className="month-nav" aria-label="Vorheriger Monat" onClick={() => changeMonth(-1)}>
          ‹
        </button>
        <h1>{monthFormat.format(shown)}</h1>
        <button type="button" className="month-nav" aria-label="Nächster Monat" onClick={() => changeMonth(1)}>
          ›
        </button>
      </header>

      <div className="card calendar">
        <div className="calendar-grid weekdays">
          {WEEKDAYS_LONG.map((name, i) => (
            <div key={name} className="weekday" title={name}>
              <span className="weekday-long">{name}</span>
              <span className="weekday-short" aria-hidden="true">
                {WEEKDAYS_SHORT[i]}
              </span>
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {cells.map((day, i) =>
            day === null ? (
              <div key={`leer-${i}`} />
            ) : (
              <button
                key={day.getDate()}
                type="button"
                className={isSameDay(day, today) ? 'day today' : 'day'}
                aria-label={
                  dayLabelFormat.format(day) + (daysWithEntries?.has(dayKey(day)) ? ', hat Einträge' : '')
                }
                aria-current={isSameDay(day, today) ? 'date' : undefined}
                onClick={() => onSelectDay(day)}
              >
                {day.getDate()}
                {daysWithEntries?.has(dayKey(day)) && <span className="day-dot" aria-hidden="true" />}
              </button>
            ),
          )}
        </div>
      </div>

      {(year !== today.getFullYear() || month !== today.getMonth()) && (
        <button
          type="button"
          className="secondary back-to-today"
          onClick={() => setShown(new Date(today.getFullYear(), today.getMonth(), 1))}
        >
          Zum heutigen Monat
        </button>
      )}

      <p className="hint">Tippe auf einen Tag, um Einträge zu sehen oder hinzuzufügen.</p>
    </main>
  )
}

export default CalendarPage
