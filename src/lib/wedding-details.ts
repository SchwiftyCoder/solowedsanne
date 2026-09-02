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
    heading: { time: '6:45 PM - 11:00 PM', title: 'Reception & Open Bar' },
    items: [
      { time: '6:45 PM', event: 'Reception Begins & Open Bar', icon: 'toast' },
      { time: '6:45 PM - 7:45 PM', event: 'Dinner Service', icon: 'dinner' },
      { time: '7:45 PM', event: 'Bride & Groom Outfit Change', icon: 'outfit' },
      { time: '8:00 PM', event: 'Second Bridal Entrance', icon: 'curtain' },
      { time: '8:15 PM', event: 'Grand Reception Entrance', icon: 'couple' },
      { time: '8:40 PM', event: 'Family Dance', icon: 'family' },
      { time: '9:00 PM - 11:00 PM', event: 'Celebration & Party', icon: 'music' },
      { time: '11:00 PM', event: 'Reception Concludes', icon: 'heart' },
    ],
  },
} as const;
