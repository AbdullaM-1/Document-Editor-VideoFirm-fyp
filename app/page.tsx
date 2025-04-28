"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import LandingPage from "./landing-page"
import { useAuth } from "./context/auth-context"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  // If user is already authenticated, redirect to editor
  useEffect(() => {
    if (user && !authLoading) {
      router.push("/editor")
    }
  }, [user, authLoading, router])

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    )
  }

  // If not authenticated, show the landing page
  return <LandingPage />
}
