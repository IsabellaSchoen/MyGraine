import { useEffect, useState } from 'react'
import { db, type User } from './db'
import CalendarPage from './CalendarPage'
import Dock, { type View } from './Dock'
import LoginPage from './LoginPage'
import MealLog from './MealLog'
import ProfilePage from './ProfilePage'
import './App.css'

// Unter diesem Schlüssel merkt sich der Browser, wer angemeldet ist (nur die ID, kein Passwort).
const SESSION_KEY = 'mygraine-user-id'

function readSession(): number | null {
  try {
    const value = localStorage.getItem(SESSION_KEY)
    return value ? Number(value) : null
  } catch {
    return null
  }
}

function writeSession(id: number | null) {
  try {
    if (id === null) localStorage.removeItem(SESSION_KEY)
    else localStorage.setItem(SESSION_KEY, String(id))
  } catch {
    // Speichern nicht möglich (z. B. privater Modus) – dann eben nur bis zum Neuladen angemeldet.
  }
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(() => readSession() !== null)
  // Welche Seite gerade sichtbar ist, und für welchen Tag eingetragen wird
  const [view, setView] = useState<View>('home')
  const [selectedDay, setSelectedDay] = useState(() => new Date())

  // Beim Start: War schon jemand angemeldet? Dann das Konto aus der Datenbank laden.
  useEffect(() => {
    const id = readSession()
    if (id === null) return
    db.users
      .get(id)
      .then((found) => setUser(found ?? null))
      .finally(() => setChecking(false))
  }, [])

  if (checking) return null

  if (!user) {
    return (
      <LoginPage
        onLoggedIn={(u) => {
          writeSession(u.id)
          setUser(u)
        }}
      />
    )
  }

  return (
    <div className="app-shell">
      {view === 'home' && (
        <CalendarPage
          onSelectDay={(day) => {
            setSelectedDay(day)
            setView('add')
          }}
        />
      )}
      {view === 'add' && <MealLog day={selectedDay} />}
      {view === 'profile' && (
        <ProfilePage
          userId={user.id}
          username={user.username}
          onLogout={() => {
            writeSession(null)
            setUser(null)
            setView('home')
          }}
        />
      )}

      <Dock
        current={view}
        onNavigate={(next) => {
          // Das ➕ im Dock trägt immer für heute ein; ein anderer Tag wird über den Kalender gewählt.
          if (next === 'add') setSelectedDay(new Date())
          setView(next)
        }}
      />
    </div>
  )
}

export default App
