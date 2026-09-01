import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LoadingBar } from '@/components/ui/LoadingBar';

export const metadata: Metadata = {
  title: 'HireLogic — Intelligent Resume Screening & Candidate Ranking',
  description:
    'A modern recruitment technology platform using NLP techniques and transformer semantic embeddings to evaluate and rank candidate resumes transparently.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-zinc-50/50 text-zinc-900 antialiased selection:bg-zinc-200">
        <LoadingBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
