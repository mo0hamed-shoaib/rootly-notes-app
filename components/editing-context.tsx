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
  const [isEditingEnabled] = useState(true)
  return <EditingContext.Provider value={{ isEditingEnabled, unlockEditing: () => true, lockEditing: () => {} }}>{children}</EditingContext.Provider>
}

export function useEditing() {
  const context = useContext(EditingContext)
  if (context === undefined) {
    throw new Error("useEditing must be used within an EditingProvider")
  }
  return context
}
