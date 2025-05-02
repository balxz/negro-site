// src/hitam.js
const { GoogleGenAI } = require("@google/genai")
const mime = require("mime")
const path = require("path")
const axios = require("axios")
const fs = require("fs")
const { uploadToGitHub } = require("../github")

function generateOutputFileName(url, ext) {
  return `${Date.now()}.${ext}`
}

async function ireng(url) {
  console.log("STEP 1: Download image:", url)
  const ai = new GoogleGenAI({ apiKey: "AIzaSyAlRj_ZNyTs0DkTZfydXUD4mQIgR-jvoCk" })

  const res = await axios.get(url, { responseType: "arraybuffer" })
  const buffer = Buffer.from(res.data, "binary")
  const mimeType = mime.getType(url)
  const base64 = buffer.toString("base64")

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: "Change their skin color to black, focusing only on their skin and not affecting their clothes, hair, or any other non-skin elements.",
        },
        {
          inlineData: {
            data: base64,
            mimeType: mimeType,
          },
        },
      ],
    },
  ]

  console.log("STEP 2: Requesting Gemini image generation...")
  const result = await ai.models.generateContentStream({
    model: "gemini-2.0-flash-exp-image-generation",
    config: {
      responseModalities: ["image", "text"],
      responseMimeType: "text/plain",
    },
    contents,
  })

  for await (const chunk of result) {
    const parts = chunk?.candidates?.[0]?.content?.parts
    if (!parts || !parts[0].inlineData) continue

    const inlineData = parts[0].inlineData
    const resultBuffer = Buffer.from(inlineData.data || "", "base64")
    const ext = mime.getExtension(inlineData.mimeType || "image/jpeg")
    const fileName = generateOutputFileName(url, ext)
    const filePath = path.join("public", fileName)

    console.log("STEP 3: Saving image to", filePath)
    fs.writeFileSync(filePath, resultBuffer)

    console.log("STEP 4: Uploading to GitHub...")
    await uploadToGitHub(filePath)
    console.log("STEP 5: Done. Returning path.")
    return `/${filePath}`
  }

  throw new Error("Image generation failed: No image returned from Gemini.")
}

module.exports = { ireng }
