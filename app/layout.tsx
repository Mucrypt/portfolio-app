import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['monospace'],
})

export const metadata: Metadata = {
  title: 'Romeo Mukulah | Full-Stack Developer & Tech Entrepreneur',
  description:
    'Professional portfolio showcasing full-stack development, cloud solutions, and enterprise applications. Specializing in Next.js, React, Node.js, and modern web technologies.',
  keywords: [
    'Romeo Mukulah',
    'Full-Stack Developer',
    'Web Developer',
    'Next.js',
    'React',
    'Portfolio',
  ],
  authors: [{ name: 'Romeo Mukulah' }],
  creator: 'Romeo Mukulah',
  publisher: 'Romeo Mukulah',
  metadataBase: new URL('https://romeomukulah.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Romeo Mukulah | Full-Stack Developer',
    description:
      'Professional portfolio showcasing full-stack development and cloud solutions',
    url: 'https://romeomukulah.org',
    siteName: 'Romeo Mukulah Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Romeo Mukulah | Full-Stack Developer',
    description:
      'Professional portfolio showcasing full-stack development and cloud solutions',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
