"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Eye, EyeOff } from "lucide-react"

export function ToggleAnswersButton() {
  const [showAnswers, setShowAnswers] = useState(false)

  useEffect(() => {
    // Load saved preference from localStorage, default to false (hidden)
    const saved = localStorage.getItem("rootly_show_answers_default")
    const defaultShowAnswers = saved !== null ? JSON.parse(saved) : false
    setShowAnswers(defaultShowAnswers)
    
    // Update the data attribute for the NotesGrid to observe
    const toggleBtn = document.getElementById('toggle-answers-btn')
    if (toggleBtn) {
      toggleBtn.setAttribute('data-show-answers', String(defaultShowAnswers))
    }
  }, [])

  const handleToggle = () => {
    const newState = !showAnswers
    setShowAnswers(newState)
    
    // Save to localStorage
    localStorage.setItem("rootly_show_answers_default", JSON.stringify(newState))
    
    // Update the data attribute for the NotesGrid to observe
    const toggleBtn = document.getElementById('toggle-answers-btn')
    if (toggleBtn) {
      toggleBtn.setAttribute('data-show-answers', String(newState))
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            id="toggle-answers-btn"
            className="h-9 flex items-center gap-2"
            data-show-answers={String(showAnswers)}
            onClick={handleToggle}
          >
            {showAnswers ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Answers
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show Answers
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle visibility of all answers</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
