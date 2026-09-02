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

export const WEDDING_PROGRAM = [
  { time: '2:00 - 2:45 PM', event: 'Family Greeting & Opening' },
  { time: '3:00 - 3:15 PM', event: "Groom's Entrance & Presentation of Dowry" },
  { time: '3:45 PM', event: "Bridesmaids' Entrance" },
  { time: '4:00 PM', event: "Bride's Grand Entrance" },
  { time: '4:15 - 4:30 PM', event: 'Acceptance of Dowry' },
  { time: '4:45 - 5:30 PM', event: 'Officiating of Marriage' },
  { time: '6:00 - 6:35 PM', event: 'MC Announcements & Family Photos' },
  { time: '6:45 PM', event: 'Reception Begins & Open Bar' },
  { time: '6:45 - 7:45 PM', event: 'Dinner Service' },
  { time: '7:45 PM', event: 'Bride & Groom Outfit Change' },
  { time: '8:00 PM', event: 'Second Bridal Entrance' },
  { time: '8:15 PM', event: 'Grand Reception Entrance' },
  { time: '8:40 PM', event: 'Family Dance' },
  { time: '9:00 - 11:00 PM', event: 'Celebration & Party' },
  { time: '11:00 PM', event: 'Reception Concludes' },
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

export function defaultReminderText() {
  return (
    'Wedding Reminder: Solomon & Anne, Fri Sep 4, 2PM at La Maison, 33 Washington Ave, Belleville NJ. ' +
    'Dress code: White. Reply YES or NO to RSVP! solowedsanne.com'
  );
}

export function defaultThankYouText() {
  return (
    `Thank you so much for celebrating with ${WEDDING_DETAILS.coupleNames} on our wedding day - ` +
    `it meant the world to have you there. Add your own photos here: ${WEDDING_DETAILS.photosUploadUrl}`
  );
}
