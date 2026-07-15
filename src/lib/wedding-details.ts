export const WEDDING_DETAILS = {
  coupleNames: 'Solomon Takyi & Anne Agyare',
  dateText: 'Friday, September 4, 2026',
  timeText: '5:30 PM – 11:30 PM',
  venueName: 'La Maison',
  venueAddress: '33 Washington Ave, Belleville, NJ 07109',
  dressCode: 'Kente',
  photosUrl: 'https://drive.google.com/drive/folders/1cFeEVVjZsBcvg-IQMUT3jO8b0z3atXdD?usp=sharing',
} as const;

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
