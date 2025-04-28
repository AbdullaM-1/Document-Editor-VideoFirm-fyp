import mongoose, { Schema, type Document as MongoDocument } from "mongoose"

export interface IDocument extends MongoDocument {
  title: string
  content: string
  owner: mongoose.Types.ObjectId
  lastEdited: Date
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

const documentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true, default: "Untitled Document" },
    content: { type: String, default: "" },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lastEdited: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

// Only create the model if it doesn't already exist (for Next.js hot reloading)
const Document = mongoose.models.Document || mongoose.model<IDocument>("Document", documentSchema)

export default Document
