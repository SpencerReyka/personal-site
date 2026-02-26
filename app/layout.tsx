import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Spencer Reyka',
  description: 'Spencer Reyka — AI Team Lead & Software Engineer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg text-fg font-sans leading-[1.65] py-16 px-6 max-w-site mx-auto">
        {children}
      </body>
    </html>
  )
}
