// Linke Gehirnhälfte von oben gesehen; die rechte Hälfte ist ein Spiegelbild davon.
function Hemisphere() {
  return (
    <>
      <path d="M50 16 C40 10 27 12 23 21 C13 22 8 32 12 40 C5 47 6 59 13 63 C11 73 19 82 30 80 C34 88 45 90 50 84" />
      <path d="M23 21 C30 25 32 32 27 38" />
      <path d="M12 40 C20 40 26 44 25 51" />
      <path d="M13 63 C21 60 28 64 29 71" />
      <path d="M38 27 C43 33 40 42 44 47" />
      <path d="M35 55 C40 59 39 66 44 71" />
    </>
  )
}

export function BrainIcon() {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <Hemisphere />
      <g transform="matrix(-1 0 0 1 100 0)">
        <Hemisphere />
      </g>
      <path d="M50 16 V84" />
    </svg>
  )
}
