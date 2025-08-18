// src/pages/DashboardPage.tsx
import { LayoutDashboard } from "lucide-react";
import { MiniDashboard } from "@/components/dashboard/MiniDashboard";
import type { Note, DailyEntry } from "@/types";

interface DashboardPageProps {
  notes: Note[];
  dailyEntries: DailyEntry[];
}

export function DashboardPage({ notes, dailyEntries }: DashboardPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Page Header - Centered and Symmetrical */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Overview
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Your study activity, topic mix, and focus notes
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto">
          <MiniDashboard notes={notes} dailyEntries={dailyEntries} />
        </div>
      </div>
    </div>
  );
}


