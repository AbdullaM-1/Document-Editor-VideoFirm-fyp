import { NextResponse } from "next/server"
import connectDB from "@/app/lib/db"
import bcryptjs from "bcryptjs"

export async function GET() {
  try {
    console.log("Create test user API called")

    // Connect to database
    await connectDB()
    console.log("Connected to database")

    // Import the User model directly
    const User = (await import("@/app/models/user-direct")).default
    console.log("User model imported:", !!User)

    // Check if test user exists
    const testUser = await User.findOne({ email: "test@example.com" })

    if (testUser) {
      console.log("Test user exists:", testUser._id)
      return NextResponse.json({
        success: true,
        exists: true,
        user: {
          id: testUser._id,
          email: testUser.email,
          username: testUser.username,
          password: "password123", // This is the password you should use to login
        },
      })
    }

    // Create test user
    console.log("Creating test user")

    // Hash password manually
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash("password123", salt)

    const newUser = await User.create({
      username: "testuser",
      name: "TEST USER",
      phone: "1234567890",
      email: "test@example.com",
      password: hashedPassword,
      role: "USER",
    })

    console.log("Test user created:", newUser._id)

    return NextResponse.json({
      success: true,
      exists: false,
      created: true,
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        password: "password123", // This is the password you should use to login
      },
    })
  } catch (error) {
    console.error("Create test user API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create test user",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
