import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies as nextCookies } from "next/headers"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") || "/overview"

  let response = NextResponse.redirect(new URL(next, url.origin))

  if (code) {
    const cookieStore = await nextCookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookies) {
            cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
          },
        },
      },
    )

    // Exchange the PKCE code for a session and set auth cookies on the response
    await supabase.auth.exchangeCodeForSession(code)

    // Fallback: ensure a profile row exists for the authenticated user
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (user) {
      const meta: any = user.user_metadata || {}
      const fullName = meta.full_name || meta.name || meta.user_name || null
      const avatarUrl = meta.avatar_url || meta.picture || null
      // Upsert allowed by RLS policy: insert/update only when id = auth.uid()
      await supabase.from("profiles").upsert(
        { id: user.id, full_name: fullName, avatar_url: avatarUrl },
        { onConflict: "id" }
      )
    }
  }

  return response
}


