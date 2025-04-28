"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestDocumentPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testDocumentCreation = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/documents/simple-create", {
        method: "POST",
      })
      const data = await res.json()

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/documents")
      const data = await res.json()

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Document API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testDocumentCreation} disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Test Document"}
            </Button>

            <Button onClick={fetchDocuments} disabled={loading} className="flex-1" variant="outline">
              {loading ? "Fetching..." : "Fetch Documents"}
            </Button>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-500 border border-red-200 rounded-md">{error}</div>}

          {result && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-60">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
