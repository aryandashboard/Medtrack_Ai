'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'

// Allow using AI_API_KEY or GEMINI_API_KEY
const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

export async function parsePrescriptionImage(base64Image: string, mimeType: string) {
  if (!apiKey) {
    throw new Error('AI Provider API key is missing. Please add it to your .env.local file.')
  }

  try {
    // For vision tasks, we use gemini-1.5-flash which is fast and supports multimodal inputs.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      You are a medical data extraction assistant. I am providing an image of a medical prescription.
      Extract all the medications listed in the prescription. 
      Return the data strictly as a JSON object with the following format:
      {
        "medications": [
          {
            "name": "Medicine Name",
            "strength": "e.g., 500mg (if available, otherwise empty string)",
            "dosage": "e.g., 1 tablet (if available, otherwise empty string)",
            "frequency": "e.g., 3 times daily (if available, otherwise empty string)",
            "duration": "e.g., 5 days (if available, otherwise empty string)",
            "instructions": "e.g., after food (if available, otherwise empty string)"
          }
        ]
      }
      Do not include any markdown formatting like \`\`\`json or \`\`\`. Output ONLY the raw JSON object.
    `

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      }
    ])

    const response = await result.response
    let text = response.text().trim()
    
    // Clean up potential markdown blocks if the model ignores the instruction
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json/i, '').replace(/\`\`\`$/i, '').trim()
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`/i, '').replace(/\`\`\`$/i, '').trim()
    }

    const parsedJson = JSON.parse(text)
    return { success: true, data: parsedJson }
  } catch (error: unknown) {
    console.error('Error parsing prescription with Gemini:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to parse prescription' }
  }
}
