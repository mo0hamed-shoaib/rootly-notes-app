"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { supabase } from "@/lib/supabase/client"

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/dashboard"

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      if (data.session) router.replace(next)
    })
    return () => {
      mounted = false
    }
  }, [router, next])

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,theme(colors.primary/35),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.16)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(0deg,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)]" />
      </div>
      <div className="flex w-full max-w-sm md:max-w-4xl flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-svh" />}> 
      <LoginPageInner />
    </Suspense>
  )
}


