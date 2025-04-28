"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestModelPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testUserCreation = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/test-user-creation")
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
          <CardTitle>Test User Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testUserCreation} disabled={loading} className="w-full">
            {loading ? "Testing..." : "Test User Creation"}
          </Button>

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
