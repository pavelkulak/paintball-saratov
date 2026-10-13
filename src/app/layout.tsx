import type { Metadata } from 'next'
import Script from 'next/script'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/bebas-neue/400.css'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollSmootherProvider } from '@/components/providers/ScrollSmootherProvider'
import { SiteLoader } from '@/components/ui/SiteLoader'
export const metadata: Metadata = {
  metadataBase: new URL(
    'https://paintball-saratov-demo.kulakpavel9396083.chatgpt.site',
  ),
  title: 'Paintball — landing page',
  description: 'Одностраничный сайт проекта Paintball.',
  openGraph: {
    title: 'Пейнтбол в Саратове',
    description: 'Активный отдых, где всем интересно.',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Команда игроков в пейнтбол',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Пейнтбол в Саратове',
    description: 'Активный отдых, где всем интересно.',
    images: ['/og.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body>
        <SiteLoader />
        <Header />
        <ScrollSmootherProvider>
          {children}
          <Footer />
        </ScrollSmootherProvider>
        <Script src="/showcase-scroll.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
