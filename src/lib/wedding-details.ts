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

// Placeholder order of events - update times/names to match the real day-of schedule.
export const WEDDING_PROGRAM = [
  { time: '2:00 PM', event: 'Ceremony' },
  { time: '3:00 PM', event: 'Cocktail Hour & Photos' },
  { time: '4:00 PM', event: 'Grand Entrance' },
  { time: '4:15 PM', event: 'Blessing & Prayer' },
  { time: '4:30 PM', event: 'Dinner' },
  { time: '5:30 PM', event: 'Toasts & Speeches' },
  { time: '6:00 PM', event: 'Cake Cutting' },
  { time: '6:15 PM', event: 'First Dance' },
  { time: '6:30 PM', event: 'Dancing & Celebration' },
  { time: '9:00 PM', event: 'Send-Off' },
] as const;

// The actual ceremony date, used to gate the thank-you send until a month after.
export const WEDDING_DATE = new Date('2026-09-04T00:00:00');

export function thankYouAvailableAt(): Date {
  const d = new Date(WEDDING_DATE);
  d.setMonth(d.getMonth() + 1);
  return d;
}

export function isThankYouAvailable(): boolean {
  return Date.now() >= thankYouAvailableAt().getTime();
}

export function siteUrl() {
  return (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
}

export function welcomeUrl(id: string) {
  return `${siteUrl()}/welcome/${id}`;
}

export function venueMapsUrl() {
  const query = `${WEDDING_DETAILS.venueName}, ${WEDDING_DETAILS.venueAddress}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function reminderMessage(firstName: string, id: string) {
  return (
    `Hi ${firstName}! Reminder for ${WEDDING_DETAILS.coupleNames}'s wedding: ` +
    `${WEDDING_DETAILS.dateText} at ${WEDDING_DETAILS.timeText}, ${WEDDING_DETAILS.venueName}. ` +
    `Directions: ${venueMapsUrl()} ` +
    `Dress code: ${WEDDING_DETAILS.dressCode}. Find your table: ${welcomeUrl(id)}`
  );
}
