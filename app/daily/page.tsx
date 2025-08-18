import { createClient } from "@/lib/supabase/server"
import { DailyEntriesGrid } from "@/components/daily-entries-grid"
import { AddDailyEntryDialog } from "@/components/add-daily-entry-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DailyPage() {
  const supabase = await createClient()

  // Get daily entries
  const { data: dailyEntries, error } = await supabase
    .from("daily_entries")
    .select("*")
    .order("date", { ascending: false })
    .limit(30)

  if (error) {
    console.error("Error fetching daily entries:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Entries</h1>
            <p className="text-muted-foreground">Track your daily study progress and mood</p>
          </div>
          <div />
        </div>

        {/* Add Entry Button */}
        <div className="flex justify-end mb-6">
          <AddDailyEntryDialog />
        </div>

        {/* Daily Entries Grid */}
        {dailyEntries && dailyEntries.length > 0 ? (
          <DailyEntriesGrid entries={dailyEntries} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Daily Entries Found</CardTitle>
              <CardDescription>Start tracking your daily study progress and mood.</CardDescription>
            </CardHeader>
            <CardContent>
              <AddDailyEntryDialog />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
