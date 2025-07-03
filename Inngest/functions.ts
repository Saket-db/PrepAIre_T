import { inngest } from "../inngest/client";
import { createAgent, gemini } from "@inngest/agent-kit";
import { VertexAI } from '@google-cloud/vertexai';


const vertex_ai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT || 'your-project-id', // Add this to your .env
  location: 'us-central1', // or your preferred location
  // GOOGLE_APPLICATION_CREDENTIALS will be used automatically
});

export const AiCareerChat = createAgent({
  name: "AiCareerChat",
  description: "An AI assistant to help you with your career questions.",
  system: `You are a helpful, professional AI Career Coach Agent. Your role is to guide users with questions related to careers...`,
  model: gemini({
    model: "gemini-1.5-pro-latest"
  })
});

export const AiCareerAgent = inngest.createFunction(
  { id: "AiCareerAgent" },
  { event: "AiCareerAgent" },
  async ({ event, step }) => {
    const { userInput } = event.data;
    const result = await AiCareerChat.run(userInput);
    console.log("Gemini response:", result);
    return result;
  }
);
