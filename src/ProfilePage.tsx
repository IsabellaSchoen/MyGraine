import { useEffect, useState, type FormEvent } from 'react'
import { EMPTY_PROFILE, loadProfile, saveProfile, type ProfileInput } from './profile'

interface Props {
  userId: number
  username: string
  onLogout: () => void
}

// Die Textfelder unter Name und Geburtsdatum, in der Reihenfolge, in der sie angezeigt werden
const TEXT_FIELDS: { field: keyof ProfileInput; label: string; placeholder: string }[] = [
  { field: 'contraception', label: 'Verhütung', placeholder: 'z. B. Pille, Spirale, keine' },
  { field: 'illnesses', label: 'Krankheiten', placeholder: 'z. B. Bluthochdruck, Schilddrüse' },
  { field: 'allergies', label: 'Allergien', placeholder: 'z. B. Pollen, Penicillin' },
  { field: 'migraineStart', label: 'Migräne Beginn', placeholder: 'z. B. seit 2015, mit 16 Jahren' },
  { field: 'notes', label: 'Weitere Notizen', placeholder: 'z. B. Medikamente, Ärztin' },
]

function ProfilePage({ userId, username, onLogout }: Props) {
  const [profile, setProfile] = useState<ProfileInput>(EMPTY_PROFILE)
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void loadProfile(userId).then((p) => {
      setProfile(p)
      setLoaded(true)
    })
  }, [userId])

  function change(field: keyof ProfileInput, value: string) {
    setProfile((p) => ({ ...p, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      await saveProfile(userId, profile)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="page">
      <header>
        <h1>MyGraine Information</h1>
      </header>

      <form className="card meal-form profile-form" onSubmit={handleSubmit}>
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

        {TEXT_FIELDS.map(({ field, label, placeholder }) => (
          <div key={field} className="profile-field">
            <label htmlFor={`profile-${field}`}>{label}</label>
            <textarea
              id={`profile-${field}`}
              value={profile[field]}
              onChange={(e) => change(field, e.target.value)}
              placeholder={placeholder}
              rows={field === 'notes' ? 4 : 2}
              disabled={!loaded}
            />
          </div>
        ))}

        <button type="submit" disabled={!loaded || saving}>
          Speichern
        </button>
      </form>

      <p className="hint">Alle Angaben bleiben nur auf diesem Gerät gespeichert.</p>

      <p className="hint">Angemeldet als {username}</p>
      <button type="button" className="secondary logout" onClick={onLogout}>
        Abmelden
      </button>
    </main>
  )
}

export default ProfilePage
