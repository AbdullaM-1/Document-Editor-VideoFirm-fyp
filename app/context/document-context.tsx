"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { useAuth } from "./auth-context"

type Document = {
  id: string
  title: string
  content: string
  lastEdited: Date
}

type DocumentSummary = {
  id: string
  title: string
  lastEdited: Date
  createdAt: Date
}

type DocumentContextType = {
  documents: DocumentSummary[]
  currentDocument: Document | null
  loading: boolean
  error: string | null
  documentsLoaded: boolean
  fetchDocuments: () => Promise<void>
  fetchDocument: (id: string) => Promise<void>
  createDocument: (title?: string, content?: string) => Promise<Document>
  updateDocument: (id: string, data: { title?: string; content?: string }) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  setCurrentDocument: (doc: Document | null) => void
  testCreateDocument: () => Promise<Document>
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export function DocumentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<DocumentSummary[]>([])
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [documentsLoaded, setDocumentsLoaded] = useState<boolean>(false)
  const isMountedRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)
  const initialFetchDoneRef = useRef(false)
  const [isCreatingInitialDocument, setIsCreatingInitialDocument] = useState<boolean>(false)
  const fetchingDocumentRef = useRef<string | null>(null)
  const documentInitializedRef = useRef<string | null>(null)

  // Set up cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Fetch all documents when user changes
  useEffect(() => {
    if (user && !initialFetchDoneRef.current) {
      initialFetchDoneRef.current = true
      fetchDocuments()
    } else if (!user) {
      setDocuments([])
      setCurrentDocument(null)
    }
  }, [user])

  const fetchDocuments = async () => {
    if (!user || !isMountedRef.current || loading) return

    setLoading(true)
    setError(null)

    try {
      console.log("Fetching documents for user:", user.id)

      // Create a new AbortController for this request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const res = await fetch("/api/documents", {
        signal: abortControllerRef.current.signal,
      })

      if (!isMountedRef.current) return

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Fetch documents error response:", errorData)
        throw new Error(errorData.error || errorData.details || "Failed to fetch documents")
      }

      const data = await res.json()
      console.log("Documents fetched successfully:", data.documents?.length || 0)

      if (isMountedRef.current) {
        setDocuments(data.documents || [])
        setDocumentsLoaded(true)

        // If documents were loaded and there's at least one, load the most recent one
        if (data.documents && data.documents.length > 0 && !currentDocument) {
          // Sort by lastEdited (newest first)
          const sortedDocs = [...data.documents].sort(
            (a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime(),
          )

          // Add a small delay before fetching the document to prevent rapid navigation
          setTimeout(() => {
            if (isMountedRef.current && !currentDocument) {
              fetchDocument(sortedDocs[0].id)
            }
          }, 100)
        } else if (data.documents && data.documents.length === 0 && !isCreatingInitialDocument) {
          // If no documents exist, create a new one
          setIsCreatingInitialDocument(true)
          setTimeout(() => {
            if (isMountedRef.current) {
              createDocument("Untitled Document", "").catch((err) => {
                console.error("Error creating initial document:", err)
                setIsCreatingInitialDocument(false)
              })
            }
          }, 100)
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("Fetch documents request aborted")
        return
      }

      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch documents"
        setError(errorMessage)
        console.error("Fetch documents error:", err)

        // Even if there's an error, mark documents as loaded
        setDocumentsLoaded(true)
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }

  const fetchDocument = async (id: string) => {
    if (!user || !isMountedRef.current) return null

    // Don't fetch if it's the current document
    if (currentDocument && currentDocument.id === id) return currentDocument

    // Use a ref to track if we're already fetching this document
    if (fetchingDocumentRef.current === id) return null
    fetchingDocumentRef.current = id

    setLoading(true)
    setError(null)

    try {
      console.log("Fetching document:", id)

      // Create a new AbortController for this request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const res = await fetch(`/api/documents/${id}`, {
        signal: abortControllerRef.current.signal,
      })

      if (!isMountedRef.current) return null

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || errorData.details || "Failed to fetch document")
      }

      const data = await res.json()

      if (isMountedRef.current) {
        // Set the current document without triggering any saves
        setCurrentDocument(data.document)
        // Reset initialization flag
        documentInitializedRef.current = data.document.id
      }
      return data.document
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return null
      }

      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch document"
        setError(errorMessage)
        console.error("Fetch document error:", err)
        throw err
      }
      return null
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
        // Important: Reset the fetching ref when done
        fetchingDocumentRef.current = null
      }
    }
  }

  const createDocument = async (title = "Untitled Document", content = "") => {
    if (!user || !isMountedRef.current) throw new Error("User not authenticated")

    setLoading(true)
    setError(null)

    try {
      console.log("Creating document:", { title, contentLength: content.length })

      // Create a new AbortController for this request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
        signal: abortControllerRef.current.signal,
      })

      if (!isMountedRef.current) throw new Error("Component unmounted")

      const data = await res.json()

      console.log("Create document response:", data)

      if (!res.ok) {
        throw new Error(data.error || "Failed to create document")
      }

      // Update documents list without triggering auto-saves
      if (isMountedRef.current) {
        // Just update the documents list
        const newDoc = data.document
        setDocuments((prev) => [
          ...prev,
          {
            id: newDoc.id,
            title: newDoc.title,
            lastEdited: new Date(newDoc.lastEdited),
            createdAt: new Date(),
          },
        ])

        // Set as current document without triggering auto-saves
        setCurrentDocument(newDoc)
        console.log("New document created without auto-saving")
        setIsCreatingInitialDocument(false)
      }

      return data.document
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("Create document request aborted")
        throw new Error("Request aborted")
      }

      const errorMessage = err instanceof Error ? err.message : "Failed to create document"
      if (isMountedRef.current) {
        setError(errorMessage)
        console.error("Create document error:", err)
        setIsCreatingInitialDocument(false)
      }
      throw new Error(errorMessage)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }

  const updateDocument = async (id: string, data: { title?: string; content?: string }) => {
    if (!user || !isMountedRef.current) return

    setError(null)

    try {
      console.log(`Updating document ${id}:`, {
        titleLength: data.title?.length,
        contentLength: data.content?.length,
      })

      // Create a new AbortController for this request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const res = await fetch(`/api/documents/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: abortControllerRef.current.signal,
      })

      if (!isMountedRef.current) return

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to update document")
      }

      console.log("Document updated successfully:", responseData.document?.id)

      // Update the document in state after successful API call
      if (isMountedRef.current) {
        if (currentDocument && currentDocument.id === id) {
          setCurrentDocument({
            ...currentDocument,
            ...(data.title !== undefined ? { title: data.title } : {}),
            ...(data.content !== undefined ? { content: data.content } : {}),
            lastEdited: new Date(),
          })
        }

        // Update document in the list
        setDocuments((docs) =>
          docs.map((doc) =>
            doc.id === id
              ? {
                  ...doc,
                  ...(data.title !== undefined ? { title: data.title } : {}),
                  lastEdited: new Date(),
                }
              : doc,
          ),
        )
      }

      return responseData.document
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("Update document request aborted")
        return
      }

      if (isMountedRef.current) {
        console.error("Update document error:", err)
        setError(err instanceof Error ? err.message : "Failed to update document")
        throw err
      }
    }
  }

  const deleteDocument = async (id: string) => {
    if (!user || !isMountedRef.current) return

    setLoading(true)
    setError(null)

    try {
      // Create a new AbortController for this request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const res = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
        signal: abortControllerRef.current.signal,
      })

      if (!isMountedRef.current) return

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete document")
      }

      // Remove from documents list
      if (isMountedRef.current) {
        setDocuments((docs) => docs.filter((doc) => doc.id !== id))

        // Clear current document if it's the one being deleted
        if (currentDocument && currentDocument.id === id) {
          setCurrentDocument(null)
        }
      }

      return true
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("Delete document request aborted")
        return
      }

      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : "Failed to delete document")
        console.error("Delete document error:", err)
        throw err
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }

  const testCreateDocument = async () => {
    if (!user || !isMountedRef.current) throw new Error("User not authenticated")

    setLoading(true)
    setError(null)

    try {
      console.log("Testing simple document creation")

      // Create a new AbortController for this request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const res = await fetch("/api/documents/simple-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortControllerRef.current.signal,
      })

      if (!isMountedRef.current) throw new Error("Component unmounted")

      const data = await res.json()

      console.log("Simple create document response:", data)

      if (!res.ok) {
        throw new Error(data.error || "Failed to create test document")
      }

      // Update documents list
      if (isMountedRef.current) {
        await fetchDocuments()
      }

      return data.document
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("Test create document request aborted")
        throw new Error("Request aborted")
      }

      const errorMessage = err instanceof Error ? err.message : "Failed to create test document"
      if (isMountedRef.current) {
        setError(errorMessage)
        console.error("Test create document error:", err)
      }
      throw new Error(errorMessage)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }

  return (
    <DocumentContext.Provider
      value={{
        documents,
        currentDocument,
        loading,
        error,
        documentsLoaded,
        fetchDocuments,
        fetchDocument,
        createDocument,
        updateDocument,
        deleteDocument,
        setCurrentDocument,
        testCreateDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider")
  }
  return context
}
