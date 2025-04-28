import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/app/lib/db"
import { signJWT, setAuthCookie } from "@/app/lib/auth"

export async function POST(req: NextRequest) {
  try {
    console.log("Register request received")

    // Connect to database
    await connectDB()
    console.log("Connected to database")

    // Import the User model directly
    const User = (await import("@/app/models/user-direct")).default
    console.log("User model imported:", !!User)

    // Parse request body
    const body = await req.json()
    const { username, name, phone, email, password } = body

    console.log("Register attempt for email:", email)

    // Validate required fields
    if (!username || !name || !phone || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      console.log("User already exists with email or username")
      return NextResponse.json({ error: "User with this email or username already exists" }, { status: 400 })
    }

    console.log("Creating new user")

    // Create new user
    const user = await User.create({
      username,
      name,
      phone,
      email,
      password,
      role: "USER",
    })

    console.log("User created:", user._id)

    // Generate JWT token
    const token = await signJWT({
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
    })

    console.log("JWT token generated")

    // Set auth cookie
    await setAuthCookie(token)
    console.log("Auth cookie set")

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
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        error: "Failed to register user",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
