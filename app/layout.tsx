import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Doma Deal Pages',
  description: 'Zero-friction deal pages for tokenized domains',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}