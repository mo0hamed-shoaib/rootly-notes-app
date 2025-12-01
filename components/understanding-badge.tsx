import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { UnderstandingLevel } from "@/lib/types"

interface UnderstandingBadgeProps {
  level: UnderstandingLevel
  className?: string
}

const levelConfig = {
  1: { label: "Confused", color: "bg-red-600 text-white" },
  2: { label: "Unclear", color: "bg-orange-600 text-white" },
  3: { label: "Getting It", color: "bg-yellow-600 text-white" },
  4: { label: "Clear", color: "bg-blue-600 text-white" },
  5: { label: "Crystal Clear", color: "bg-green-600 text-white" },
}

export function UnderstandingBadge({ level, className }: UnderstandingBadgeProps) {
  const config = levelConfig[level]

  return (
    <Badge className={cn(config.color, className)} variant="secondary">
      {config.label}
    </Badge>
  )
}
