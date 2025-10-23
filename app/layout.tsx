import '../styles/globals.css'

import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { NavBar } from '@/components/navbar'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata = {
  title: 'Project Pin High',
  description: 'Build your golf brand profile',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.className)}>
        <NavBar />
        {children} 
      </body>
    </html>
  )
}