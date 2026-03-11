import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '30 Days on Love Island',
  description: 'A social strategy game where you have 30 days to find love',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
