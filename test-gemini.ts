const { VertexAI } = require('@google-cloud/vertexai');

const vertex_ai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT || 'fleet-space-463912-f9',
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
    console.log("Vertex AI result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error in runGeminiChat:", error);
  }
}

runGeminiChat("How can I improve my coding skills?");