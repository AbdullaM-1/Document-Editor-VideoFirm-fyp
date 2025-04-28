"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "../context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState("")
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, loading, user } = useAuth()
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to editor")
      router.push("/editor")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setDebugInfo(null)
    setIsSubmitting(true)

    if (!email || !password) {
      setFormError("Please fill in all fields")
      setIsSubmitting(false)
      return
    }

    try {
      console.log("Attempting login with email:", email)

      // Make direct fetch request instead of using context
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log("Login response:", data)

      // Save debug info for display
      setDebugInfo(data)

      if (!res.ok) {
        throw new Error(data.error || data.details || "Login failed")
      }

      // Manually refresh the page to ensure auth state is updated
      window.location.href = "/"
    } catch (error) {
      console.error("Login error:", error)
      setFormError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to test the API connection
  const testApiConnection = async () => {
    try {
      setIsSubmitting(true)
      const res = await fetch("/api/test")
      const data = await res.json()
      setDebugInfo(data)
      console.log("API test response:", data)
    } catch (error) {
      console.error("API test error:", error)
      setFormError(error instanceof Error ? error.message : "API test failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {formError && (
              <div className="p-3 text-sm bg-red-50 text-red-500 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <div>{formError}</div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {debugInfo && (
              <div className="mt-4 p-3 text-xs bg-gray-50 border border-gray-200 rounded-md">
                <div className="font-semibold mb-1">Debug Information:</div>
                <pre className="whitespace-pre-wrap overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Register
              </Link>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <Link href="/" className="hover:underline">
                Back to home
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
