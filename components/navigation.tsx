"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookOpen, PlusCircle, BarChart3, Calendar, RefreshCw, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthAvatar } from "@/components/auth-avatar"
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Notes", href: "/notes", icon: BookOpen },
  { name: "Courses", href: "/courses", icon: PlusCircle },
  { name: "Daily Entry", href: "/daily", icon: Calendar },
  { name: "Review", href: "/review", icon: RefreshCw },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-2">
      {/* Mobile: Drawer */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="sm:hidden" variant="outline" size="sm" aria-label="Open navigation">
            <Menu className="h-4 w-4" />
            <span className="ml-2 text-sm">Menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Navigation Menu</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pt-0">
            <div className="grid gap-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.name}
                    asChild
                    variant={isActive ? "default" : "ghost"}
                    className={cn("justify-start gap-2", isActive && "bg-primary text-primary-foreground")}
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Mobile: show theme + avatar triggers (they handle their own drawers) */}
      <div className="flex items-center gap-1 sm:hidden">
        <ThemeToggle />
        <AuthAvatar />
      </div>

      {/* Desktop/Tablet: Inline nav */}
      <nav className="hidden sm:flex items-center space-x-1 bg-muted/50 p-1 rounded-lg">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={cn(
                "group flex items-center px-3 py-2",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <Link href={item.href}>
                <Icon className="h-4 w-4" />
                <span
                  className={cn(
                    "ml-0 max-w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-500 ease-out",
                    "group-hover:ml-2 group-hover:max-w-[140px] group-hover:opacity-100",
                    "[@media(min-width:745px)]:ml-2 [@media(min-width:745px)]:max-w-none [@media(min-width:745px)]:opacity-100"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            </Button>
          )
        })}
        <div className="ml-1">
          <ThemeToggle />
        </div>
        <div className="ml-1">
          <AuthAvatar />
        </div>
      </nav>
    </div>
  )
}
