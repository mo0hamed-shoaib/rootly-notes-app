import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, GraduationCap, Calendar, RefreshCw, Sparkles, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "How Rootly Works",
  description: "A quick visual guide to using Rootly Notes in four simple steps.",
}

export default function HowItWorksPage() {
  const steps = [
    {
      id: 1,
      title: "Capture notes fast",
      description:
        "Jot ideas, summaries, and flash‑points without friction. Tag notes, filter them, and keep everything searchable.",
      icon: BookOpen,
    },
    {
      id: 2,
      title: "Organize by courses",
      description:
        "Group related notes into courses. Track progress and keep your learning structured and focused.",
      icon: GraduationCap,
    },
    {
      id: 3,
      title: "Log your day",
      description:
        "Record daily study time and mood. Spot trends, keep momentum, and maintain a healthy learning rhythm.",
      icon: Calendar,
    },
    {
      id: 4,
      title: "Review to remember",
      description:
        "Use spaced review to reinforce what matters. Turn knowledge into long‑term memory with smart repetition.",
      icon: RefreshCw,
    },
  ]

  return (
    <main className="border-b">
      <section className="container mx-auto max-w-6xl px-4 py-14 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>Quick visual guide</span>
          </div>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            How Rootly Works — in 4 clear steps
          </h1>
          <p className="mt-3 text-muted-foreground">
            Learn the flow, stay in control, and make steady progress. Everything is designed to be simple,
            symmetrical, and delightful to use.
          </p>
        </div>

        <div className="mt-8">
          <div className="mx-auto flex max-w-2xl items-center justify-center gap-4 text-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted/40">
                <BookOpen className="h-4 w-4" aria-hidden />
              </div>
              <span className="text-muted-foreground">Notes</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted/40">
                <GraduationCap className="h-4 w-4" aria-hidden />
              </div>
              <span className="text-muted-foreground">Courses</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted/40">
                <Calendar className="h-4 w-4" aria-hidden />
              </div>
              <span className="text-muted-foreground">Daily</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted/40">
                <RefreshCw className="h-4 w-4" aria-hidden />
              </div>
              <span className="text-muted-foreground">Review</span>
            </div>
          </div>
          <div className="mt-6"><Separator /></div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-2">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <Card key={step.id} className="relative">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="rounded-full px-2.5 py-0.5">
                        Step {step.id}
                      </Badge>
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ul className="list-inside list-disc text-sm text-muted-foreground">
                    {step.id === 1 && (
                      <>
                        <li>Use filters to surface exactly what you need.</li>
                        <li>Keep notes short; link out when needed.</li>
                        <li>Tag consistently to stay organized.</li>
                      </>
                    )}
                    {step.id === 2 && (
                      <>
                        <li>Break big topics into focused courses.</li>
                        <li>Track progress to maintain momentum.</li>
                        <li>Keep related notes close.</li>
                      </>
                    )}
                    {step.id === 3 && (
                      <>
                        <li>Log study time and mood in seconds.</li>
                        <li>Spot your best study windows.</li>
                        <li>Aim for sustainable streaks—consistency wins.</li>
                      </>
                    )}
                    {step.id === 4 && (
                      <>
                        <li>Focus on high‑value notes during review.</li>
                        <li>Revisit at increasing intervals (spaced effect).</li>
                        <li>Keep sessions short and frequent.</li>
                      </>
                    )}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Principles</CardTitle>
              <CardDescription>Small shifts that make a big difference</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>Keep layouts symmetrical for effortless scanning.</li>
                <li>Write atomic notes: one idea per note for sharper recall.</li>
                <li>Prefer short, frequent sessions to maintain momentum.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning rhythm</CardTitle>
              <CardDescription>A calm cadence that compounds</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>Daily: 15–25 minutes capturing and tidying notes.</li>
                <li>Weekly: organize courses and reflect on progress.</li>
                <li>Review: 2–4 short sessions per week, spaced out.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}


