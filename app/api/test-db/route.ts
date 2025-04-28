import { NextResponse } from "next/server"
import connectDB from "@/app/lib/db"
import mongoose from "mongoose"

export async function GET() {
  try {
    await connectDB()

    // Check if we're connected
    const isConnected = mongoose.connection.readyState === 1

    return NextResponse.json({
      success: true,
      connected: isConnected,
      dbName: mongoose.connection.name,
      models: Object.keys(mongoose.models),
    })
  } catch (error) {
    console.error("Test DB error:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
