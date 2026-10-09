import { useEffect, useState } from 'react'
import { db, type User } from './db'
import LoginPage from './LoginPage'
import MealLog from './MealLog'
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
    <MealLog
      username={user.username}
      onLogout={() => {
        writeSession(null)
        setUser(null)
      }}
    />
  )
}

export default App
