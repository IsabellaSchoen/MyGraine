import { useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { addMeal, currentTimeString, deleteMeal, mealsOfDay, timeOnDay } from './meals'
import './App.css'

const timeFormat = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' })
const dateFormat = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })

interface Props {
  username: string
  onLogout: () => void
}

function MealLog({ username, onLogout }: Props) {
  const [description, setDescription] = useState('')
  const [time, setTime] = useState(currentTimeString)
  const [saving, setSaving] = useState(false)

  const [today] = useState(() => new Date())
  // useLiveQuery aktualisiert die Liste automatisch, sobald sich die Datenbank ändert.
  const meals = useLiveQuery(() => mealsOfDay(today), [today])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!description.trim()) return
    setSaving(true)
    try {
      await addMeal(description, timeOnDay(today, time))
      setDescription('')
      setTime(currentTimeString())
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="page">
      <header>
        <div className="user-bar">
          <span>Angemeldet als <strong>{username}</strong></span>
          <button type="button" className="link" onClick={onLogout}>
            Abmelden
          </button>
        </div>
        <h1>Mahlzeit eintragen</h1>
        <p className="date">{dateFormat.format(today)}</p>
      </header>

      <form className="card meal-form" onSubmit={handleSubmit}>
        <label htmlFor="description">Was hast du gegessen?</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="z. B. Müsli mit Banane, Kaffee"
          rows={3}
          required
        />

        <label htmlFor="time">Uhrzeit</label>
        <div className="time-row">
          <input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <button type="button" className="secondary" onClick={() => setTime(currentTimeString())}>
            Jetzt
          </button>
        </div>

        <button type="submit" disabled={saving || !description.trim()}>
          Speichern
        </button>
      </form>

      <section>
        <h2>Heute</h2>
        {meals === undefined ? (
          <p className="hint">Lade …</p>
        ) : meals.length === 0 ? (
          <p className="hint">Noch keine Mahlzeiten eingetragen.</p>
        ) : (
          <ul className="meal-list">
            {meals.map((meal) => (
              <li key={meal.id} className="card meal">
                <span className="meal-time">{timeFormat.format(meal.eatenAt)}</span>
                <span className="meal-description">{meal.description}</span>
                <button
                  type="button"
                  className="delete"
                  aria-label={`Eintrag „${meal.description}“ löschen`}
                  onClick={() => {
                    if (confirm('Diesen Eintrag löschen?')) void deleteMeal(meal.id)
                  }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default MealLog
