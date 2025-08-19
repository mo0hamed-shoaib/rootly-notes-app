"use client"
import { Moon, Sun, Monitor } from "lucide-react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [accent, setAccent] = useState<string | null>(null)

  const ACCENT_THEMES = ["rose", "red", "orange", "yellow", "green", "blue", "violet"] as const

  function applyAccent(name: string | null) {
    const root = document.documentElement
    ACCENT_THEMES.forEach((t) => root.classList.remove(t))
    if (name) {
      root.classList.add(name)
      localStorage.setItem("accent-theme", name)
    } else {
      localStorage.removeItem("accent-theme")
    }
    setAccent(name)
  }

  useEffect(() => {
    const saved = localStorage.getItem("accent-theme")
    if (saved) applyAccent(saved)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          Light
          {theme === "light" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
          <Moon className="h-4 w-4" />
          Dark
          {theme === "dark" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2">
          <Monitor className="h-4 w-4" />
          System
          {theme === "system" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <div className="my-1 h-px bg-border" />
        <DropdownMenuItem onClick={() => applyAccent(null)} className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full border border-border" />
          Default accent
          {!accent && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyAccent("rose")} className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: "oklch(0.645 0.246 16.439)" }} />
          Rose
          {accent === "rose" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyAccent("red")} className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: "oklch(0.65 0.25 25)" }} />
          Red
          {accent === "red" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyAccent("orange")} className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: "oklch(0.67 0.23 50)" }} />
          Orange
          {accent === "orange" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyAccent("yellow")} className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: "oklch(0.9 0.12 100)" }} />
          Yellow
          {accent === "yellow" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyAccent("green")} className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: "oklch(0.7 0.15 150)" }} />
          Green
          {accent === "green" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyAccent("blue")} className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: "oklch(0.72 0.16 240)" }} />
          Blue
          {accent === "blue" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyAccent("violet")} className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: "oklch(0.65 0.2 300)" }} />
          Violet
          {accent === "violet" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
