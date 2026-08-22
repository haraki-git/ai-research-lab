'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import dynamic from 'next/dynamic'

const DynamicThemeProvider = dynamic(
  () => import('next-themes').then((mod) => mod.ThemeProvider),
  { ssr: false },
)

export default function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <DynamicThemeProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      {children}
    </DynamicThemeProvider>
  )
}
