"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"

type User = {
  id: string
  username: string
  name: string
  email: string
  role: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

type RegisterData = {
  username: string
  name: string
  phone: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMountedRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status")

        // Create a new AbortController for this request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()

        const res = await fetch("/api/auth/me", {
          signal: abortControllerRef.current.signal,
        })

        if (!isMountedRef.current) return

        if (!res.ok) {
          console.log("Not authenticated")
          setUser(null)
          return
        }

        const data = await res.json()
        console.log("Auth check response:", data)

        if (!isMountedRef.current) return

        if (data.success && data.user) {
          console.log("User is authenticated:", data.user.id)
          setUser(data.user)
        } else {
          console.log("No authenticated user found")
          setUser(null)
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Auth check aborted")
          return
        }

        if (isMountedRef.current) {
          console.error("Auth check error:", err)
          setUser(null)
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false)
        }
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    if (!isMountedRef.current) return

    setLoading(true)
    setError(null)

    try {
      console.log("Logging in with email:", email)

      // Create a new AbortController for this request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        signal: abortControllerRef.current.signal,
      })

      if (!isMountedRef.current) return

      const data = await res.json()
      console.log("Login response:", data)

      if (!res.ok) {
        throw new Error(data.error || data.details || "Login failed")
      }

      setUser(data.user)
      return data
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("Login request aborted")
        return
      }

      if (isMountedRef.current) {
        console.error("Login error:", err)
        setError(err instanceof Error ? err.message : "Login failed")
        throw err
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }

  const register = async (userData: RegisterData) => {
    if (!isMountedRef.current) return

    setLoading(true)
    setError(null)

    try {
      console.log("Registering with email:", userData.email)

      // Create a new AbortController for this request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        signal: abortControllerRef.current.signal,
      })

      if (!isMountedRef.current) return

      const data = await res.json()
      console.log("Registration response:", data)

      if (!res.ok) {
        throw new Error(data.error || data.details || "Registration failed")
      }

      setUser(data.user)
      return data
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("Registration request aborted")
        return
      }

      if (isMountedRef.current) {
        console.error("Registration error:", err)
        setError(err instanceof Error ? err.message : "Registration failed")
        throw err
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }

  const logout = async () => {
    if (!isMountedRef.current) return

    setLoading(true)
    setError(null)

    try {
      console.log("Logging out")

      // Create a new AbortController for this request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      await fetch("/api/auth/logout", {
        method: "POST",
        signal: abortControllerRef.current.signal,
      })

      if (!isMountedRef.current) return

      setUser(null)
      console.log("Logged out successfully")
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("Logout request aborted")
        return
      }

      if (isMountedRef.current) {
        console.error("Logout error:", err)
        setError(err instanceof Error ? err.message : "Logout failed")
        throw err
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, error }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
