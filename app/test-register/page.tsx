"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function TestRegisterPage() {
  const [formData, setFormData] = useState({
    username: "testuser" + Math.floor(Math.random() * 1000),
    name: "Test User",
    email: `test${Math.floor(Math.random() * 1000)}@example.com`,
    password: "password123",
  })
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResponse(null)
    setLoading(true)

    try {
      console.log("Submitting registration data:", formData)

      // Test the debug endpoint first
      const debugRes = await fetch("/api/debug/register")
      const debugData = await debugRes.json()
      console.log("Debug response:", debugData)

      // Try the simple registration
      const res = await fetch("/api/auth/simple-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      console.log("Registration response:", data)

      setResponse(data)

      if (!res.ok) {
        throw new Error(data.error || data.details || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Test Registration</CardTitle>
          <CardDescription>This is a simplified registration form for testing</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-50 text-red-500 border border-red-200 rounded-md">{error}</div>
            )}

            {response && (
              <div className="p-3 text-sm bg-green-50 text-green-700 border border-green-200 rounded-md">
                <pre className="whitespace-pre-wrap overflow-auto max-h-40">{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testing Registration
                </>
              ) : (
                "Test Register"
              )}
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={async () => {
                  try {
                    setLoading(true)
                    const res = await fetch("/api/debug/register")
                    const data = await res.json()
                    setResponse(data)
                  } catch (error) {
                    setError(error instanceof Error ? error.message : "Debug failed")
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
              >
                Test Debug
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={async () => {
                  try {
                    setLoading(true)
                    const res = await fetch("/api/test-db")
                    const data = await res.json()
                    setResponse(data)
                  } catch (error) {
                    setError(error instanceof Error ? error.message : "DB test failed")
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
              >
                Test DB
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
