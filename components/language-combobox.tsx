"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import type { CodeLanguage } from "@/lib/types"
import { cn } from "@/lib/utils"

const LANGUAGE_OPTIONS: { label: string; value: CodeLanguage }[] = [
  { label: "Plain text", value: "plaintext" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "React (JSX)", value: "jsx" },
  { label: "React (TSX)", value: "tsx" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C#", value: "csharp" },
  { label: "Go", value: "go" },
  { label: "Ruby", value: "ruby" },
  { label: "PHP", value: "php" },
  { label: "SQL", value: "sql" },
  { label: "Shell (Bash)", value: "bash" },
  { label: "JSON", value: "json" },
  { label: "YAML", value: "yaml" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "Markdown", value: "markdown" },
]

interface LanguageComboboxProps {
  value?: CodeLanguage
  onChange: (value: CodeLanguage) => void
  placeholder?: string
  className?: string
}

export function LanguageCombobox({ value = "plaintext", onChange, placeholder = "Select language", className }: LanguageComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const selected = LANGUAGE_OPTIONS.find((o) => o.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[240px] justify-between h-9", className)}
       >
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[280px]"
        align="start"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <Command className="max-h-64">
          <CommandInput placeholder="Search language..." />
          <CommandList
            className="max-h-64 overflow-auto"
            onWheelCapture={(e) => e.stopPropagation()}
            onTouchMoveCapture={(e) => e.stopPropagation()}
            style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
          >
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {LANGUAGE_OPTIONS.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === opt.value ? "opacity-100" : "opacity-0")} />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


