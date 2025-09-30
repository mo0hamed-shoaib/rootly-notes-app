"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, User2 } from "lucide-react"
import Link from "next/link"

interface AuthUserInfo {
  email: string | null
  name: string | null
  avatarUrl: string | null
}

export function AuthAvatar() {
  const [user, setUser] = useState<AuthUserInfo | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user
      if (!u) {
        setUser(null)
        return
      }
      const metadata = (u.user_metadata || {}) as Record<string, unknown>
      const name = (metadata["full_name"] || metadata["name"] || null) as string | null
      const picture = (metadata["avatar_url"] || metadata["picture"] || null) as string | null
      setUser({ email: u.email ?? null, name, avatarUrl: picture })
    })

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getUser().then(({ data }) => {
        const u = data.user
        if (!u) {
          setUser(null)
          return
        }
        const metadata = (u.user_metadata || {}) as Record<string, unknown>
        const name = (metadata["full_name"] || metadata["name"] || null) as string | null
        const picture = (metadata["avatar_url"] || metadata["picture"] || null) as string | null
        setUser({ email: u.email ?? null, name, avatarUrl: picture })
      })
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  if (!user) {
    return (
      <Button asChild variant="outline" size="icon">
        <Link href="/login">
          <User2 className="h-4 w-4" />
          <span className="sr-only">Sign in</span>
        </Link>
      </Button>
    )
  }

  return (
    <>
      {/* Mobile: Drawer */}
      <div className="sm:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <button className="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-9 px-2">
              <div className="flex items-center gap-2">
                <div className="rounded-md overflow-hidden">
                  <Avatar className="h-6 w-6 rounded-none">
                    <AvatarImage
                      src={user.avatarUrl ?? undefined}
                      alt={user.name ?? user.email ?? "User"}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Fallback to initials if provider image blocks referrer or is invalid
                        try { (e.currentTarget as HTMLImageElement).src = "" } catch {}
                      }}
                    />
                    <AvatarFallback className="rounded-none">U</AvatarFallback>
                  </Avatar>
                </div>
                <span className="hidden lg:inline max-w-[160px] truncate">{user.name ?? user.email}</span>
              </div>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="sr-only">Account</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pt-0 grid gap-2">
              <div className="text-sm">
                <div className="font-medium">{user.name ?? "Signed in"}</div>
                <div className="text-muted-foreground">{user.email}</div>
              </div>
              <Button
                variant="destructive"
                className="justify-start"
                onClick={async () => {
                  await supabase.auth.signOut()
                  window.location.assign("/")
                }}
              >
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop: Dropdown */}
      <div className="hidden sm:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-9 px-2">
              <div className="flex items-center gap-2">
                <div className="rounded-md overflow-hidden">
                  <Avatar className="h-6 w-6 rounded-none">
                    <AvatarImage
                      src={user.avatarUrl ?? undefined}
                      alt={user.name ?? user.email ?? "User"}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        try { (e.currentTarget as HTMLImageElement).src = "" } catch {}
                      }}
                    />
                    <AvatarFallback className="rounded-none">U</AvatarFallback>
                  </Avatar>
                </div>
                <span className="hidden lg:inline max-w-[160px] truncate">{user.name ?? user.email}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <User2 className="h-4 w-4" />
              Account
            </DropdownMenuLabel>
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              <div className="truncate font-medium">{user.name ?? "Signed in"}</div>
              <div className="truncate">{user.email}</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.assign("/")
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}


