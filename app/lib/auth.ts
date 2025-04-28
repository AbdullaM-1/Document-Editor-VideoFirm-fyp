import { type NextRequest, NextResponse } from "next/server"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

// Use a simple secret key for development
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_jwt_secret_key_for_development_only")

export async function signJWT(payload: any) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET)

    return token
  } catch (error) {
    console.error("Error signing JWT:", error)
    throw new Error("Failed to sign JWT")
  }
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    console.error("JWT verification error:", error)
    return null
  }
}

export async function setAuthCookie(token: string) {
  try {
    cookies().set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  } catch (error) {
    console.error("Error setting auth cookie:", error)
    throw new Error("Failed to set authentication cookie")
  }
}

export async function getAuthToken() {
  try {
    return cookies().get("auth-token")?.value
  } catch (error) {
    console.error("Error getting auth token:", error)
    return null
  }
}

export async function removeAuthCookie() {
  try {
    cookies().delete("auth-token")
  } catch (error) {
    console.error("Error removing auth cookie:", error)
    throw new Error("Failed to remove authentication cookie")
  }
}

export async function getCurrentUser(req?: NextRequest) {
  try {
    // Get token from cookies or request headers
    const token = req ? req.cookies.get("auth-token")?.value : await getAuthToken()

    if (!token) {
      console.log("No auth token found")
      return null
    }

    const payload = await verifyJWT(token)
    if (!payload) {
      console.log("Invalid auth token")
      return null
    }

    return payload
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

export function withAuth(handler: Function) {
  return async (req: NextRequest) => {
    const user = await getCurrentUser(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return handler(req, user)
  }
}
