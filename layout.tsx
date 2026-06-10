import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toaster'
import { QueryProvider } from '@/components/layout/QueryProvider'
import { ThemeProvider } from '@/components/layout/ThemeProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'RentView — Honest Reviews for Australian Rentals',
    template: '%s | RentView',
  },
  description:
    'Read and write honest, anonymous reviews for rental properties and property managers across Australia. Make informed decisions about where you rent.',
  keywords: [
    'rental reviews',
    'property manager reviews',
    'rental property Australia',
    'landlord reviews',
    'tenant reviews',
    'rent transparency',
  ],
  authors: [{ name: 'RentView' }],
  creator: 'RentView',
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'RentView',
    title: 'RentView — Honest Reviews for Australian Rentals',
    description:
      'Read and write honest, anonymous reviews for rental properties and property managers across Australia.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RentView - Rental Transparency Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RentView — Honest Reviews for Australian Rentals',
    description:
      'Read and write honest, anonymous reviews for rental properties and property managers across Australia.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification here
    // google: 'your-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0e86e8" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
