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
    await saveProfile(1, { ...EMPTY_PROFILE, displayName: '  Anna ', birthDate: '1990-04-12' })
    await saveProfile(1, {
      ...EMPTY_PROFILE,
      displayName: 'Anna B.',
      birthDate: '1990-04-12',
      allergies: ' Pollen ',
      migraineStart: 'mit 16',
      notes: ' Ibuprofen ',
    })
    await saveProfile(2, { ...EMPTY_PROFILE, displayName: 'Ben' })

    expect(await loadProfile(1)).toEqual({
      ...EMPTY_PROFILE,
      displayName: 'Anna B.',
      birthDate: '1990-04-12',
      allergies: 'Pollen',
      migraineStart: 'mit 16',
      notes: 'Ibuprofen',
    })
    expect((await loadProfile(2)).displayName).toBe('Ben')
    expect(await db.profiles.count()).toBe(2)
  })

  it('lädt ältere Profile ohne die neuen Felder mit leeren Textfeldern', async () => {
    await db.profiles.put({ userId: 3, displayName: 'Cara', birthDate: '', notes: 'alt', updatedAt: 0 })
    expect(await loadProfile(3)).toEqual({ ...EMPTY_PROFILE, displayName: 'Cara', notes: 'alt' })
  })
})
