"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookOpen, PlusCircle, BarChart3, Calendar, RefreshCw } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Notes", href: "/notes", icon: BookOpen },
  { name: "Courses", href: "/courses", icon: PlusCircle },
  { name: "Daily", href: "/daily", icon: Calendar },
  { name: "Review", href: "/review", icon: RefreshCw },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-1 bg-muted/50 p-1 rounded-lg">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Button
            key={item.name}
            asChild
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className={cn("flex items-center gap-2 px-3 py-2", isActive && "bg-primary text-primary-foreground")}
          >
            <Link href={item.href}>
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.name}</span>
            </Link>
          </Button>
        )
      })}
      <div className="ml-1">
        <ThemeToggle />
      </div>
    </nav>
  )
}
