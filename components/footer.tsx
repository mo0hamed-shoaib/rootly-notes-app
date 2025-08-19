import Link from "next/link"
import { Github, Linkedin } from "lucide-react"

export function Footer() {
  const year = new Date().getFullYear()
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || "#"
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || "#"

  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span>© {year} Rootly Notes</span>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-foreground transition-colors"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <Link href="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
        </div>
      </div>
    </footer>
  )
}


