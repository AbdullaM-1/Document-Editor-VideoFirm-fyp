import mongoose, { Schema, type Document as MongoDocument } from "mongoose"
import bcryptjs from "bcryptjs"

export interface IUser extends MongoDocument {
  avatar: string
  username: string
  name: string
  phone: string
  email: string
  address: string | null
  role: "USER" | "ADMIN"
  commission: number
  password: string
  isDeleted: boolean
  comparePassword(enteredPassword: string): Promise<boolean>
}

// Define the schema
const userSchema = new Schema<IUser>(
  {
    avatar: { type: String, default: "" },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: { type: String, required: true, trim: true, uppercase: true },
    phone: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: { type: String, trim: true, default: null },
    role: {
      type: String,
      required: true,
      default: "USER",
      enum: ["USER", "ADMIN"],
    },
    commission: { type: Number, default: 0 },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

// Method to compare entered password with stored hashed password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  try {
    return await bcryptjs.compare(enteredPassword, this.password)
  } catch (error) {
    console.error("Password comparison error:", error)
    return false
  }
}

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next()
    }

    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    next()
  } catch (error) {
    console.error("Password hashing error:", error)
    next(error as Error)
  }
})

// Create and export the User model
// Use a different approach to handle model registration
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema)

export default User
