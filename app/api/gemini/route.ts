import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API client
const API_KEY = process.env.GEMINI_API_KEY!
const genAI = new GoogleGenerativeAI(API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Get the model - Updated to use Gemini 2.0 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Prepare the prompt for Gemini
    const prompt = `Enhance, improve, or rewrite the following text to make it clearer, more engaging, and more professional:
    
    "${text}"
    
    Provide only the enhanced text without any additional explanations or comments.`

    // Call the Gemini API
    const result = await model.generateContent(prompt)
    const response = result.response.text()

    return NextResponse.json({ enhancedText: response.trim() })
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return NextResponse.json({ error: "Failed to enhance text with Gemini" }, { status: 500 })
  }
}
