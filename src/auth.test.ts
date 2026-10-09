import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db'
import { login, register } from './auth'

describe('Anmelden und Registrieren', () => {
  beforeEach(async () => {
    await db.users.clear()
  })

  it('speichert das Passwort nicht im Klartext', async () => {
    const user = await register('Anna', 'geheim123')
    expect(user.username).toBe('anna')
    expect(user.passwordHash).not.toContain('geheim123')
  })

  it('meldet mit richtigem Passwort an, Groß-/Kleinschreibung beim Namen egal', async () => {
    await register('Anna', 'geheim123')
    const user = await login('  ANNA ', 'geheim123')
    expect(user.username).toBe('anna')
  })

  it('lehnt falsches Passwort und unbekannte Namen ab', async () => {
    await register('anna', 'geheim123')
    await expect(login('anna', 'falsch!!')).rejects.toThrow('Benutzername oder Passwort ist falsch.')
    await expect(login('bert', 'geheim123')).rejects.toThrow('Benutzername oder Passwort ist falsch.')
  })

  it('verhindert doppelte Benutzernamen und zu kurze Passwörter', async () => {
    await register('anna', 'geheim123')
    await expect(register('Anna', 'anderes1')).rejects.toThrow('gibt es schon')
    await expect(register('bert', '123')).rejects.toThrow('mindestens 6 Zeichen')
  })
})
