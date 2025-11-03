import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YouTube Shorts Вирусное Видео',
  description: 'Создай вирусное видео для YouTube Shorts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
