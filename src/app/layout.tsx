import { Inter, Archivo, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/providers/ThemeProvider'
import { routing } from '@/i18n/routing'

const inter = Inter({
  subsets: ['latin', 'vietnamese', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  title: 'AI Prompt Research Lab',
  description: 'Build, test, and deploy AI assistants with structured prompts',
  icons: {
    icon: '/favicon.svg',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang={routing.defaultLocale}
      className={`${inter.variable} ${archivo.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}