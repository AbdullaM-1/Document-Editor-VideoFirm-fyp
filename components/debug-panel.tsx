"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { transformTextWithGemini } from "@/app/actions/gemini-actions"

export function DebugPanel() {
  const [result, setResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [modelVersion, setModelVersion] = useState<string>("gemini-2.0-flash")

  const testGeminiAPI = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const testText = "This is a test sentence to check if the Gemini API is working correctly."
      const transformedText = await transformTextWithGemini(testText, "expand")
      setResult(transformedText)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm">Debug Gemini API</CardTitle>
        <div className="text-xs text-muted-foreground mt-1">Using model: {modelVersion}</div>
      </CardHeader>
      <CardContent>
        <Button onClick={testGeminiAPI} disabled={isLoading} variant="outline" size="sm" className="mb-4">
          {isLoading ? "Testing..." : "Test Gemini API"}
        </Button>

        {error && <div className="text-sm p-2 bg-red-100 text-red-800 rounded-md mb-2">Error: {error}</div>}

        {result && (
          <div>
            <div className="text-sm font-medium mb-1">API Response:</div>
            <div className="text-sm p-2 bg-muted rounded-md whitespace-pre-wrap">{result}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
