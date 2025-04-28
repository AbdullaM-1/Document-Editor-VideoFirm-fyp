"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Loader2,
  Sparkles,
  Maximize2,
  MinusCircle,
  FileText,
  Terminal,
  Save,
  ChevronDown,
  ChevronRight,
  PanelLeft,
  ChevronLeft,
  MoreHorizontal,
  Clock,
  LogOut,
  Plus,
  Trash2,
  AlertCircle,
  Download,
} from "lucide-react"
import { transformTextWithGemini } from "@/app/actions/gemini-actions"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { EditorToolbar } from "./editor-toolbar"
import { StatusIndicator } from "./status-indicator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MaximizeIcon as Enhance, BookOpenCheck, PenSquare } from "lucide-react"
import { RichTextEditor } from "./rich-text-editor"
import { KeyboardShortcuts } from "./keyboard-shortcuts"
import { useAuth } from "@/app/context/auth-context"
import { useDocuments } from "@/app/context/document-context"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import dynamic from "next/dynamic"

// Dynamically import html2pdf to avoid SSR issues
const html2pdf = dynamic(() => import("html2pdf.js"), { ssr: false })

type TransformationType = "enhance" | "expand" | "simplify" | "summarize" | "rewrite" | "command"

const transformationOptions = [
  {
    type: "enhance",
    label: "Enhance",
    icon: <Enhance className="h-4 w-4" />,
    color: "bg-green-500 hover:bg-green-700 text-white",
    description: "Make text clearer and more professional",
  },
  {
    type: "expand",
    label: "Expand",
    icon: <Maximize2 className="h-4 w-4" />,
    color: "bg-blue-500 hover:bg-blue-700 text-white",
    description: "Add more details and examples",
  },
  {
    type: "simplify",
    label: "Simplify",
    icon: <MinusCircle className="h-4 w-4" />,
    color: "bg-orange-500 hover:bg-orange-700 text-white",
    description: "Make text easier to understand",
  },
  {
    type: "summarize",
    label: "Summarize",
    icon: <BookOpenCheck className="h-4 w-4" />,
    color: "bg-purple-500 hover:bg-purple-700 text-white",
    description: "Create a concise version",
  },
  {
    type: "rewrite",
    label: "Rewrite",
    icon: <PenSquare className="h-4 w-4" />,
    color: "bg-yellow-500 hover:bg-yellow-700 text-black",
    description: "Change the style while preserving meaning",
  },
  {
    type: "command",
    label: "Command",
    icon: <Terminal className="h-4 w-4" />,
    color: "bg-gray-500 hover:bg-gray-700 text-white",
    description: "Give specific instructions",
  },
]

interface DocumentEditorProps {
  documentId?: string
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const { user, logout } = useAuth()
  const {
    documents,
    currentDocument,
    loading: documentLoading,
    fetchDocuments,
    fetchDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    setCurrentDocument,
  } = useDocuments()
  const router = useRouter()

