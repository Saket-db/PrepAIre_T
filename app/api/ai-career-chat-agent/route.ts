'use server';

import { inngest } from "@/inngest/client";
import axios from "axios";
import { NextResponse } from "next/server";

// POST handler for triggering AI workflow via Inngest
export async function POST(req: Request) {
  console.log("[API] POST /api/ai-career-chat-agent called");
  try {
    const { userInput } = await req.json();
    console.log("[API] Received user input:", userInput);

    // Validate input
    if (!userInput || typeof userInput !== "string") {
      console.log("[API] Invalid userInput:", userInput);
      return NextResponse.json(
        { error: "userInput is required and must be a string" },
        { status: 400 }
      );
    }

    // Send event to Inngest
    console.log("[API] Sending event to Inngest...");
    const eventResponse = await inngest.send({
      name: "AiCareerAgent",
      data: { userInput },
    });

    console.log("[API] Event Response:", JSON.stringify(eventResponse, null, 2));
    const eventId = eventResponse?.ids?.[0];
    console.log("[API] Extracted eventId:", eventId);

    if (!eventId) {
      console.log("[API] Failed to get event ID from Inngest:", eventResponse);
      return NextResponse.json(
        { error: "Failed to get event ID from Inngest" },
        { status: 500 }
      );
    }

    // Poll for runs using event ID
    let attempts = 0;
    const maxAttempts = 60; // 60 tries with 1s delay = max 60 seconds
    let runData: any = null;

    while (attempts < maxAttempts) {
      try {
        console.log(`[API] Polling attempt ${attempts + 1} for eventId: ${eventId}`);
        const runsResponse = await getRuns(eventId);
        console.log(`[API] Full runs response (attempt ${attempts + 1}):`, JSON.stringify(runsResponse, null, 2));

        const runsArray = runsResponse?.data;

        if (!Array.isArray(runsArray) || runsArray.length === 0) {
          console.log(`[API] Attempt ${attempts + 1}: No run found yet.`);
        } else {
          const latestRun = runsArray[0];
          const status = latestRun?.status;

          console.log(`[API] Attempt ${attempts + 1}: Run status = ${status}`);
          console.log(`[API] Attempt ${attempts + 1}: Run object:`, JSON.stringify(latestRun, null, 2));

          if (status === "Completed") {
            runData = latestRun;
            break;
          }

          if (status === "Failed") {
            console.log(`[API] Attempt ${attempts + 1}: Run failed. Details:`, JSON.stringify(latestRun, null, 2));
            return NextResponse.json(
              { error: "Job failed", details: latestRun },
              { status: 500 }
            );
          }
        }

        await new Promise((res) => setTimeout(res, 1000));
        attempts++;
      } catch (err) {
        console.error("[API] Polling error:", err);
        await new Promise((res) => setTimeout(res, 1000));
        attempts++;
      }
    }

    if (!runData) {
      console.log("[API] Job timed out after polling. eventId:", eventId);
      return NextResponse.json(
        { error: "Job timed out", eventId },
        { status: 408 }
      );
    }

    // Debug output structure
    console.log("[API] runData keys:", Object.keys(runData));
    console.log("[API] runData.output:", runData.output);

    // Try to parse output in different ways for debugging
    let output = undefined;
    if (runData.output) {
      if (typeof runData.output === "string") {
        console.log("[API] runData.output is a string. Attempting JSON.parse...");
        try {
          output = JSON.parse(runData.output);
          console.log("[API] Parsed output from string:", output);
        } catch (e) {
          console.log("[API] runData.output is a plain string, using as is.");
          output = { content: runData.output, role: "assistant", type: "text" };
        }
      } else if (typeof runData.output === "object") {
        // Try to extract output property if present
        if (runData.output.output) {
          if (Array.isArray(runData.output.output)) {
            output = runData.output.output[0];
            console.log("[API] Extracted output from runData.output.output[0]:", output);
          } else {
            output = runData.output.output;
            console.log("[API] Extracted output from runData.output.output:", output);
          }
        } else {
          output = runData.output;
          console.log("[API] Using runData.output as output:", output);
        }
      }
    }

    if (!output) {
      console.log("[API] Output is empty or undefined. runData:", JSON.stringify(runData, null, 2));
      return NextResponse.json(
        { error: "Output is empty or undefined", eventId, runData },
        { status: 500 }
      );
    }

    console.log("[API] Final output to return:", output);
    return NextResponse.json(output);
  } catch (error: any) {
    console.error("[API] API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error?.message || "Unknown error",
        stack: error?.stack,
      },
      { status: 500 }
    );
  }
}

// Polls the Inngest run by event ID
async function getRuns(eventId: string) {
  console.log("[API] getRuns called with eventId:", eventId);
  if (!process.env.INNGEST_SERVER_HOST || !process.env.INNGEST_SIGNING_KEY) {
    console.error("[API] Missing Inngest server host or signing key");
    throw new Error("Missing Inngest server host or signing key");
  }

  const url = `${process.env.INNGEST_SERVER_HOST}/v1/events/${eventId}/runs`;
  console.log("[API] getRuns URL:", url);

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
      timeout: 10000,
    });
    console.log("[API] getRuns axios response status:", response.status);
    return response.data;
  } catch (error: any) {
    console.error("[API] Error fetching run status:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("[API] Inngest API returned error response:", error.response.status, error.response.data);
        throw new Error(
          `Inngest API returned ${error.response.status}: ${JSON.stringify(
            error.response.data
          )}`
        );
      } else if (error.request) {
        console.error("[API] No response from Inngest API");
        throw new Error("No response from Inngest API");
      }
    }

    throw error;
  }
}