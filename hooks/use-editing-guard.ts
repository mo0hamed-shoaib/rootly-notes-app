import { useEditing } from "@/components/editing-context"
import { toast } from "sonner"

export function useEditingGuard() {
  const { isEditingEnabled } = useEditing()

  const guardAction = (action: string, callback: () => void) => {
    if (isEditingEnabled) {
      callback()
    } else {
      toast.error(`Unlock to ${action}`)
    }
  }

  return {
    isEditingEnabled,
    guardAction,
  }
}
