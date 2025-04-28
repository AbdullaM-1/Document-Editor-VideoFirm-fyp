import { NextResponse } from "next/server"
import connectDB from "@/app/lib/db"
import mongoose from "mongoose"
import bcryptjs from "bcryptjs"

export async function GET() {
  try {
    console.log("Debug registration API called")

    // Step 1: Test database connection
    console.log("Step 1: Testing database connection...")
    await connectDB()
    console.log("Database connection successful")

    // Step 2: Check if User model is registered
    console.log("Step 2: Checking User model...")
    const models = Object.keys(mongoose.models)
    console.log("Registered models:", models)

    // Step 3: Test bcryptjs
    console.log("Step 3: Testing bcryptjs...")
    const testPassword = "password123"
    const hashedPassword = await bcryptjs.hash(testPassword, 10)
    console.log("Password hashing successful")

    // Step 4: Test User schema directly
    console.log("Step 4: Testing User schema...")

    // Get User model directly
    const User = mongoose.models.User

    if (!User) {
      throw new Error("User model not found")
    }

    // Test creating a user without saving to DB
    const testUser = new User({
      username: "debuguser",
      name: "DEBUG USER",
      phone: "1234567890",
      email: "debug@example.com",
      password: "password123",
      role: "USER",
    })

    // Validate the user
    const validationError = testUser.validateSync()
    if (validationError) {
      throw new Error(`User validation failed: ${JSON.stringify(validationError.errors)}`)
    }

    console.log("User validation successful")

    return NextResponse.json({
      success: true,
      message: "Registration debug successful",
      steps: {
        dbConnection: true,
        models: models,
        bcryptjs: true,
        userValidation: true,
      },
    })
  } catch (error) {
    console.error("Registration debug error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Registration debug failed",
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
