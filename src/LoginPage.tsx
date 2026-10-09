import { useState, type FormEvent } from 'react'
import { AuthError, login, MIN_PASSWORD_LENGTH, register } from './auth'
import { BrainIcon } from './BrainIcon'
import type { User } from './db'

interface Props {
  onLoggedIn: (user: User) => void
}

function LoginPage({ onLoggedIn }: Props) {
  // "login" = Anmelden, "register" = neues Konto anlegen
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const isRegister = mode === 'register'

  function switchMode() {
    setMode(isRegister ? 'login' : 'register')
    setError('')
    setPassword('')
    setPasswordRepeat('')
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (isRegister && password !== passwordRepeat) {
      setError('Die Passwörter stimmen nicht überein.')
      return
    }
    setBusy(true)
    try {
      const user = isRegister ? await register(username, password) : await login(username, password)
      onLoggedIn(user)
    } catch (e) {
      setError(e instanceof AuthError ? e.message : 'Etwas ist schiefgelaufen. Bitte versuche es noch einmal.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page login-page">
      <h1 className="login-title">How are you MyGraining today?</h1>

      <div className="brain-circle">
        <BrainIcon />
      </div>

      <form className="card login-form" onSubmit={handleSubmit}>
        <h2>{isRegister ? 'Registrieren' : 'Anmelden'}</h2>

        <label htmlFor="username">Benutzername</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
        />

        <label htmlFor="password">Passwort</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          minLength={isRegister ? MIN_PASSWORD_LENGTH : undefined}
          required
        />

        {isRegister && (
          <>
            <label htmlFor="password-repeat">Passwort wiederholen</label>
            <input
              id="password-repeat"
              type="password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              autoComplete="new-password"
              required
            />
          </>
        )}

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy}>
          {isRegister ? 'Konto anlegen' : 'Anmelden'}
        </button>
      </form>

      <p className="switch-mode">
        {isRegister ? 'Du hast schon ein Konto?' : 'Noch keine Zugangsdaten?'}{' '}
        <button type="button" className="link" onClick={switchMode}>
          {isRegister ? 'Anmelden' : 'Jetzt registrieren'}
        </button>
      </p>
    </main>
  )
}

export default LoginPage
