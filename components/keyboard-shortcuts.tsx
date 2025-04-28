"use client"

import { useEffect, useRef } from "react"

interface KeyboardShortcutsProps {
  onBold: () => void
  onItalic: () => void
  onUnderline: () => void
  onUndo: () => void
  onRedo: () => void
}

export function KeyboardShortcuts({ onBold, onItalic, onUnderline, onUndo, onRedo }: KeyboardShortcutsProps) {
  const isMountedRef = useRef(true)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMountedRef.current) return

      // Check if Ctrl key (or Command key on Mac) is pressed
      const isCtrlPressed = e.ctrlKey || e.metaKey

      if (isCtrlPressed) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault()
            onBold()
            break
          case "i":
            e.preventDefault()
            onItalic()
            break
          case "u":
            e.preventDefault()
            onUnderline()
            break
          case "z":
            e.preventDefault()
            onUndo()
            break
          case "y":
            e.preventDefault()
            onRedo()
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      isMountedRef.current = false
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onBold, onItalic, onUnderline, onUndo, onRedo])

  return null
}
