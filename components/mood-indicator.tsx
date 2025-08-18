import { cn } from "@/lib/utils"
import type { MoodLevel } from "@/lib/types"

interface MoodIndicatorProps {
  mood: MoodLevel
  className?: string
}

const moodEmojis = {
  1: "😞",
  2: "😕",
  3: "😐",
  4: "😊",
  5: "😄",
}

const moodLabels = {
  1: "Terrible",
  2: "Poor",
  3: "Okay",
  4: "Good",
  5: "Excellent",
}

export function MoodIndicator({ mood, className }: MoodIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-lg">{moodEmojis[mood]}</span>
      <span className="text-sm text-muted-foreground">{moodLabels[mood]}</span>
    </div>
  )
}
