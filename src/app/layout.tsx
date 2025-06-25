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
      <body className="min-h-screen font-sans bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-300">
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
          <nav className="container mx-auto flex items-center justify-between py-4 px-6">
            <Link href="/" className="text-2xl font-extrabold text-black tracking-tight hover:opacity-80 transition">Social Predict</Link>
            <div className="space-x-6">
              <Link href="/articles" className="text-neutral-700 hover:text-black hover:underline transition-colors font-semibold">Articles</Link>
              <Link href="/pricing" className="text-neutral-700 hover:text-black hover:underline transition-colors font-semibold">Pricing</Link>
              <Link href="/account" className="text-neutral-700 hover:text-black hover:underline transition-colors font-semibold">Account</Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-12 relative min-h-[80vh] flex flex-col items-center justify-center">
          {children}
        </main>
        {/* Global loading spinner overlay (hidden by default, can be shown by adding a class in the future) */}
        <div id="global-loading" className="hidden fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-black rounded-full animate-spin"></div>
        </div>
      </body>
    </html>
  );
}
