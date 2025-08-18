// src/components/layout/Sidebar.tsx
import { Brain, BookOpen, GraduationCap, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

export const appLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Brain },
  { href: "/notes", label: "Notes", icon: BookOpen },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/review", label: "Review", icon: ListChecks },
];

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden lg:block border-r bg-background sticky top-14 h-[calc(100vh-56px)]">
      <nav className="w-60 p-3 space-y-1">
        {appLinks.map((l) => {
          const Icon = l.icon;
          const active = pathname === l.href;
          return (
            <Link key={l.href} to={l.href} className="no-underline">
              <Button
                variant={active ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Icon className="w-4 h-4 mr-2" />
                {l.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


