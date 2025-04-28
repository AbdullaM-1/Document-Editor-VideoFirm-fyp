"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API client
const API_KEY = process.env.GEMINI_API_KEY!
const genAI = new GoogleGenerativeAI(API_KEY)

type TransformationType = "enhance" | "expand" | "simplify" | "summarize" | "rewrite" | "command"

export async function transformTextWithGemini(text: string, type: TransformationType): Promise<string> {
  try {
    if (!text || text.trim() === "") {
      console.error("Empty text provided to transformTextWithGemini")
      throw new Error("No text provided for transformation")
    }

    console.log(`Starting ${type} transformation for text: ${text.substring(0, 50)}...`)

    // Get the model - Updated to use Gemini 2.0 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Create prompt based on transformation type
    let prompt = ""

    switch (type) {
      case "enhance":
        prompt = `Enhance the following text to make it clearer, more engaging, and more professional:
        
        "${text}"
        
        Provide only the enhanced text without any additional explanations.`
        break

      case "expand":
        prompt = `Expand the following text with more details, examples, and explanations:
        
        "${text}"
        
        Provide only the expanded text without any additional comments.`
        break

      case "simplify":
        prompt = `Simplify the following text to make it easier to understand, using simpler words and shorter sentences:
        
        "${text}"
        
        Provide only the simplified text without any additional explanations.`
        break

      case "summarize":
        prompt = `Summarize the following text into a concise version that captures the main points:
        
        "${text}"
        
        Provide only the summary without any additional explanations.`
        break

      case "rewrite":
        prompt = `Rewrite the following text in a different style while preserving the core meaning:
        
        "${text}"
        
        Provide only the rewritten text without any additional explanations.`
        break

      case "command":
        // For command, we treat the text as a direct instruction to Gemini
        prompt = `${text}
        
        Respond directly without prefacing with explanations or conclusions.`
        break

      default:
        prompt = `Improve the following text:
        
        "${text}"
        
        Provide only the improved text without any additional explanations.`
    }

    console.log(`Sending prompt to Gemini API for ${type}:`, prompt.substring(0, 100) + "...")

    // Call the Gemini API
    const result = await model.generateContent(prompt)
    const response = result.response.text()

    console.log(`Received response from Gemini API for ${type}:`, response.substring(0, 100) + "...")

    return response.trim()
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    throw new Error(`Failed to ${type} text with Gemini: ${error instanceof Error ? error.message : String(error)}`)
  }
}
