import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./context/auth-context"
import { DocumentProvider } from "./context/document-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gemini Text Enhancer",
  description: "AI-powered text editor with Gemini integration",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DocumentProvider>{children}</DocumentProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
