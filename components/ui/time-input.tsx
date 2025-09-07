"use client"

import { forwardRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface TimeInputProps {
  value: number // total minutes
  onChange: (minutes: number) => void
  className?: string
  disabled?: boolean
  placeholder?: string
}

export const TimeInput = forwardRef<HTMLDivElement, TimeInputProps>(
  ({ value, onChange, className, disabled, placeholder }, ref) => {
    const [hours, setHours] = useState(Math.floor(value / 60))
    const [minutes, setMinutes] = useState(value % 60)

    // Update local state when value prop changes
    useEffect(() => {
      setHours(Math.floor(value / 60))
      setMinutes(value % 60)
    }, [value])

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHours = Math.max(0, Math.min(23, parseInt(e.target.value) || 0))
      setHours(newHours)
      onChange(newHours * 60 + minutes)
    }

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMinutes = Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
      setMinutes(newMinutes)
      onChange(hours * 60 + newMinutes)
    }

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        <Label className="text-sm font-medium">Study Time</Label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={handleHoursChange}
              disabled={disabled}
              placeholder="0"
              className="text-center"
            />
            <Label className="text-xs text-muted-foreground mt-1 block text-center">
              Hours
            </Label>
          </div>
          <div className="flex-1">
            <Input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={handleMinutesChange}
              disabled={disabled}
              placeholder="0"
              className="text-center"
            />
            <Label className="text-xs text-muted-foreground mt-1 block text-center">
              Minutes
            </Label>
          </div>
        </div>
      </div>
    )
  }
)

TimeInput.displayName = "TimeInput"
