import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/app/lib/db"
import { withAuth } from "@/app/lib/auth"
import mongoose from "mongoose"

// Get a specific document
export const GET = withAuth(async (req: NextRequest, user: any) => {
  try {
    const id = req.url.split("/").pop()

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 })
    }

    await connectDB()
    console.log("Connected to database for document fetch")

    // Import the Document model directly
    const Document = (await import("@/app/models/document-direct")).default
    console.log("Document model imported:", !!Document)

    const document = await Document.findOne({
      _id: id,
      owner: user.id,
      isDeleted: false,
    })

    if (!document) {
      return NextResponse.json(
        { error: "Document not found or you don't have permission to access it" },
        { status: 404 },
      )
    }

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
    console.error("Get document error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch document",
        details: String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
})

// Update a document
export const PUT = withAuth(async (req: NextRequest, user: any) => {
  try {
    const id = req.url.split("/").pop()

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 })
    }

    const { title, content } = await req.json()
    const updateData: any = { lastEdited: new Date() }

    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content

    await connectDB()
    console.log("Connected to database for document update")

    // Import the Document model directly
    const Document = (await import("@/app/models/document-direct")).default
    console.log("Document model imported:", !!Document)

    const document = await Document.findOneAndUpdate(
      {
        _id: id,
        owner: user.id,
        isDeleted: false,
      },
      updateData,
      { new: true },
    )

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

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
    console.error("Update document error:", error)
    return NextResponse.json(
      {
        error: "Failed to update document",
        details: String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
})

// Delete a document (soft delete)
export const DELETE = withAuth(async (req: NextRequest, user: any) => {
  try {
    const id = req.url.split("/").pop()

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 })
    }

    await connectDB()
    console.log("Connected to database for document deletion")

    // Import the Document model directly
    const Document = (await import("@/app/models/document-direct")).default
    console.log("Document model imported:", !!Document)

    const document = await Document.findOneAndUpdate(
      {
        _id: id,
        owner: user.id,
      },
      { isDeleted: true },
      { new: true },
    )

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    })
  } catch (error) {
    console.error("Delete document error:", error)
    return NextResponse.json(
      {
        error: "Failed to delete document",
        details: String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
})
