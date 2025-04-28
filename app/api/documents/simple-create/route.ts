import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/app/lib/db"
import { getCurrentUser } from "@/app/lib/auth"

export async function POST(req: NextRequest) {
  try {
    console.log("Simple document creation started")

    // Get the current user
    const user = await getCurrentUser(req)

    if (!user) {
      console.log("No authenticated user found")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    console.log("User authenticated:", user.id)

    // Connect to the database
    await connectDB()
    console.log("Connected to database")

    // Import the Document model directly
    const Document = (await import("@/app/models/document-direct")).default
    console.log("Document model imported:", !!Document)

    // Create a simple document
    const document = await Document.create({
      title: "Test Document",
      content: "This is a test document",
      owner: user.id,
      lastEdited: new Date(),
    })

    console.log("Document created:", document._id)

    return NextResponse.json({
      success: true,
      document: {
        id: document._id,
        title: document.title,
        content: document.content,
        lastEdited: document.lastEdited,
      },
    })
  } catch (error) {
    console.error("Simple document creation error:", error)
    return NextResponse.json(
      {
        error: "Failed to create document",
        details: String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
