import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Driver Earnings',
  description: 'Track Uber & Lyft earnings, overhead, and pacing toward your weekly and monthly goals.',
  manifest: '/dailymetrics7321/manifest.webmanifest',
  icons: {
    icon: '/dailymetrics7321/icon-192.png',
    apple: '/dailymetrics7321/apple-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Driver Earnings',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0f172a',
  colorScheme: 'dark',
};

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return children;
}
