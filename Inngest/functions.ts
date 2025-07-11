import { inngest } from "../inngest/client";
import { VertexAI } from '@google-cloud/vertexai';

const vertex_ai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT || 'fleet-space-463912-f9',// Shift to env 
  location: 'us-central1',
});

const generativeModel = vertex_ai.getGenerativeModel({
  model: 'gemini-2.5-pro',
});

const SYSTEM_PROMPT = `You are a helpful, professional AI Career Coach Agent. Your role is to guide users with questions related to careers, job searching, skill development, and professional growth. Provide clear, actionable, and empathetic advice tailored to each user's needs.`;

async function runGeminiChat(userInput: string) {
  try {
    const result = await generativeModel.generateContent({
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT + "\n\n" + userInput }] }
      ]
    });
    const candidates = result?.response?.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0]?.content?.parts;
      if (parts && parts.length > 0 && parts[0].text) {
        return parts[0].text;
      }
    }
    return "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error in runGeminiChat:", error);
    return "Sorry, there was an error generating a response.";
  }
}

export const AiCareerAgent = inngest.createFunction(
  { id: "AiCareerAgent" },
  { event: "AiCareerAgent" },
  async ({ event, step }) => {
    const { userInput } = await event?.data;
    console.log("Received user input:", userInput);
    const result = await runGeminiChat(userInput);
    console.log("Gemini response:", result);
    return result;
  }
);
