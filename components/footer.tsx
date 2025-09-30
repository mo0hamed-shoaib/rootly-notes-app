import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, HelpCircle } from "lucide-react"

export function Footer() {
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || "#"
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || "#"
  const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL || "#"

  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-center gap-5 text-sm text-muted-foreground">
          <Link href="/how-rootly-works" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4" />
            <span>How Rootly Works</span>
          </Link>
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-foreground"
            aria-label="Jimmy portfolio"
          >
            <Image src="/jimmy-logo.svg" alt="Jimmy" width={16} height={16} />
            Jimmy
          </a>
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
        </div>
      </div>
    </footer>
  )
}


