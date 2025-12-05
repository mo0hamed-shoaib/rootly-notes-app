"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  PlusCircle,
  BarChart3,
  Calendar,
  RefreshCw,
  Menu,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthAvatar } from "@/components/auth-avatar";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const navigation = [
  { name: "Overview", href: "/overview", icon: BarChart3 },
  { name: "Notes", href: "/notes", icon: BookOpen },
  { name: "Courses", href: "/courses", icon: PlusCircle },
  { name: "Daily Tracking", href: "/daily-tracking", icon: Calendar },
  { name: "Review", href: "/review", icon: RefreshCw },
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* Mobile: Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            className="sm:hidden h-9 px-4"
            variant="outline"
            aria-label="Open navigation"
          >
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
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.name}
                    asChild
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "justify-start gap-2",
                      isActive && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                );
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
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex items-center gap-2 px-3 py-2",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <Link href={item.href}>
                <Icon className="h-4 w-4" />
                <span className="hidden [@media(min-width:870px)]:inline">
                  {item.name}
                </span>
              </Link>
            </Button>
          );
        })}
        <div className="ml-1">
          <ThemeToggle />
        </div>
        <div className="ml-1">
          <AuthAvatar />
        </div>
      </nav>
    </div>
  );
}
