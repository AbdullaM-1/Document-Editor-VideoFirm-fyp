import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/app/lib/db"
import { withAuth } from "@/app/lib/auth"

// Get all documents for the current user
export const GET = withAuth(async (req: NextRequest, user: any) => {
  try {
    await connectDB()
    console.log("Connected to database for documents fetch")

    // Import the Document model directly
    const Document = (await import("@/app/models/document-direct")).default
    console.log("Document model imported:", !!Document)

    const documents = await Document.find({
      owner: user.id,
      isDeleted: false,
    }).sort({ lastEdited: -1 })

    console.log(`Found ${documents.length} documents for user ${user.id}`)

    return NextResponse.json({
      success: true,
      documents: documents.map((doc) => ({
        id: doc._id,
        title: doc.title,
        lastEdited: doc.lastEdited,
        createdAt: doc.createdAt,
      })),
    })
  } catch (error) {
    console.error("Get documents error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch documents",
        details: String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
})

// Create a new document
export const POST = withAuth(async (req: NextRequest, user: any) => {
  try {
    console.log("Creating document for user:", user.id)
    await connectDB()
    console.log("Connected to database for document creation")

    // Import the Document model directly
    const Document = (await import("@/app/models/document-direct")).default
    console.log("Document model imported:", !!Document)

    const body = await req.json()
    const { title = "Untitled Document", content = "" } = body

    console.log("Document data:", { title, contentLength: content.length })

    const document = await Document.create({
      title,
      content,
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
    console.error("Create document error:", error)
    return NextResponse.json(
      {
        error: "Failed to create document",
        details: String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
})
