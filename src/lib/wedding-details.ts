export const WEDDING_DETAILS = {
  coupleNames: 'Solomon Takyi & Anne Agyare',
  dateText: 'Friday, September 4, 2026',
  timeText: '2:00 PM',
  venueName: 'La Maison',
  venueAddress: '33 Washington Ave, Belleville, NJ 07109',
  dressCode: 'Kente',
  photosUrl: 'https://drive.google.com/drive/folders/15bBYA-TGtC2SHhTbLprLiqRAniDxty4s?usp=sharing',
} as const;

export function siteUrl() {
  return (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
}

export function welcomeUrl(id: string) {
  return `${siteUrl()}/welcome/${id}`;
}