  const [title, setTitle] = useState<string>("Untitled Document")
  const [content, setContent] = useState<string>("")
  const [selection, setSelection] = useState<{
    text: string
    start: number
    end: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTransformation, setActiveTransformation] = useState<TransformationType | null>(null)
  const [lastSaved, setLastSaved] = useState<Date>(new Date())
  const [wordCount, setWordCount] = useState<number>(0)
  const [estimatedDuration, setEstimatedDuration] = useState<string>("0:00")
  const [showAiPanel, setShowAiPanel] = useState<boolean>(true)
  const [showScriptPanel, setShowScriptPanel] = useState<boolean>(true)
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const editorRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<string>("suggestions")
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [newDocumentTitle, setNewDocumentTitle] = useState<string>("Untitled Document")
  const [isNewDocumentDialogOpen, setIsNewDocumentDialogOpen] = useState<boolean>(false)
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isTitleEditing, setIsTitleEditing] = useState<boolean>(false)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const isMountedRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)
  const contentContainerRef = useRef<HTMLDivElement>(null)
  const [isCreatingInitialDocument, setIsCreatingInitialDocument] = useState<boolean>(false)
  const documentInitializedRef = useRef<string | null>(null)
  const contentInitializedRef = useRef(false)

  // Set up cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Check if user is authenticated
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [user])

  // Redirect if not authenticated
  useEffect(() => {
    // Only redirect if we're certain the user isn't authenticated and loading is complete
    if (!isAuthenticated && !documentLoading && isMountedRef.current) {
      const redirectTimer = setTimeout(() => {
        router.push("/login")
      }, 100)

      return () => clearTimeout(redirectTimer)
    }
  }, [isAuthenticated, documentLoading, router])

  // Initialize editor with current document - ONLY ONCE
  useEffect(() => {
    if (!currentDocument || !isMountedRef.current) return

    // Use a strict equality check with the document ID
    if (documentInitializedRef.current === currentDocument.id) {
      return // Already initialized this document
    }

    // Store the current document ID to prevent re-initialization
    documentInitializedRef.current = currentDocument.id

    // Update local state
    setTitle(currentDocument.title || "Untitled Document")
    setContent(currentDocument.content || "")
    setLastSaved(new Date(currentDocument.lastEdited || new Date()))

    // Reset content initialization flag in the editor
    contentInitializedRef.current = false
  }, [currentDocument])

  // Fetch document when documentId changes
  useEffect(() => {
    if (documentId && user && !documentLoading) {
      fetchDocument(documentId).catch((err) => {
        if (isMountedRef.current) {
          console.error("Error fetching document:", err)
          setError("Failed to load document")
        }
      })
    } else if (!documentId && user && !documentLoading && documents.length > 0 && !currentDocument) {
      // If no documentId is provided, load the most recent document
      const sortedDocs = [...documents].sort(
        (a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime(),
      )
      fetchDocument(sortedDocs[0].id)
    }
  }, [documentId, user, documentLoading, documents, currentDocument, fetchDocument])

  // Handle content changes from the editor
  const handleContentChange = useCallback((newContent: string) => {
    if (!isMountedRef.current) return

    // Just update the local state without triggering any saves
    setContent(newContent)
  }, [])

  // Handle title click to enable editing
  const handleTitleClick = useCallback(() => {
    setIsTitleEditing(true)
    // Focus the input after it becomes visible
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus()
        titleInputRef.current.select()
      }
    }, 10)
  }, [])

  // Handle title blur to save changes
  const handleTitleBlur = useCallback(() => {
    setIsTitleEditing(false)
  }, [])

  // Handle title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isMountedRef.current) return
    setTitle(e.target.value)
  }

  // Handle title key press (Enter to save, Escape to cancel)
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsTitleEditing(false)
    } else if (e.key === "Escape") {
      if (currentDocument) {
        setTitle(currentDocument.title)
      }
      setIsTitleEditing(false)
    }
  }

  // Handle manual save
  const handleSave = () => {
    if (!currentDocument || !isMountedRef.current) return

    console.log("Manual save triggered")

    setIsSaving(true)

    // Create a new AbortController for this save operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    updateDocument(currentDocument.id, { title, content })
      .then(() => {
        if (isMountedRef.current) {
          setLastSaved(new Date())
        }
      })
      .catch((err) => {
        if (isMountedRef.current) {
          console.error("Error saving document:", err)
          setError("Failed to save document")
        }
      })
      .finally(() => {
        if (isMountedRef.current) {
          setIsSaving(false)
        }
      })
  }

  // Handle PDF download
  const handleDownloadPDF = useCallback(async () => {
    if (!currentDocument || !editorRef.current || !isMountedRef.current || typeof window === "undefined") return

    try {
      setIsDownloading(true)
      setError(null)

      // Dynamically import html2pdf only when needed
      const html2pdfModule = await import("html2pdf.js")
      const html2pdf = html2pdfModule.default

      // Create a container for the PDF content
      const container = document.createElement("div")
      container.style.padding = "20px"
      container.style.fontFamily = "Arial, sans-serif"
      container.style.maxWidth = "100%"

      // Add title to the PDF
      const titleElement = document.createElement("h1")
      titleElement.textContent = title
      titleElement.style.marginBottom = "20px"
      titleElement.style.fontSize = "24px"
      container.appendChild(titleElement)

      // Clone the content and append it to the container
      const contentClone = document.createElement("div")
      contentClone.innerHTML = editorRef.current.innerHTML

      // Apply basic styling to the content
      contentClone.style.fontSize = "12pt"
      contentClone.style.lineHeight = "1.5"
      container.appendChild(contentClone)

      // Configure html2pdf options
      const opt = {
        margin: [15, 15, 15, 15],
        filename: `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }

      // Generate and download the PDF
      await html2pdf().from(container).set(opt).save()

      console.log("PDF downloaded successfully")
    } catch (error) {
      console.error("Error generating PDF:", error)
      setError("Failed to download PDF. Please try again.")
    } finally {
      if (isMountedRef.current) {
        setIsDownloading(false)
      }
    }
  }, [title, currentDocument, editorRef])

  // Update selection state when text is selected
  const handleEditorSelectionChange = useCallback(() => {
    if (!isMountedRef.current) return

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0 && selection.toString().trim().length > 0) {
      const selectedText = selection.toString()

      // Check if selection is within our editor
      if (editorRef.current && editorRef.current.contains(selection.anchorNode)) {
        setSelection({
          text: selectedText,
          start: 0, // Not needed for contentEditable
          end: 0, // Not needed for contentEditable
        })
      }
    } else {
      setSelection(null)
    }
  }, [])

  // Handle formatting commands
  const handleFormatText = useCallback(
    (command: string, value?: string) => {
      if (!isMountedRef.current) return

      document.execCommand(command, false, value)

      // Save state for undo
      if (content) {
        setUndoStack((prev) => [...prev, content])
        setRedoStack([])
      }

      // Update content if needed
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML)
      }
    },
    [content],
  )

  // Handle undo
  const handleUndo = useCallback(() => {
    if (!isMountedRef.current) return

    if (undoStack.length > 0) {
      const prevState = undoStack[undoStack.length - 1]
      const newUndoStack = undoStack.slice(0, -1)

      setRedoStack((prev) => [...prev, content])
      setUndoStack(newUndoStack)
      setContent(prevState)
    }
  }, [undoStack, content])

  // Handle redo
  const handleRedo = useCallback(() => {
    if (!isMountedRef.current) return

    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1]
      const newRedoStack = redoStack.slice(0, -1)

      setUndoStack((prev) => [...prev, content])
      setRedoStack(newRedoStack)
      setContent(nextState)
    }
  }, [redoStack, content])

  // Calculate word count and estimated duration
  useEffect(() => {
    if (!editorRef.current || !isMountedRef.current) return

    const text = editorRef.current.innerText || ""
    const words = text.trim().split(/\s+/).filter(Boolean).length
    setWordCount(words)

    // Estimate 150 words per minute for speaking rate
    const minutes = Math.floor(words / 150)
    const seconds = Math.floor((words % 150) / 2.5)
    setEstimatedDuration(`${minutes}:${seconds.toString().padStart(2, "0")}`)
  }, [content])

  // Handle document selection
  const handleSelectDocument = useCallback(
    (id: string) => {
      if (!isMountedRef.current) return

      if (currentDocument?.id !== id) {
        // Navigate to the document URL
        router.push(`/editor/${id}`)
      }
    },
    [currentDocument, router],
  )

  // Handle creating a new document
  const handleCreateDocument = useCallback(async () => {
    if (!isMountedRef.current) return

    try {
      console.log("Creating new document with title:", newDocumentTitle)
      setIsLoading(true)
      setError(null)

      // Reset initialization flags
      documentInitializedRef.current = false
      contentInitializedRef.current = false

      // Create a new AbortController for this operation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const newDoc = await createDocument(newDocumentTitle, "")

      if (isMountedRef.current) {
        console.log("Document created successfully:", newDoc)
        setIsNewDocumentDialogOpen(false)
        setNewDocumentTitle("Untitled Document")

        // Load the new document
        if (newDoc) {
          setCurrentDocument(newDoc)
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error("Error creating document:", error)
        setError(`Failed to create document: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [newDocumentTitle, createDocument, setCurrentDocument])

  // Handle document deletion
  const handleDeleteDocument = useCallback(async () => {
    if (!documentToDelete || !isMountedRef.current) return

    try {
      setError(null)

      // Create a new AbortController for this operation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      await deleteDocument(documentToDelete)

      if (isMountedRef.current) {
        setDocumentToDelete(null)

        // If we deleted the current document, load another one
        if (currentDocument?.id === documentToDelete) {
          if (documents.length > 1) {
            const nextDoc = documents.find((doc) => doc.id !== documentToDelete)
            if (nextDoc) {
              // Reset initialization flags
              documentInitializedRef.current = false
              contentInitializedRef.current = false

              fetchDocument(nextDoc.id).catch((err) => {
                if (isMountedRef.current) {
                  console.error("Error fetching next document:", err)
                  setError("Failed to load next document")
                }
              })
            }
          } else {
            setCurrentDocument(null)
            setTitle("Untitled Document")
            setContent("")
          }
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error("Error deleting document:", error)
        setError("Failed to delete document. Please try again.")
      }
    }
  }, [documentToDelete, currentDocument, documents, deleteDocument, fetchDocument, setCurrentDocument])

  // Handle logout
  const handleLogout = useCallback(async () => {
    if (!isMountedRef.current) return

    try {
      await logout()
      router.push("/login")
    } catch (error) {
      if (isMountedRef.current) {
        console.error("Error during logout:", error)
        setError("Failed to log out. Please try again.")
      }
    }
  }, [logout, router])

  // Handle AI transformation for selected text
  const handleTransform = useCallback(
    async (type: TransformationType) => {
      if (!selection || !isMountedRef.current) return

      setIsLoading(true)
      setActiveTransformation(type)
      setError(null)

      try {
        console.log(`Transforming text with type: ${type}`, selection.text)

        // Create a new AbortController for this operation
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()

        const transformedText = await transformTextWithGemini(selection.text, type)

        if (!isMountedRef.current) return

        console.log("Received transformed text:", transformedText)

        if (transformedText) {
          // Get the current selection
          const selObj = window.getSelection()
          if (selObj && selObj.rangeCount > 0) {
            // Save current content to undo stack
            setUndoStack((prev) => [...prev, content])
            setRedoStack([])

            // Delete the selected text
            const range = selObj.getRangeAt(0)
            range.deleteContents()

            // Insert the transformed text as plain text
            const textNode = document.createTextNode(transformedText)
            range.insertNode(textNode)

            // Collapse the selection to the end of the inserted text
            range.collapse(false)

            // Update content state
            if (editorRef.current) {
              setContent(editorRef.current.innerHTML)
            }
          }
        } else {
          console.error("Received empty response from Gemini API")
          setError("Failed to transform text. Please try again.")
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error(`Error ${type}ing text:`, error)
          setError(`Error ${type}ing text. Please try again.`)
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false)
          setSelection(null)
          setActiveTransformation(null)
        }
      }
    },
    [selection, content],
  )

  // Handle transforming the entire document
  const handleTransformEntireDocument = useCallback(
    async (type: TransformationType) => {
      if (!editorRef.current || !isMountedRef.current) return

      setIsLoading(true)
      setActiveTransformation(type)
      setError(null)

      try {
        const fullText = editorRef.current.innerText
        console.log(`Transforming entire document with type: ${type}`, fullText.substring(0, 100) + "...")

        // Create a new AbortController for this operation
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()

        const transformedText = await transformTextWithGemini(fullText, type)

        if (!isMountedRef.current) return

        console.log("Received transformed text for entire document:", transformedText.substring(0, 100) + "...")

        if (transformedText) {
          // Save current content to undo stack
          setUndoStack((prev) => [...prev, content])
          setRedoStack([])

          // Update content
          editorRef.current.innerHTML = transformedText
          setContent(transformedText)
        } else {
          console.error("Received empty response from Gemini API")
          setError("Failed to transform document. Please try again.")
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error(`Error ${type}ing entire document:`, error)
          setError(`Error ${type}ing document. Please try again.`)
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false)
          setActiveTransformation(null)
        }
      }
    },
    [content],
  )

  // Format date for display
  const formatDate = useCallback((date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()

    // Less than a minute
    if (diff < 60 * 1000) {
      return "Just now"
    }

    // Less than an hour
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
    }

    // Less than a day
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000))
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`
    }

    // Less than a week
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000))
      return `${days} day${days !== 1 ? "s" : ""} ago`
    }

    // Format as date
    return new Date(date).toLocaleDateString()
  }, [])

  // Show loading state while waiting for user data
  if (documentLoading || isCreatingInitialDocument) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>{isCreatingInitialDocument ? "Creating your first document..." : "Loading your documents..."}</p>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Authenticated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You need to log in to access this page.</p>
            <Button onClick={() => router.push("/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation */}
      <header className="border-b">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isTitleEditing ? (
              <Input
                ref={titleInputRef}
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="h-7 text-lg font-medium w-[300px]"
                autoFocus
              />
            ) : (
              <div
                onClick={handleTitleClick}
                className="h-7 text-lg font-medium px-3 py-1 rounded hover:bg-gray-100 cursor-text min-w-[200px]"
              >
                {title}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="default" size="sm" onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-1" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save document (Ctrl+S)</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPDF}
                    disabled={isDownloading || !currentDocument}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {isDownloading ? "Downloading..." : "Download PDF"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download document as PDF</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <StatusIndicator lastSaved={lastSaved} isSaving={isSaving} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <div className="flex flex-col">
                    <span>{user?.name}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-2">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto">
              <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Documents Panel */}
        {showScriptPanel && (
          <div className="w-64 border-r flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-semibold">Your Documents</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {documents &&
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={cn(
                        "p-2 rounded-md cursor-pointer hover:bg-muted transition-colors group",
                        currentDocument?.id === doc.id ? "bg-muted" : "",
                      )}
                      onClick={() => handleSelectDocument(doc.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium truncate">{doc.title}</div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDocumentToDelete(doc.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the document "{doc.title}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDocumentToDelete(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteDocument}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <div className="text-xs text-muted-foreground">Edited {formatDate(new Date(doc.lastEdited))}</div>
                    </div>
                  ))}
                {(!documents || documents.length === 0) && !documentLoading && (
                  <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                    <FileText className="h-12 w-12 text-muted-foreground/50 mb-2" />
                    <p>No documents found.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setIsNewDocumentDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first document
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-3 border-t flex flex-col gap-2">
              <Dialog open={isNewDocumentDialogOpen} onOpenChange={setIsNewDocumentDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    New Document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Document</DialogTitle>
                    <DialogDescription>Enter a title for your new document.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="documentTitle">Document Title</Label>
                    <Input
                      id="documentTitle"
                      value={newDocumentTitle}
                      onChange={(e) => setNewDocumentTitle(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewDocumentDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateDocument}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Formatting Toolbar */}
          <div className="border-b p-2 flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setShowScriptPanel(!showScriptPanel)}>
              {showScriptPanel ? <ChevronLeft className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <EditorToolbar
              onFormatText={handleFormatText}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={undoStack.length > 0}
              canRedo={redoStack.length > 0}
            />
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {estimatedDuration}
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="text-sm text-muted-foreground">
                {wordCount} words
                {selection && (
                  <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 px-1 py-0.5 rounded">
                    {selection.text.length} chars selected
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => setShowAiPanel(!showAiPanel)}>
                <Sparkles className="h-4 w-4" />
                AI
                {showAiPanel ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Editor and AI Panel */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Main Editor */}
            <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
              <div className="max-w-3xl mx-auto p-8 relative" ref={contentContainerRef}>
                <Card className="border shadow-sm">
                  <CardContent className="p-0">
                    <RichTextEditor
                      ref={editorRef}
                      value={content}
                      onChange={handleContentChange}
                      onSelectionChange={handleEditorSelectionChange}
                      className="w-full min-h-[calc(100vh-200px)] outline-none p-8 resize-none border-none focus:ring-0 text-base leading-relaxed"
                    />
                  </CardContent>
                </Card>

                {/* Loading Indicator (Centered in the editor) */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/20 backdrop-blur-sm z-20">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-3" />
                      <span>
                        {activeTransformation
                          ? `${activeTransformation.charAt(0).toUpperCase() + activeTransformation.slice(1)}ing text...`
                          : isDownloading
                            ? "Generating PDF..."
                            : "Processing..."}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Assistant Panel */}
            {showAiPanel && (
              <div className="w-80 border-l flex flex-col">
                <div className="p-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">AI Assistant</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuItem>Help</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                  <TabsList className="grid grid-cols-3 mx-3 mt-2">
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    <TabsTrigger value="transformations" className="relative">
                      Transformations
                      {selection?.text && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="info">Info</TabsTrigger>
                  </TabsList>

                  <TabsContent value="suggestions" className="flex-1 p-3 overflow-auto">
                    <div className="space-y-3">
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">Quick actions</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 space-y-2">
                          {transformationOptions.slice(0, 3).map((option) => (
                            <Button
                              key={option.type}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => handleTransformEntireDocument(option.type as TransformationType)}
                              disabled={isLoading}
                            >
                              {option.icon}
                              <span className="ml-2">
                                {isLoading && activeTransformation === option.type
                                  ? `${option.label}ing...`
                                  : `${option.label} entire document`}
                              </span>
                            </Button>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="transformations" className="flex-1 p-3 overflow-auto">
                    {selection?.text ? (
                      <div className="space-y-4">
                        <Card>
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm">Selected Text</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2">
                            <div className="text-sm bg-muted p-2 rounded-md max-h-24 overflow-auto">
                              {selection.text.length > 150 ? selection.text.substring(0, 150) + "..." : selection.text}
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                              {selection.text.length} characters selected
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm">Transform Selection</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2">
                            <div className="grid grid-cols-2 gap-2">
                              <TooltipProvider>
                                {transformationOptions.map((option) => (
                                  <Tooltip key={option.type}>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        className={`${option.color} shadow-sm w-full`}
                                        onClick={() => handleTransform(option.type as TransformationType)}
                                        disabled={isLoading}
                                      >
                                        {option.icon}
                                        <span className="ml-1">{option.label}</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{option.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ))}
                              </TooltipProvider>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <div className="bg-muted rounded-full p-3 mb-3">
                          <PenSquare className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">No Text Selected</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Select text in the editor to see transformation options
                        </p>
                        <Card className="w-full">
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm">Available transformations</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2">
                            <div className="space-y-2">
                              {transformationOptions.map((option) => (
                                <div key={option.type} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {option.icon}
                                    <span className="text-sm font-medium">{option.label}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">{option.description}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="info" className="flex-1 p-3 overflow-auto">
                    <div className="space-y-3">
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">Document stats</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Word count</span>
                              <Badge variant="outline">{wordCount}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Reading time</span>
                              <Badge variant="outline">{Math.ceil(wordCount / 200)} min</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Last saved</span>
                              <Badge variant="outline">{lastSaved.toLocaleTimeString()}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">About Gemini</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="text-sm text-muted-foreground">
                            This app uses Google's Gemini 2.0 Flash model to transform and enhance your text.
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Updated from Gemini 1.5 Flash due to model deprecation (May 2025).
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>

      <KeyboardShortcuts
        onBold={() => handleFormatText("bold")}
        onItalic={() => handleFormatText("italic")}
        onUnderline={() => handleFormatText("underline")}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
    </div>
  )
}
