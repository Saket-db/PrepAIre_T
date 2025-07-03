'use server';

import { inngest } from "@/inngest/client";
import axios from "axios";
import { NextResponse } from "next/server";

// POST handler for triggering AI workflow via Inngest
export async function POST(req: Request) {
    try {
        const { userInput } = await req.json();

        // Validate input
        if (!userInput || typeof userInput !== "string") {
            return NextResponse.json(
                { error: "userInput is required and must be a string" },
                { status: 400 }
            );
        }

        // Send event to Inngest
        const result = await inngest.send({
            name: "AiCareerAgent",
            data: { userInput }
        });

        const runId = result?.ids?.[0];

        if (!runId) {
            return NextResponse.json(
                { error: "Failed to get run ID from Inngest" },
                { status: 500 }
            );
        }

        // Poll for run completion
        let attempts = 0;
        const maxAttempts = 60; // 60 seconds
        let runData: any = null;

        const controller = new AbortController();
setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

const response = await fetch("http://localhost:3000/api/ai-career-chat-agent", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ userInput }),
  signal: controller.signal,
});


        while (attempts < maxAttempts) {
            try {
                const runResponse = await getRuns(runId);
                runData = runResponse;


                if (!runData) {
                    throw new Error("Invalid run data received");
                }

                const status = runData.status;

                if (status === "Completed") {
                    break;
                }

                if (status === "Failed") {
                    return NextResponse.json(
                        { error: "Job failed", details: runData },
                        { status: 500 }
                    );
                }

                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
            } catch (err) {
                console.error("Polling error:", err);
                if (attempts >= maxAttempts - 1) {
                    throw err;
                }
                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
            }
        }

        if (attempts >= maxAttempts) {
            return NextResponse.json(
                { error: "Job timed out", runId },
                { status: 408 }
            );
        }

        const output = runData.output?.output?.[0];

        if (!output) {
            return NextResponse.json(
                { error: "Output is empty or undefined", runId },
                { status: 500 }
            );
        }

        return NextResponse.json(output);

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error?.message || "Unknown error"
            },
            { status: 500 }
        );
    }
}

// Polls the Inngest run by run ID
async function getRuns(runId: string) {
    if (!process.env.INNGEST_SERVER_HOST || !process.env.INNGEST_SIGNING_KEY) {
        throw new Error("Missing Inngest server host or signing key");
    }

    const url = `${process.env.INNGEST_SERVER_HOST}/v1/runs/${runId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`
            },
            timeout: 10000
        });

        return response.data;
    } catch (error: any) {
        console.error("Error fetching run status:", error);

        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(`Inngest API returned ${error.response.status}: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                throw new Error("No response from Inngest API");
            }
        }

        throw error;
    }
}
