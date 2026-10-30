import { useLiveQuery } from 'dexie-react-hooks'
import MealLog from './MealLog'
import MoodIcon from './MoodIcon'
import { clearMood, MOODS, moodOfDay, setMood } from './moods'

const dateFormat = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })

interface Props {
  // Der Tag, für den eingetragen wird (im Kalender ausgewählt)
  day: Date
  // Zurück zum Kalender
  onDone: () => void
}

function EntryPage({ day, onDone }: Props) {
  const current = useLiveQuery(() => moodOfDay(day), [day])

  return (
    <main className="page">
      <button type="button" className="link back-link" onClick={onDone}>
        ‹ Zum Kalender
      </button>
      <header className="entry-header">
        <h1>{dateFormat.format(day)}</h1>
      </header>

      <section className="card mood-card">
        <h2 id="mood-title">Wie fühlst du dich heute?</h2>
        <div className="mood-picker" role="group" aria-labelledby="mood-title">
          {MOODS.map((m) => {
            const active = current === m.level
            return (
              <button
                key={m.level}
                type="button"
                className={active ? 'mood-option active' : 'mood-option'}
                aria-pressed={active}
                aria-label={m.label}
                // Nochmal auf die gewählte Stimmung tippen nimmt sie wieder weg.
                onClick={() => void (active ? clearMood(day) : setMood(day, m.level))}
              >
                <span className="mood-emoji" style={{ background: m.color }}>
                  <MoodIcon level={m.level} />
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <MealLog day={day} />
    </main>
  )
}

export default EntryPage
