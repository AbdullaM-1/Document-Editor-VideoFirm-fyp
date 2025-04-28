import mongoose, { Schema } from "mongoose"

// Define the schema directly
const documentSchema = new Schema(
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

// Create the model directly
const DocumentModel = mongoose.models.Document || mongoose.model("Document", documentSchema)

export default DocumentModel
