"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

interface EditingContextType {
  isEditingEnabled: boolean
  unlockEditing: (password: string) => boolean
  lockEditing: () => void
}

const EditingContext = createContext<EditingContextType | undefined>(undefined)

export function EditingProvider({ children }: { children: React.ReactNode }) {
  const [isEditingEnabled, setIsEditingEnabled] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("editing-enabled")
    if (saved === "true") {
      setIsEditingEnabled(true)
    }
  }, [])

  const unlockEditing = (password: string): boolean => {
    // Temporary hardcoded password for testing
    const correctPassword = "Jimmy@1122"
    if (password === correctPassword) {
      setIsEditingEnabled(true)
      localStorage.setItem("editing-enabled", "true")
      toast.success("Editing unlocked", {
        description: "You can now edit your notes and courses.",
      })
      return true
    } else {
      toast.error("Incorrect password", {
        description: "Please try again.",
      })
      return false
    }
  }

  const lockEditing = () => {
    setIsEditingEnabled(false)
    localStorage.removeItem("editing-enabled")
          toast.success("Editing locked", {
        description: "All edit functions are now disabled.",
      })
  }

  return (
    <EditingContext.Provider value={{ isEditingEnabled, unlockEditing, lockEditing }}>
      {children}
    </EditingContext.Provider>
  )
}

export function useEditing() {
  const context = useContext(EditingContext)
  if (context === undefined) {
    throw new Error("useEditing must be used within an EditingProvider")
  }
  return context
}
