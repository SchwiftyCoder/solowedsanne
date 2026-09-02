export const WEDDING_DETAILS = {
  coupleNames: 'Solomon Takyi & Anne Agyare',
  dateText: 'Friday, September 4, 2026',
  timeText: '2:00 PM',
  venueName: 'La Maison',
  venueAddress: '33 Washington Ave, Belleville, NJ 07109',
  dressCode: 'Kente',
  // View-only Drive folder - uploads go through photosUploadUrl instead, so
  // guests never get edit access to the folder itself.
  photosUrl: 'https://drive.google.com/drive/folders/1cFeEVVjZsBcvg-IQMUT3jO8b0z3atXdD?usp=sharing',
  photosUploadUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSe0JEBWqnBNRAnHgUZaJJE_yrwFdQpr6VuTljINK6RD8zwicg/viewform?usp=publish-editor',
} as const;

// The actual ceremony date, used by the homepage countdown.
export const WEDDING_DATE = new Date('2026-09-04T14:00:00');

// Two columns, matching the printed ceremony/reception timeline sign:
// the left column runs straight through the ceremony, the right column
// is headed by the reception's own time range before its own events.
export const WEDDING_PROGRAM = {
  ceremony: [
    { time: '2:00 PM - 2:45 PM', event: 'Family Greeting & Opening', icon: 'family' },
    { time: '3:00 PM - 3:15 PM', event: "Groom's Entrance & Presentation of Dowry", icon: 'gift' },
    { time: '3:45 PM', event: "Bridesmaids' Entrance", icon: 'bridesmaids' },
    { time: '4:00 PM', event: "Bride's Grand Entrance", icon: 'bride' },
    { time: '4:15 PM - 4:30 PM', event: 'Acceptance of Dowry', icon: 'handshake' },
    { time: '4:45 PM - 5:30 PM', event: 'Officiating of Marriage', icon: 'rings' },
    { time: '6:00 PM - 6:35 PM', event: 'MC Announcements & Family Photos', icon: 'camera' },
  ],
  reception: {
    heading: { time: '6:45 PM - 10:45 PM', title: 'Reception & Open Bar' },
    items: [
      { time: '6:45 PM', event: 'Reception Begins & Open Bar', icon: 'toast' },
      { time: '6:45 PM - 7:45 PM', event: 'Dinner Service', icon: 'dinner' },
      { time: '7:45 PM', event: 'Bride & Groom Outfit Change', icon: 'outfit' },
      { time: '8:00 PM', event: 'Second Bridal Entrance', icon: 'curtain' },
      { time: '8:15 PM', event: 'Grand Reception Entrance', icon: 'couple' },
      { time: '8:40 PM', event: 'Family Dance', icon: 'family' },
      { time: '9:00 PM - 10:45 PM', event: 'Celebration & Party', icon: 'music' },
      { time: '10:45 PM', event: 'Reception Concludes', icon: 'heart' },
    ],
  },
} as const;

function parseStartTime(timeStr: string, base: Date): Date | null {
  const first = timeStr.split(' - ')[0].trim();
  const match = first.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours !== 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  const d = new Date(base);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

// Which program row (if any) is happening right now, keyed "ceremony-<i>" or
// "reception-<i>" to match ProgramCard's rendering. Only ever returns a key
// on the actual wedding day - any other day, nothing is "happening now".
export function getActiveProgramKey(now: Date = new Date()): string | null {
  const isWeddingDay =
    now.getFullYear() === WEDDING_DATE.getFullYear() &&
    now.getMonth() === WEDDING_DATE.getMonth() &&
    now.getDate() === WEDDING_DATE.getDate();
  if (!isWeddingDay) return null;

  const timeline = [
    ...WEDDING_PROGRAM.ceremony.map((item, i) => ({ key: `ceremony-${i}`, item })),
    ...WEDDING_PROGRAM.reception.items.map((item, i) => ({ key: `reception-${i}`, item })),
  ];

  let active: string | null = null;
  for (const { key, item } of timeline) {
    const start = parseStartTime(item.time, now);
    if (start && start.getTime() <= now.getTime()) {
      active = key;
    } else {
      break;
    }
  }
  return active;
}
