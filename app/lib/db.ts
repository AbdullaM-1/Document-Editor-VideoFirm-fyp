const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not defined")
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

// Update the connectDB function to add more detailed error logging
async function connectDB() {
  if (cached.conn) {
    console.log("Using existing MongoDB connection")
    return cached.conn
  }

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable")
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    }

    console.log("Connecting to MongoDB...", MONGODB_URI.substring(0, MONGODB_URI.indexOf("@") + 1) + "***")

    cached.promise = import("mongoose")
      .then((mongooseImport) => {
        return mongooseImport.default.connect(MONGODB_URI, opts).then((mongooseConnect) => {
          console.log("Connected to MongoDB successfully")

          // Import models to ensure they're registered
          import("../models/index")
            .then(() => console.log("Models registered successfully"))
            .catch((err) => console.error("Error registering models:", err))

          return mongooseConnect
        })
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err)
        cached.promise = null
        throw err
      })
  } else {
    console.log("Using existing MongoDB connection promise")
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error("Failed to resolve MongoDB connection promise:", e)
    throw e
  }

  return cached.conn
}

export default connectDB
