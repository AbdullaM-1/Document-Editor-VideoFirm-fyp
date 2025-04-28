import { NextResponse } from "next/server"
import mongoose from "mongoose"
import connectDB from "@/app/lib/db"
import bcryptjs from "bcryptjs"

export async function GET() {
  try {
    console.log("Test user creation API called")

    // Connect to database
    await connectDB()
    console.log("Connected to database")

    // Log available models
    console.log("Available models:", Object.keys(mongoose.models))

    // Try to import the User model directly
    const UserModel = (await import("@/app/models/user-direct")).default
    console.log("User model imported:", !!UserModel)

    // Check if the model is registered
    console.log("User model registered:", !!mongoose.models.User)

    // Create a test user directly
    const hashedPassword = await bcryptjs.hash("password123", 10)

    const testUser = new UserModel({
      username: "testuser" + Date.now(),
      name: "TEST USER",
      phone: "1234567890",
      email: `test${Date.now()}@example.com`,
      password: hashedPassword,
      role: "USER",
    })

    // Save the user
    const savedUser = await testUser.save()
    console.log("Test user created:", savedUser._id)

    return NextResponse.json({
      success: true,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
      models: Object.keys(mongoose.models),
    })
  } catch (error) {
    console.error("Test user creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create test user",
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
