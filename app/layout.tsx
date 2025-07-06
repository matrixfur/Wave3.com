import type { Metadata } from 'next'
import './globals.css'
<<<<<<< HEAD

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
=======
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Wave3',
  description: 'Landing page for Wave3',
>>>>>>> 9c33c70 (dark mode changes)
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
<<<<<<< HEAD
    <html lang="en">
      <body>{children}</body>
=======
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
>>>>>>> 9c33c70 (dark mode changes)
    </html>
  )
}
