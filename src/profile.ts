import { db, type Profile } from './db'

export interface ProfileInput {
  displayName: string
  birthDate: string
  contraception: string
  illnesses: string
  allergies: string
  migraineStart: string
  notes: string
}

export const EMPTY_PROFILE: ProfileInput = {
  displayName: '',
  birthDate: '',
  contraception: '',
  illnesses: '',
  allergies: '',
  migraineStart: '',
  notes: '',
}

export async function loadProfile(userId: number): Promise<ProfileInput> {
  const found: Profile | undefined = await db.profiles.get(userId)
  if (!found) return EMPTY_PROFILE
  return {
    displayName: found.displayName,
    birthDate: found.birthDate,
    // Ältere Profile kennen diese Felder noch nicht – dann leer anzeigen.
    contraception: found.contraception ?? '',
    illnesses: found.illnesses ?? '',
    allergies: found.allergies ?? '',
    migraineStart: found.migraineStart ?? '',
    notes: found.notes,
  }
}

export async function saveProfile(userId: number, input: ProfileInput): Promise<void> {
  // put() legt das Profil an oder überschreibt das vorhandene.
  await db.profiles.put({
    userId,
    displayName: input.displayName.trim(),
    birthDate: input.birthDate,
    contraception: input.contraception.trim(),
    illnesses: input.illnesses.trim(),
    allergies: input.allergies.trim(),
    migraineStart: input.migraineStart.trim(),
    notes: input.notes.trim(),
    updatedAt: Date.now(),
  })
}
