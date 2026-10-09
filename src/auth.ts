import { db, type User } from './db'

// Benutzernamen vergleichen wir ohne Leerzeichen am Rand und ohne Groß-/Kleinschreibung.
export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase()
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return bytes
}

// Berechnet einen Hash des Passworts mit PBKDF2 (eingebaut im Browser, Web Crypto API).
// Das Salz sorgt dafür, dass gleiche Passwörter unterschiedliche Hashes ergeben.
async function hashPassword(password: string, salt: Uint8Array<ArrayBuffer>): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 210_000 }, key, 256)
  return toHex(new Uint8Array(bits))
}

export class AuthError extends Error {}

export const MIN_PASSWORD_LENGTH = 6

export async function register(username: string, password: string): Promise<User> {
  const name = normalizeUsername(username)
  if (!name) throw new AuthError('Bitte gib einen Benutzernamen ein.')
  if (password.length < MIN_PASSWORD_LENGTH)
    throw new AuthError(`Das Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein.`)
  if (await db.users.get({ username: name })) throw new AuthError('Diesen Benutzernamen gibt es schon.')

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const user = { username: name, passwordHash: await hashPassword(password, salt), salt: toHex(salt), createdAt: Date.now() }
  const id = await db.users.add(user)
  return { ...user, id }
}

export async function login(username: string, password: string): Promise<User> {
  const user = await db.users.get({ username: normalizeUsername(username) })
  // Bewusst dieselbe Meldung, egal ob Name oder Passwort falsch ist.
  const wrong = new AuthError('Benutzername oder Passwort ist falsch.')
  if (!user) throw wrong
  if ((await hashPassword(password, fromHex(user.salt))) !== user.passwordHash) throw wrong
  return user
}
