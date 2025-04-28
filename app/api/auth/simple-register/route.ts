import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/app/lib/db"
import mongoose from "mongoose"
import bcryptjs from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    console.log("Simple register API called")

    // Connect to database
    await connectDB()
    console.log("Connected to database")

    // Parse request body
    const body = await req.json()
    const { username, name, email, password } = body

    console.log("Registration attempt for:", { username, name, email })

    // Validate required fields
    if (!username || !name || !email || !password) {
      return NextResponse.json({ error: "Username, name, email, and password are required" }, { status: 400 })
    }

    // Get User model directly
    const User = mongoose.models.User

    if (!User) {
      throw new Error("User model not found")
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

    // Hash password manually
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    // Create new user
    const user = await User.create({
      username,
      name,
      phone: "1234567890", // Default phone
      email,
      password: hashedPassword,
      role: "USER",
    })

    console.log("User created:", user._id)

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Simple registration error:", error)
    return NextResponse.json(
      {
        error: "Failed to register user",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        mongooseState: {
          connectionState: mongoose.connection.readyState,
          models: Object.keys(mongoose.models),
        },
      },
      { status: 500 },
    )
  }
}
