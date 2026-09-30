const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.AI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

exports.parsePrescriptionImage = async (base64Image, mimeType) => {
  if (!apiKey) {
    throw new Error('AI Provider API key is missing.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      }
    ]);

    const response = await result.response;
    let text = response.text().trim();
    
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json/i, '').replace(/\`\`\`$/i, '').trim();
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`/i, '').replace(/\`\`\`$/i, '').trim();
    }

    const parsedJson = JSON.parse(text);
    return parsedJson;
  } catch (error) {
    console.error('Error parsing prescription with Gemini:', error);
    throw new Error('Failed to extract data from prescription');
  }
};
