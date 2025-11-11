
import { GoogleGenAI } from "@google/genai";
import { DocumentFile } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Please set it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const processAgentPrompt = async (prompt: string, documentContent: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  
  const fullPrompt = `
    DOCUMENT CONTENT:
    ---
    ${documentContent}
    ---

    TASK:
    ${prompt}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error processing agent prompt:", error);
    throw new Error("Failed to get response from Gemini API.");
  }
};

export const performOcr = async (imageDataBase64: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: imageDataBase64,
    },
  };
  const textPart = {
    text: "Perform OCR on this image. Extract all text accurately, preserving the original line breaks and structure as much as possible. Do not describe the image, only return the transcribed text."
  };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    return response.text;
  } catch (error) {
    console.error("Error performing OCR:", error);
    throw new Error("Failed to perform OCR with Gemini API.");
  }
};
