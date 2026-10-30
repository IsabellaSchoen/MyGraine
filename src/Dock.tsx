// Die Navigationsleiste: auf dem Handy unten, auf dem Computer links (siehe App.css).
import type { ReactNode } from 'react'

export type View = 'home' | 'lexicon' | 'add' | 'stats' | 'profile'

// Icons im Lucide-Stil (https://lucide.dev): 24×24, Linien statt Flächen, runde Enden
function Icon({ children, size = 26 }: { children: ReactNode; size?: number }) {
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
      {children}
    </svg>
  )
}

const ICONS: Record<View, ReactNode> = {
  // calendar
  home: (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
  // book-open
  lexicon: (
    <>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </>
  ),
  // plus
  add: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </>
  ),
  // chart-column
  stats: (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </>
  ),
  // user
  profile: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
}

const ITEMS: { view: View; label: string }[] = [
  { view: 'home', label: 'Kalender' },
  { view: 'lexicon', label: 'Lexikon' },
  { view: 'add', label: 'Eintrag' },
  { view: 'stats', label: 'Statistik' },
  { view: 'profile', label: 'Profil' },
]

interface Props {
  current: View
  onNavigate: (view: View) => void
}

function Dock({ current, onNavigate }: Props) {
  return (
    <nav className="dock" aria-label="Hauptnavigation">
      {ITEMS.map((item) =>
        item.view === 'add' ? (
          // Das Plus ist ein großer lila Kreis in der Mitte, ohne Beschriftung
          <div key={item.view} className="dock-add-slot">
            <button
              type="button"
              className="dock-add"
              aria-label="Neuer Eintrag"
              aria-current={item.view === current ? 'page' : undefined}
              onClick={() => onNavigate(item.view)}
            >
              <Icon size={30}>{ICONS.add}</Icon>
            </button>
          </div>
        ) : (
          <button
            key={item.view}
            type="button"
            className={item.view === current ? 'dock-item active' : 'dock-item'}
            aria-current={item.view === current ? 'page' : undefined}
            onClick={() => onNavigate(item.view)}
          >
            <Icon>{ICONS[item.view]}</Icon>
            <span className="dock-label">{item.label}</span>
          </button>
        ),
      )}
    </nav>
  )
}

export default Dock
