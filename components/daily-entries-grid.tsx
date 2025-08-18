"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoodIndicator } from "@/components/mood-indicator"
import { EditDailyEntryDialog } from "@/components/edit-daily-entry-dialog"
import { DeleteDailyEntryDialog } from "@/components/delete-daily-entry-dialog"
import { Edit, Trash2, Clock, Calendar } from "lucide-react"
import type { DailyEntry } from "@/lib/types"

interface DailyEntriesGridProps {
  entries: DailyEntry[]
}

export function DailyEntriesGrid({ entries }: DailyEntriesGridProps) {
  const [editingEntry, setEditingEntry] = useState<DailyEntry | null>(null)
  const [deletingEntry, setDeletingEntry] = useState<DailyEntry | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-lg font-semibold mb-2">
                    <Calendar className="h-5 w-5" />
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{Math.round((entry.study_time / 60) * 10) / 10}h</span>
                    </div>
                    <MoodIndicator mood={entry.mood} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setEditingEntry(entry)} className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingEntry(entry)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {entry.notes && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Notes:</h4>
                  <p className="text-sm leading-relaxed">{entry.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingEntry && (
        <EditDailyEntryDialog
          entry={editingEntry}
          open={!!editingEntry}
          onOpenChange={(open) => !open && setEditingEntry(null)}
        />
      )}

      {/* Delete Dialog */}
      {deletingEntry && (
        <DeleteDailyEntryDialog
          entry={deletingEntry}
          open={!!deletingEntry}
          onOpenChange={(open) => !open && setDeletingEntry(null)}
        />
      )}
    </>
  )
}
