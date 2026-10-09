import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from './db'
import { EMPTY_PROFILE, loadProfile, saveProfile } from './profile'

describe('Persönliche Angaben', () => {
  beforeEach(async () => {
    await db.profiles.clear()
  })

  it('liefert ein leeres Profil, wenn noch nichts gespeichert ist', async () => {
    expect(await loadProfile(1)).toEqual(EMPTY_PROFILE)
  })

  it('speichert, überschreibt und trennt die Profile verschiedener Konten', async () => {
    await saveProfile(1, { displayName: '  Anna ', birthDate: '1990-04-12', notes: '' })
    await saveProfile(1, { displayName: 'Anna B.', birthDate: '1990-04-12', notes: ' Ibuprofen ' })
    await saveProfile(2, { displayName: 'Ben', birthDate: '', notes: '' })

    expect(await loadProfile(1)).toEqual({ displayName: 'Anna B.', birthDate: '1990-04-12', notes: 'Ibuprofen' })
    expect((await loadProfile(2)).displayName).toBe('Ben')
    expect(await db.profiles.count()).toBe(2)
  })
})
