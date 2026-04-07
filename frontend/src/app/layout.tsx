import type { Metadata } from 'next';
import './globals.css';
import dynamic from 'next/dynamic';
const Header = dynamic(() => import('@/components/Header'), { ssr: false });
import { ToastContainer } from '@/components/Toast';
import CursorGlow from '@/components/CursorGlow';

export const metadata: Metadata = {
  title: 'HDV Showroom - Showroom xe hơi chuyên nghiệp',
  description: 'Showroom xe hơi sang trọng với những chiếc xe cao cấp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-cyber-900 text-dark-50 noise-overlay overflow-x-hidden">
        <CursorGlow />
        <Header />
        <main className="min-h-screen relative z-10 pt-4">{children}</main>
        <footer className="border-t border-dark-700/50 bg-dark-800/50 backdrop-blur-sm py-8 mt-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 text-center text-dark-500">
            <p>&copy; 2026 HDV Showroom. Văn Lang University.</p>
          </div>
        </footer>
        <ToastContainer />
      </body>
    </html>
  );
}

