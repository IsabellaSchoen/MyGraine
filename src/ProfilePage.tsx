import { useEffect, useState, type FormEvent } from 'react'
import { EMPTY_PROFILE, loadProfile, saveProfile, type ProfileInput } from './profile'

interface Props {
  userId: number
  username: string
  onLogout: () => void
}

function ProfilePage({ userId, username, onLogout }: Props) {
  const [profile, setProfile] = useState<ProfileInput>(EMPTY_PROFILE)
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    void loadProfile(userId).then((p) => {
      setProfile(p)
      setLoaded(true)
    })
  }, [userId])

  function change(field: keyof ProfileInput, value: string) {
    setProfile((p) => ({ ...p, [field]: value }))
    setSaved(false)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      await saveProfile(userId, profile)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="page">
      <header>
        <h1>Persönliche Angaben</h1>
        <p className="date">Angemeldet als {username}</p>
      </header>

      <form className="card meal-form" onSubmit={handleSubmit}>
        <label htmlFor="display-name">Name</label>
        <input
          id="display-name"
          value={profile.displayName}
          onChange={(e) => change('displayName', e.target.value)}
          autoComplete="name"
          disabled={!loaded}
        />

        <label htmlFor="birth-date">Geburtsdatum</label>
        <input
          id="birth-date"
          type="date"
          value={profile.birthDate}
          onChange={(e) => change('birthDate', e.target.value)}
          disabled={!loaded}
        />

        <label htmlFor="notes">Notizen</label>
        <textarea
          id="notes"
          value={profile.notes}
          onChange={(e) => change('notes', e.target.value)}
          placeholder="z. B. Medikamente, bekannte Auslöser, Ärztin"
          rows={4}
          disabled={!loaded}
        />

        <button type="submit" disabled={!loaded || saving}>
          Speichern
        </button>
        {saved && (
          <p className="hint" role="status">
            Gespeichert.
          </p>
        )}
      </form>

      <p className="hint">Alle Angaben bleiben nur auf diesem Gerät gespeichert.</p>

      <button type="button" className="secondary logout" onClick={onLogout}>
        Abmelden
      </button>
    </main>
  )
}

export default ProfilePage
