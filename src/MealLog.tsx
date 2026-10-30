import { useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { isSameDay } from './calendar'
import { addMeal, currentTimeString, deleteMeal, mealsOfDay, timeOnDay } from './meals'

const timeFormat = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' })

interface Props {
  // Der Tag, für den Einträge angezeigt und gespeichert werden
  day: Date
}

function MealLog({ day }: Props) {
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const [now] = useState(() => new Date())
  const isToday = isSameDay(day, now)
  // useLiveQuery aktualisiert die Liste automatisch, sobald sich die Datenbank ändert.
  const meals = useLiveQuery(() => mealsOfDay(day), [day])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!description.trim()) return
    setSaving(true)
    try {
      // Die Uhrzeit wird automatisch beim Speichern genommen (aktuelle Uhrzeit am gewählten Tag).
      await addMeal(description, timeOnDay(day, currentTimeString()))
      setDescription('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <h2>Mahlzeit eintragen</h2>

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

        <button type="submit" disabled={saving || !description.trim()}>
          Speichern
        </button>
      </form>

      <section>
        <h2>{isToday ? 'Mahlzeiten heute' : 'Mahlzeiten an diesem Tag'}</h2>
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
    </>
  )
}

export default MealLog
