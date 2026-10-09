import { db, type Profile } from './db'

export type ProfileInput = Pick<Profile, 'displayName' | 'birthDate' | 'notes'>

export const EMPTY_PROFILE: ProfileInput = { displayName: '', birthDate: '', notes: '' }

export async function loadProfile(userId: number): Promise<ProfileInput> {
  const found = await db.profiles.get(userId)
  if (!found) return EMPTY_PROFILE
  return { displayName: found.displayName, birthDate: found.birthDate, notes: found.notes }
}

export async function saveProfile(userId: number, input: ProfileInput): Promise<void> {
  // put() legt das Profil an oder überschreibt das vorhandene.
  await db.profiles.put({
    userId,
    displayName: input.displayName.trim(),
    birthDate: input.birthDate,
    notes: input.notes.trim(),
    updatedAt: Date.now(),
  })
}
