import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/app/lib/db"
import { getCurrentUser } from "@/app/lib/auth"

export async function GET(req: NextRequest) {
  try {
    console.log("Me API called")

    const user = await getCurrentUser(req)

    if (!user) {
      console.log("No authenticated user found")
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    console.log("User authenticated:", user.id)

    await connectDB()
    console.log("Connected to database")

    // Import the User model directly
    const User = (await import("@/app/models/user-direct")).default
    console.log("User model imported:", !!User)

    // Get fresh user data from database
    const userData = await User.findById(user.id).select("-password")

    if (!userData || userData.isDeleted) {
      console.log("User not found in database:", user.id)
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    console.log("User data retrieved:", userData._id)

    return NextResponse.json({
      success: true,
      user: {
        id: userData._id,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        avatar: userData.avatar,
        role: userData.role,
      },
    })
  } catch (error) {
    console.error("Get current user error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get user data",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
