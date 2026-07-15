export function AmpersandEmblem() {
  return (
    <div className="relative mx-auto my-1" style={{ width: 64, height: 64 }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
      />
      <div
        className="absolute rounded-full flex items-center justify-center font-serif"
        style={{ inset: 6, background: '#B8860B', color: '#fff', fontSize: 26 }}
      >
        &amp;
      </div>
    </div>
  );
}

export function Divider({ star = false }: { star?: boolean }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="h-px flex-1" style={{ background: '#B8860B', opacity: 0.25 }} />
      {star
        ? <span style={{ color: '#B8860B', fontSize: 14 }}>✦</span>
        : <div className="w-1 h-1 rounded-full" style={{ background: '#B8860B', opacity: 0.4 }} />}
      <div className="h-px flex-1" style={{ background: '#B8860B', opacity: 0.25 }} />
    </div>
  );
}

export function BotanicalLeaf({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="64" height="72" viewBox="0 0 64 72" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <line x1="32" y1="68" x2="32" y2="12" stroke="#B8860B" strokeWidth="1.1" strokeOpacity="0.55"/>
      <path d="M32 12 C16 20 10 44 32 66 C54 44 48 20 32 12 Z"
        fill="#B8860B" fillOpacity="0.07" stroke="#B8860B" strokeWidth="1" strokeOpacity="0.5"/>
      <path d="M32 28 Q22 32 19 42" stroke="#B8860B" strokeWidth="0.75" strokeOpacity="0.45"/>
      <path d="M32 28 Q42 32 45 42" stroke="#B8860B" strokeWidth="0.75" strokeOpacity="0.45"/>
      <path d="M32 44 Q24 47 22 55" stroke="#B8860B" strokeWidth="0.75" strokeOpacity="0.3"/>
      <path d="M32 44 Q40 47 42 55" stroke="#B8860B" strokeWidth="0.75" strokeOpacity="0.3"/>
      <path d="M32 22 C24 16 14 22 18 32 C24 24 32 22 32 22 Z"
        fill="#B8860B" fillOpacity="0.07" stroke="#B8860B" strokeWidth="0.85" strokeOpacity="0.45"/>
      <path d="M32 22 C40 16 50 22 46 32 C40 24 32 22 32 22 Z"
        fill="#B8860B" fillOpacity="0.07" stroke="#B8860B" strokeWidth="0.85" strokeOpacity="0.45"/>
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="#2C2C2C" strokeWidth="1.5"/>
      <path d="M3 9.5H21" stroke="#2C2C2C" strokeWidth="1.5"/>
      <path d="M8 3V6.5M16 3V6.5" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 14L11 16L15 12" stroke="#1B5E20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="#2C2C2C" strokeWidth="1.5"/>
      <path d="M12 7V12L15.5 14" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 21C12 21 19 14.5 19 9.5C19 5.6 15.9 2.5 12 2.5C8.1 2.5 5 5.6 5 9.5C5 14.5 12 21 12 21Z"
        stroke="#2C2C2C" strokeWidth="1.5" strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.5" stroke="#2C2C2C" strokeWidth="1.5"/>
    </svg>
  );
}
