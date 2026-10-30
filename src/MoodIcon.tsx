// Gesichter für die fünf Stimmungen im Lucide-Stil (https://lucide.dev), wie die Icons im Dock.
import type { ReactNode } from 'react'
import type { MoodLevel } from './moods'

const EYES = (
  <>
    <path d="M9 9h.01" />
    <path d="M15 9h.01" />
  </>
)

const FACES: Record<MoodLevel, ReactNode> = {
  // laugh (grinsend)
  5: (
    <>
      <path d="M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z" />
      {EYES}
    </>
  ),
  // smile (leicht lächelnd)
  4: (
    <>
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      {EYES}
    </>
  ),
  // meh (neutral)
  3: (
    <>
      <path d="M8 15h8" />
      {EYES}
    </>
  ),
  // frown (leicht traurig)
  2: (
    <>
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      {EYES}
    </>
  ),
  // angry (wütend)
  1: (
    <>
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      <path d="M7.5 8 10 9" />
      <path d="m14 9 2.5-1" />
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
    </>
  ),
}

function MoodIcon({ level, size = 32 }: { level: MoodLevel; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      {FACES[level]}
    </svg>
  )
}

export default MoodIcon
