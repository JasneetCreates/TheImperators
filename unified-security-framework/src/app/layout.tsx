import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Unified Security Framework',
  description: 'Living Security Perimeter - Presence, Biometrics, and Zero Trust Analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Using direct Google Fonts link in head for simplicity with Vanilla CSS, 
  // or just relying on system fonts falling back from Inter if not loaded via next/font (which is cleaner but I'll stick to a simple strategy for now)
  // Actually, standard Next.js uses next/font/google. I'll use that for performance.

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
