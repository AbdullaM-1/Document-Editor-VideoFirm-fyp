import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/app/lib/db"
import { signJWT, setAuthCookie } from "@/app/lib/auth"

export async function POST(req: NextRequest) {
  try {
    console.log("Login request received")

    // Connect to database
    try {
      await connectDB()
      console.log("Connected to database")
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 },
      )
    }

    // Parse request body
    const body = await req.json()
    const { email, password } = body

    console.log("Login attempt for email:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Import the User model directly
    const User = (await import("@/app/models/user-direct")).default
    console.log("User model imported:", !!User)

    // Find user by email
    let user
    try {
      user = await User.findOne({ email, isDeleted: false })
    } catch (findError) {
      console.error("Error finding user:", findError)
      return NextResponse.json(
        {
          error: "Error finding user",
          details: findError instanceof Error ? findError.message : String(findError),
        },
        { status: 500 },
      )
    }

    if (!user) {
      console.log("User not found for email:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("User found:", user._id)

    // Check password
    let isPasswordMatch
    try {
      isPasswordMatch = await user.comparePassword(password)
    } catch (passwordError) {
      console.error("Password comparison error:", passwordError)
      return NextResponse.json(
        {
          error: "Error verifying password",
          details: passwordError instanceof Error ? passwordError.message : String(passwordError),
        },
        { status: 500 },
      )
    }

    if (!isPasswordMatch) {
      console.log("Password does not match for user:", user._id)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("Password matched for user:", user._id)

    // Generate JWT token
    let token
    try {
      token = await signJWT({
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
      })
      console.log("JWT token generated")
    } catch (tokenError) {
      console.error("Token generation error:", tokenError)
      return NextResponse.json(
        {
          error: "Error generating authentication token",
          details: tokenError instanceof Error ? tokenError.message : String(tokenError),
        },
        { status: 500 },
      )
    }

    // Set auth cookie
    try {
      await setAuthCookie(token)
      console.log("Auth cookie set")
    } catch (cookieError) {
      console.error("Cookie setting error:", cookieError)
      return NextResponse.json(
        {
          error: "Error setting authentication cookie",
          details: cookieError instanceof Error ? cookieError.message : String(cookieError),
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Failed to login",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
