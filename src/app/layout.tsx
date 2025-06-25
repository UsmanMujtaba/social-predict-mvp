import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Social Predict MVP',
  description: 'A simple subscription-based platform for premium articles.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 min-h-screen font-sans">
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
          <nav className="container mx-auto flex items-center justify-between py-4 px-6">
            <Link href="/" className="text-2xl font-extrabold text-black tracking-tight">Social Predict</Link>
            <div className="space-x-6">
              <Link href="/articles" className="text-neutral-700 hover:text-black transition-colors font-medium">Articles</Link>
              <Link href="/pricing" className="text-neutral-700 hover:text-black transition-colors font-medium">Pricing</Link>
              <Link href="/account" className="text-neutral-700 hover:text-black transition-colors font-medium">Account</Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
