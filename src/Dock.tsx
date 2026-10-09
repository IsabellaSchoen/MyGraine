// Die Navigationsleiste: auf dem Handy unten, auf dem Computer links (siehe App.css).

export type View = 'home' | 'add' | 'profile'

const ITEMS: { view: View; emoji: string; label: string }[] = [
  { view: 'home', emoji: '🏠', label: 'Kalender' },
  { view: 'add', emoji: '➕', label: 'Eintrag' },
  { view: 'profile', emoji: '👤', label: 'Profil' },
]

interface Props {
  current: View
  onNavigate: (view: View) => void
}

function Dock({ current, onNavigate }: Props) {
  return (
    <nav className="dock" aria-label="Hauptnavigation">
      {ITEMS.map((item) => (
        <button
          key={item.view}
          type="button"
          className={item.view === current ? 'dock-item active' : 'dock-item'}
          aria-current={item.view === current ? 'page' : undefined}
          onClick={() => onNavigate(item.view)}
        >
          <span className="dock-emoji" aria-hidden="true">
            {item.emoji}
          </span>
          <span className="dock-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default Dock
