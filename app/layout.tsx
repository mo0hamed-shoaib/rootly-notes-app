import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import Image from "next/image"

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const title = "Rootly Notes"
  const description = "Your learning journey tracker"

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s · Rootly Notes",
    },
    description,
    generator: "v0.app",
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: "Rootly Notes",
      images: [
        {
          url: "/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: "Rootly logo",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/android-chrome-512x512.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
        { url: "/favicon-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
    alternates: {
      canonical: "/",
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                {/* Light-on-dark logo for dark mode */}
                <Image
                  src="/favicon-light.svg"
                  alt="Rootly logo"
                  width={32}
                  height={32}
                  className="hidden dark:block"
                  priority
                />
                {/* Dark-on-light logo for light mode */}
                <Image
                  src="/favicon-dark.svg"
                  alt="Rootly logo"
                  width={32}
                  height={32}
                  className="block dark:hidden"
                  priority
                />
                <span className="font-semibold tracking-tight text-lg md:text-xl">Rootly</span>
              </Link>
              <Navigation />
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
