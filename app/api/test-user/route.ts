import { NextResponse } from "next/server"
import connectDB from "@/app/lib/db"
import User from "@/app/models/user"

export async function GET() {
  try {
    console.log("Test user API called")

    // Connect to database
    await connectDB()
    console.log("Connected to database")

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
        },
      })
    }

    // Create test user
    console.log("Creating test user")
    const newUser = await User.create({
      username: "testuser",
      name: "TEST USER",
      phone: "1234567890",
      email: "test@example.com",
      password: "password123",
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
      },
    })
  } catch (error) {
    console.error("Test user API error:", error)
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
