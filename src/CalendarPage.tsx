import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { dayKey, isSameDay, monthGrid, WEEKDAYS_LONG, WEEKDAYS_SHORT } from './calendar'
import { db } from './db'
import { mealsOfDay } from './meals'
import { moodInfo, moodsOfMonth } from './moods'

const monthFormat = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' })
const dayLabelFormat = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })
const timeFormat = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' })

interface Props {
  // Der ausgewählte Tag (mit Ring markiert); seine Einträge stehen unter dem Kalender.
  selected: Date
  onSelect: (day: Date) => void
}

function CalendarPage({ selected, onSelect }: Props) {
  const [today] = useState(() => new Date())
  // Der angezeigte Monat, immer als 1. des Monats gespeichert. Startet beim Monat des ausgewählten Tages.
  const [shown, setShown] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1))

  const year = shown.getFullYear()
  const month = shown.getMonth()
  const cells = monthGrid(year, month)

  // Stimmungen dieses Monats: Diese Tage werden in der Farbe der Stimmung ausgemalt.
  const moods = useLiveQuery(() => moodsOfMonth(year, month), [year, month])

  // Welche Tage dieses Monats haben Mahlzeiten? Die bekommen einen kleinen Punkt.
  const daysWithMeals = useLiveQuery(async () => {
    const start = new Date(year, month, 1).getTime()
    const end = new Date(year, month + 1, 1).getTime()
    const meals = await db.meals.where('eatenAt').between(start, end, true, false).toArray()
    return new Set(meals.map((m) => dayKey(new Date(m.eatenAt))))
  }, [year, month])

  // Die Einträge des ausgewählten Tages unter dem Kalender. Die Stimmung steht nicht in der Liste,
  // sie ist nur an der Farbe des Tages im Kalender zu sehen.
  const selectedMeals = useLiveQuery(() => mealsOfDay(selected), [selected])

  function changeMonth(delta: number) {
    setShown(new Date(year, month + delta, 1))
  }

  return (
    <main className="page">
      <div className="card calendar">
        <header className="calendar-header">
          <h1>{monthFormat.format(shown)}</h1>
          <div className="month-nav-group">
            <button type="button" className="month-nav" aria-label="Vorheriger Monat" onClick={() => changeMonth(-1)}>
              ‹
            </button>
            <button type="button" className="month-nav" aria-label="Nächster Monat" onClick={() => changeMonth(1)}>
              ›
            </button>
          </div>
        </header>

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
          {cells.map((day, i) => {
            if (day === null) return <div key={`leer-${i}`} />
            const key = dayKey(day)
            const dayMood = moods?.get(key)
            const info = dayMood !== undefined ? moodInfo(dayMood) : undefined
            const classes = ['day']
            if (isSameDay(day, today)) classes.push('today')
            if (isSameDay(day, selected)) classes.push('selected')
            if (info) classes.push('has-mood')

            return (
              <button
                key={key}
                type="button"
                className={classes.join(' ')}
                aria-label={
                  dayLabelFormat.format(day) +
                  (info ? `, Stimmung: ${info.label}` : '') +
                  (daysWithMeals?.has(key) ? ', hat Einträge' : '')
                }
                aria-current={isSameDay(day, today) ? 'date' : undefined}
                aria-pressed={isSameDay(day, selected)}
                onClick={() => onSelect(day)}
              >
                <span className="day-circle" style={info ? { background: info.color, color: info.text } : undefined}>
                  {day.getDate()}
                </span>
                {daysWithMeals?.has(key) && <span className="day-dot" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      </div>

      {(year !== today.getFullYear() || month !== today.getMonth()) && (
        <button
          type="button"
          className="secondary back-to-today"
          onClick={() => {
            setShown(new Date(today.getFullYear(), today.getMonth(), 1))
            onSelect(today)
          }}
        >
          Zum heutigen Monat
        </button>
      )}

      <section className="day-entries">
        <h2 className="day-entries-title">{dayLabelFormat.format(selected)}</h2>

        {selectedMeals?.map((meal) => (
          <div key={meal.id} className="entry-card">
            <span className="entry-badge neutral" aria-hidden="true">
              🍽️
            </span>
            <div className="entry-text">
              <strong>Mahlzeit</strong>
              <span className="entry-sub">{meal.description}</span>
            </div>
            <span className="entry-time">{timeFormat.format(meal.eatenAt)}</span>
          </div>
        ))}

        {selectedMeals?.length === 0 && (
          <p className="hint">Noch keine Einträge. Tippe unten auf ＋, um etwas einzutragen.</p>
        )}
      </section>
    </main>
  )
}

export default CalendarPage
