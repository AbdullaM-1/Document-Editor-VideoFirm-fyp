"use client"

import { useState, useEffect, useRef } from "react"

type StatusIndicatorProps = {
  lastSaved?: Date
  isSaving?: boolean
}

export function StatusIndicator({ lastSaved, isSaving = false }: StatusIndicatorProps) {
  const [status, setStatus] = useState<"saved" | "saving" | "unsaved">("saved")
  const isMountedRef = useRef(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  // Update status based on isSaving prop
  useEffect(() => {
    if (isSaving) {
      setStatus("saving")
    } else if (lastSaved) {
      setStatus("saved")
    }
  }, [isSaving, lastSaved])

  if (!lastSaved) return null

  return (
    <div className="text-sm text-muted-foreground flex items-center">
      {status === "saving" && "Saving..."}
      {status === "saved" && (
        <>
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          All changes saved
        </>
      )}
      {status === "unsaved" && (
        <>
          <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
          Unsaved changes
        </>
      )}
    </div>
  )
}
