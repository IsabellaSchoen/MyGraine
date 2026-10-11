// Das fröhliche Gehirn auf der Anmeldeseite, als Zeichnung (SVG) direkt im Code.

const OUTLINE = '#c9708a'
const PINK = '#f6b8c8'

// Die Hügel des Gehirns: [x, y, Radius]. Sie werden zuerst mit dickem Rand und dann ohne Rand
// darübergemalt – so bleibt nur der äußere Umriss sichtbar.
const LOBES: [number, number, number][] = [
  [78, 48, 24], [122, 48, 24],
  [50, 62, 24], [150, 62, 24],
  [36, 92, 24], [164, 92, 24],
  [42, 122, 23], [158, 122, 23],
  [68, 140, 22], [132, 140, 22],
  [100, 146, 20],
]

// Die Furchen auf dem Gehirn
const FOLDS = [
  'M100 26 Q96 40 100 50 Q104 60 100 72',
  'M62 40 Q72 48 66 60 Q60 70 70 76',
  'M138 40 Q128 48 134 60 Q140 70 130 76',
  'M30 78 Q44 80 46 92',
  'M170 78 Q156 80 154 92',
  'M84 30 Q90 44 82 52',
  'M116 30 Q110 44 118 52',
  'M26 112 Q38 110 44 120 Q48 130 40 138',
  'M174 112 Q162 110 156 120 Q152 130 160 138',
  'M56 150 Q66 144 76 152',
  'M144 150 Q134 144 124 152',
  'M90 158 Q100 150 110 158',
]

function Lobes() {
  return (
    <>
      <ellipse cx="100" cy="98" rx="62" ry="50" />
      {LOBES.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
      ))}
    </>
  )
}

export function BrainMascot() {
  return (
    <svg viewBox="-24 0 248 210" aria-hidden="true">
      {/* Arme und Beine liegen hinter dem Gehirn */}
      <g stroke={OUTLINE} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M30 120 Q8 122 -6 104" />
        <path d="M170 120 Q192 122 206 104" />
        <path d="M86 150 L84 192" />
        <path d="M114 150 L116 192" />
      </g>
      <g fill={PINK} stroke={OUTLINE} strokeWidth="3">
        <circle cx="-8" cy="101" r="7" />
        <circle cx="208" cy="101" r="7" />
      </g>
      <g stroke={OUTLINE} strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M-12 96 L-16 88 M-7 94 L-7 85 M-3 97 L2 90" />
        <path d="M212 96 L216 88 M207 94 L207 85 M203 97 L198 90" />
      </g>
      <g fill="#e57a93" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round">
        <path d="M68 200 Q68 188 84 188 Q96 188 96 200 Z" />
        <path d="M104 200 Q104 188 116 188 Q132 188 132 200 Z" />
      </g>

      {/* Das Gehirn selbst */}
      <g stroke={OUTLINE} strokeWidth="7">
        <Lobes />
      </g>
      <g fill={PINK}>
        <Lobes />
      </g>
      <g stroke="#e08ea4" strokeWidth="3.5" strokeLinecap="round" fill="none">
        {FOLDS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* Gesicht: Augenbrauen, Augen mit Glanzpunkt, Bäckchen, Nase, Mund mit Zunge */}
      <g stroke="#5a3443" strokeWidth="3.5" strokeLinecap="round" fill="none">
        <path d="M66 84 Q76 77 86 82" />
        <path d="M134 84 Q124 77 114 82" />
      </g>
      <circle cx="78" cy="102" r="11" fill="#2b2233" />
      <circle cx="122" cy="102" r="11" fill="#2b2233" />
      <circle cx="74.5" cy="98" r="4" fill="#fff" />
      <circle cx="118.5" cy="98" r="4" fill="#fff" />
      <ellipse cx="58" cy="120" rx="10" ry="6" fill="#ee8ea4" opacity="0.75" />
      <ellipse cx="142" cy="120" rx="10" ry="6" fill="#ee8ea4" opacity="0.75" />
      <path d="M97 110 Q100 113 103 110" stroke={OUTLINE} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path
        d="M86 120 Q100 122 114 120 Q112 138 100 138 Q88 138 86 120 Z"
        fill="#7a2c42"
        stroke="#5a3443"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M92 132 Q100 126 108 132 Q105 137 100 137 Q95 137 92 132 Z" fill="#f08aa2" />
    </svg>
  )
}
