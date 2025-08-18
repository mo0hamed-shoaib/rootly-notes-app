// src/components/layout/Header.tsx
import { BookOpen, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { appLinks } from "./Sidebar";

export function Header() {
  const { theme, toggle } = useTheme();
  const location = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open navigation">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <nav className="p-3 space-y-1">
                    {appLinks.map((l) => {
                      const active = location.pathname === l.href;
                      const Icon = l.icon;
                      return (
                        <Link key={l.href} to={l.href} className="no-underline">
                          <Button variant={active ? "default" : "ghost"} className="w-full justify-start">
                            <Icon className="w-4 h-4 mr-2" />
                            {l.label}
                          </Button>
                        </Link>
                      );
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none text-foreground">Rootly</span>
              <span className="text-xs text-muted-foreground font-medium">Track your learning journey</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}


