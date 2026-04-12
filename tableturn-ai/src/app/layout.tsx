import type { Metadata } from "next"
import "./globals.css"
import { ToastProvider } from "@/components/ui/toast"

export const metadata: Metadata = {
  title: "TableTurn AI — Restaurant Growth Platform",
  description: "The all-in-one marketing and revenue platform for restaurants, bars, and hospitality groups.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-zinc-50 font-sans text-zinc-900">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
