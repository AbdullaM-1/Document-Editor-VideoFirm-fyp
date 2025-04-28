"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import DocumentEditor from "@/components/document-editor"
import { useAuth } from "@/app/context/auth-context"
import { useDocuments } from "@/app/context/document-context"
import { Loader2 } from "lucide-react"

export default function DocumentPage() {
  const { documentId } = useParams()
  const { user, loading: authLoading } = useAuth()
  const { fetchDocument, currentDocument, loading: documentLoading } = useDocuments()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !authLoading) {
      window.location.href = "/login"
    }
  }, [user, authLoading, router])

  // Fetch the document when the component mounts or documentId changes
  useEffect(() => {
    if (user && documentId && typeof documentId === "string") {
      fetchDocument(documentId).catch((error) => {
        console.error("Error fetching document:", error)
        // If document not found, redirect to documents list
        router.push("/editor")
      })
    }
  }, [documentId, user, fetchDocument, router])

  if (authLoading || documentLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading document...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="mb-4">Please log in to view this document</p>
          <button onClick={() => router.push("/login")} className="bg-blue-500 text-white px-4 py-2 rounded">
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return <DocumentEditor documentId={documentId as string} />
}
