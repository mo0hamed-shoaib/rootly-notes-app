import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
				{/* Hero with subtle spotlight */}
				<div className="relative">
					<div
						aria-hidden
						className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-[radial-gradient(ellipse_at_center,theme(colors.primary/10),transparent_60%)] blur-2xl"
					/>
					<div className="flex flex-col items-center text-center gap-4 mb-10 md:mb-12">
						<div className="flex items-center justify-center">
							<Image
								src="/favicon-light.svg"
								alt="Rootly logo"
								width={112}
								height={112}
								className="hidden dark:block md:h-28 md:w-28 h-24 w-24"
								priority
							/>
							<Image
								src="/favicon-dark.svg"
								alt="Rootly logo"
								width={112}
								height={112}
								className="block dark:hidden md:h-28 md:w-28 h-24 w-24"
								priority
							/>
						</div>
						<h1 className="text-3xl md:text-4xl font-bold tracking-tight">About Rootly Notes</h1>
						<p className="max-w-2xl text-muted-foreground">
							A minimalist learning companion to capture questions, review them with intention, and visualize your
							progress over time.
						</p>
					</div>
				</div>

				<Separator className="my-12 md:my-16" />

				{/* Three-up summary */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-base">What it is</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground">
							Rootly Notes is a personal knowledge notebook focused on clarity. Add notes as question–answer
							pairs, track understanding from 1–5, and see trends that guide your next study session.
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-base">Why it was created</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground">
							Learning sticks when questions drive it. This project removes friction so you can quickly capture
							what you don’t know, review deliberately, and make steady, measurable progress.
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-base">Inspiration</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground">
							Inspired by spaced repetition, the Zettelkasten mindset of atomic notes, and a desire for calm,
							beautiful interfaces that keep focus on the work—not the tool.
						</CardContent>
					</Card>
				</div>

				{/* Secondary details */}
				<div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Key features</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground space-y-2">
							<ul className="list-disc pl-5 space-y-1">
								<li>Fast note capture with structured fields</li>
								<li>Understanding levels to quantify progress</li>
								<li>Daily tracking for time and mood</li>
								<li>Clean charts to visualize learning</li>
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-base">Design principles</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground space-y-2">
							<ul className="list-disc pl-5 space-y-1">
								<li>Symmetry and balance for a calm UI</li>
								<li>Minimalism without sacrificing clarity</li>
								<li>Accessibility and keyboard-friendly flows</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}


