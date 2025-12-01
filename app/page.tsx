import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Quote } from "lucide-react"
import { BackToTopButton } from "@/components/back-to-top-button"
import {
  CoursesPreview,
  NotesPreview,
  DailyPreview,
  ReviewPreview,
  ChartsPreview,
  ThemesPreview,
} from "@/components/feature-previews"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const hasSession = !!session
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10  [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,theme(colors.primary/35),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.16)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(0deg,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)]" />
      </div>
      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Master your learning journey
        </h1>
        <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
          Add notes as question-answer pairs, add daily study sessions and mood, and stay consistent with charts that helps you move forward. Rootly turns
          your study sessions into measurable growth.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          {hasSession ? (
            <Link
              href="/overview"
              className="bg-primary text-primary-foreground inline-flex items-center rounded-md px-6 py-3 text-sm font-medium hover:bg-primary/90"
            >
              Overview
            </Link>
          ) : (
            <Link
              href="/login?next=%2Foverview"
              className="bg-primary text-primary-foreground inline-flex items-center rounded-md px-6 py-3 text-sm font-medium hover:bg-primary/90"
            >
              Get started
            </Link>
          )}
          <Link
            href="/learn-rootly"
            className="bg-accent text-accent-foreground inline-flex items-center rounded-md px-6 py-3 text-sm font-medium hover:bg-accent/80"
          >
            Learn Rootly
          </Link>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          Philosophy Behind
        </h2>
        <div className="max-w-4xl mx-auto">
          <Card className="bg-muted/50 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Quote className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <blockquote className="text-lg font-medium italic leading-relaxed mb-2">
                    "The expert in anything was once a beginner. The key is not to
                    know everything, but to build a system that helps you learn
                    consistently."
                  </blockquote>
                  <cite className="text-sm text-muted-foreground">
                    Rootly Learning Philosophy
                  </cite>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Q&A Notes",
              desc: "Capture questions and answers per course",
              preview: <NotesPreview />,
            },
            {
              title: "Daily Tracking",
              desc: "Log study time and mood over time",
              preview: <DailyPreview />,
            },
            {
              title: "Quick Review",
              desc: "Practice with random notes",
              preview: <ReviewPreview />,
            },
            {
              title: "Courses Tracking",
              desc: "Organize learning paths and monitor course progress",
              preview: <CoursesPreview />,
            },
            {
              title: "Themes & Accents",
              desc: "Light/Dark modes with customizable accent colors",
              preview: <ThemesPreview />,
            },
            {
              title: "Stats & Charts",
              desc: "Understand trends with visual charts and summaries",
              preview: <ChartsPreview />,
            },
          ].map((f) => (
            <Card
              key={f.title}
              className="group relative overflow-hidden p-0 ring-1 ring-border transition-all duration-200 
              hover:ring-primary/30 
              before:absolute before:inset-0 before:rounded-[inherit] 
              before:bg-[radial-gradient(ellipse_at_center,theme(colors.primary/20),transparent_62%)] 
              before:opacity-0 before:transition-opacity before:duration-500 
              group-hover:before:opacity-100"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-muted/30 flex items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="w-full h-full overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {f.preview}
                </div>
              </div>
              <CardContent className="px-5 py-4">
                <h3 className="text-lg font-semibold leading-tight">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1.5">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="container mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">FAQ</h2>
        <Accordion
          type="single"
          collapsible
          className="border rounded-md divide-y bg-card max-w-4xl mx-auto"
        >
          <AccordionItem value="q1">
            <AccordionTrigger className="px-4">
              Is Rootly free to use?
            </AccordionTrigger>
            <AccordionContent className="px-4">
              Yes, Rootly is free for personal use. You own your data in your
              Supabase project.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger className="px-4">
              How is my data protected?
            </AccordionTrigger>
            <AccordionContent className="px-4">
              Row Level Security (RLS) ensures only you can access your data.
              Each table is scoped by your user id.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger className="px-4">
              Can I export my notes?
            </AccordionTrigger>
            <AccordionContent className="px-4">
              Yes, export options are available from the Notes section to back
              up or migrate content.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger className="px-4">
              Which sign-in methods are supported?
            </AccordionTrigger>
            <AccordionContent className="px-4">
              Google and GitHub OAuth. Accounts are separate unless you
              explicitly link identities.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <BackToTopButton />
    </div>
  );
}
