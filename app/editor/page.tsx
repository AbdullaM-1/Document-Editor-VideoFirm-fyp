"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/auth-context"
import { useDocuments } from "@/app/context/document-context"
import { Loader2 } from "lucide-react"

export default function EditorPage() {
  const { user, loading: authLoading } = useAuth()
  const { documents, fetchDocuments, loading: documentsLoading, createDocument, documentsLoaded } = useDocuments()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !authLoading) {
      window.location.href = "/login"
    }
  }, [user, authLoading])

  // Fetch documents when the component mounts
  useEffect(() => {
    if (user && !documentsLoaded) {
      fetchDocuments()
    }
  }, [user, fetchDocuments, documentsLoaded])

  // Redirect to the most recent document or create a new one
  useEffect(() => {
    const redirectToDocument = async () => {
      if (!user || authLoading || documentsLoading || !documentsLoaded) return

      if (documents.length > 0) {
        // Sort by lastEdited (newest first)
        const sortedDocs = [...documents].sort(
          (a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime(),
        )
        // Redirect to the most recent document
        router.push(`/editor/${sortedDocs[0].id}`)
      } else {
        // Create a new document if none exists
        try {
          const newDoc = await createDocument("Untitled Document", "")
          if (newDoc) {
            router.push(`/editor/${newDoc.id}`)
          }
        } catch (error) {
          console.error("Error creating document:", error)
        }
      }
    }

    redirectToDocument()
  }, [user, authLoading, documents, documentsLoading, documentsLoaded, router, createDocument])

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin mr-2" />
      <span>Loading your documents...</span>
    </div>
  )
}
