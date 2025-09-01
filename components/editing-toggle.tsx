"use client"

import { Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEditing } from "./editing-context"
import { PasswordDialog } from "./password-dialog"

export function EditingToggle() {
  const { isEditingEnabled, lockEditing } = useEditing()

  if (isEditingEnabled) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="bg-transparent"
        onClick={lockEditing}
        title="Click to lock editing"
      >
        <Unlock className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Lock editing</span>
      </Button>
    )
  }

  return <PasswordDialog />
}
