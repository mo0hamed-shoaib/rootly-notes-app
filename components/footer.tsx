import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin } from "lucide-react"

export function Footer() {
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || "#"
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || "#"
  const currentYear = new Date().getFullYear()

  const appLinks = [
    { name: "Overview", href: "/overview" },
    { name: "Notes", href: "/notes" },
    { name: "Courses", href: "/courses" },
    { name: "Daily Entry", href: "/daily" },
    { name: "Review", href: "/review" },
  ]

  const resourceLinks = [
    { name: "How Rootly Works", href: "/how-rootly-works" },
    { name: "About", href: "/about" },
  ]

  return (
    <footer className="bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Main Footer: Brand + Navigation */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="flex flex-col gap-3 justify-between min-h-full">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/favicon-light.svg"
                  alt="Rootly logo"
                  width={32}
                  height={32}
                  className="hidden dark:block"
                />
                <Image
                  src="/favicon-dark.svg"
                  alt="Rootly logo"
                  width={32}
                  height={32}
                  className="block dark:hidden"
                />
                <span className="font-semibold tracking-tight text-lg">Rootly Notes</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Your learning journey tracker. Capture questions, track progress, and stay consistent.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              © {currentYear} Rootly Notes. All rights reserved.
            </p>
          </div>
          <nav className="flex flex-col sm:flex-row gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground mb-1">App</h3>
              {appLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground mb-1">Resources</h3>
              {resourceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground mb-1">Social</h3>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  )
}


