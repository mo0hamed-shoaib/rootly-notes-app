"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"
import { useSearchParams } from "next/navigation"
import { TermsDialog } from "@/components/terms-dialog"
import { PrivacyDialog } from "@/components/privacy-dialog"
import Image from "next/image"
import { useState } from "react"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/overview"
  const [loadingProvider, setLoadingProvider] = useState<"github" | "google" | null>(null)
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[500px]">
          <div className="p-8 md:p-12 flex items-center">
            <div className="flex flex-col gap-8 w-full">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance text-lg">
                  Login with your GitHub or Google account
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={!!loadingProvider}
                  onClick={() => {
                    setLoadingProvider("github")
                    supabase.auth.signInWithOAuth({
                      provider: "github",
                      options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
                    })
                  }}
                >
                  {loadingProvider === "github" ? (
                    <span className="inline-flex items-center">
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Connecting to GitHub...
                    </span>
                  ) : (
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 mr-2">
                        <path d="M12 .5C5.73.5.99 5.24.99 11.51c0 4.86 3.15 8.98 7.51 10.43.55.11.75-.24.75-.53 0-.26-.01-.94-.01-1.84-3.06.66-3.71-1.31-3.71-1.31-.5-1.28-1.22-1.62-1.22-1.62-1-.69.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.71-1.48-2.44-.28-5-1.22-5-5.45 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.41.11-2.94 0 0 .92-.29 3.01 1.13.87-.24 1.8-.36 2.73-.36.93 0 1.86.12 2.73.36 2.09-1.42 3.01-1.13 3.01-1.13.6 1.53.22 2.66.11 2.94.7.77 1.13 1.75 1.13 2.95 0 4.24-2.57 5.16-5.01 5.43.4.34.76 1.01.76 2.04 0 1.47-.01 2.65-.01 3.01 0 .29.2.65.76.53 4.36-1.45 7.51-5.57 7.51-10.43C23.01 5.24 18.27.5 12 .5z" fill="currentColor" />
                      </svg>
                      Login with GitHub
                    </span>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={!!loadingProvider}
                  onClick={() => {
                    setLoadingProvider("google")
                    supabase.auth.signInWithOAuth({
                      provider: "google",
                      options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
                    })
                  }}
                >
                  {loadingProvider === "google" ? (
                    <span className="inline-flex items-center">
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Connecting to Google...
                    </span>
                  ) : (
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 mr-2">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Login with Google
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/login-banner.png"
              alt="Login banner"
              fill
              className="object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our <TermsDialog /> and <PrivacyDialog />.
      </div>
    </div>
  )
}


