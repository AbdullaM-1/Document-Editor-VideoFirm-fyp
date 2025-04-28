"use client"

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  onSelectionChange?: () => void
  className?: string
}

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ value, onChange, onSelectionChange, className }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const isUpdatingRef = useRef(false)
    const isMountedRef = useRef(true)
    const initialContentSetRef = useRef(false)

    // Forward the ref
    useImperativeHandle(ref, () => editorRef.current as HTMLDivElement)

    // Set up cleanup on unmount
    useEffect(() => {
      return () => {
        isMountedRef.current = false
      }
    }, [])

    // Initialize content only once when the component mounts or when value changes
    useEffect(() => {
      if (!editorRef.current || !value) return

      // Only set content if it hasn't been initialized or if we're switching documents
      if (!initialContentSetRef.current) {
        // Set the content and mark as initialized
        editorRef.current.innerHTML = value
        initialContentSetRef.current = true
      }
    }, [value])

    // Reset initialization flag when value changes significantly
    useEffect(() => {
      // If the value is completely different, reset the initialization flag
      if (editorRef.current && value && initialContentSetRef.current) {
        const currentContent = editorRef.current.innerHTML
        // Only reset if content is completely different (e.g., switching documents)
        if (
          currentContent.length > 0 &&
          value.length > 0 &&
          !currentContent.includes(value.substring(0, 50)) &&
          !value.includes(currentContent.substring(0, 50))
        ) {
          initialContentSetRef.current = false
        }
      }
    }, [value])

    // Handle selection changes
    useEffect(() => {
      if (!onSelectionChange) return

      const handleSelectionChange = () => {
        if (!isMountedRef.current || !editorRef.current) return

        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          if (editorRef.current.contains(range.commonAncestorContainer)) {
            onSelectionChange()
          }
        }
      }

      document.addEventListener("selectionchange", handleSelectionChange)
      return () => {
        document.removeEventListener("selectionchange", handleSelectionChange)
      }
    }, [onSelectionChange])

    // Handle input events
    const handleInput = () => {
      if (!editorRef.current || !isMountedRef.current || isUpdatingRef.current) return

      try {
        isUpdatingRef.current = true
        const newContent = editorRef.current.innerHTML

        // Debounce updates to prevent rapid firing
        const timeoutId = setTimeout(() => {
          if (isMountedRef.current) {
            onChange(newContent)
            isUpdatingRef.current = false
          }
        }, 50)

        return () => {
          clearTimeout(timeoutId)
          isUpdatingRef.current = false
        }
      } catch (error) {
        console.error("Error handling input:", error)
        isUpdatingRef.current = false
      }
    }

    return (
      <div
        ref={editorRef}
        contentEditable
        className={cn(
          "w-full min-h-[calc(100vh-200px)] outline-none p-8 text-base leading-relaxed overflow-auto",
          className,
        )}
        onInput={handleInput}
        onClick={onSelectionChange}
        onKeyUp={onSelectionChange}
        style={{ fontFamily: "Arial, sans-serif" }}
        suppressContentEditableWarning
      />
    )
  },
)

RichTextEditor.displayName = "RichTextEditor"
