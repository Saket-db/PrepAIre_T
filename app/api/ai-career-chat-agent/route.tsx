import { inngest } from "@/Inngest/client";
import axios from "axios";
// import { headers } from "next/headers";
import { NextResponse } from "next/server";
// import { run } from "node:test";

export async function POST(req:any) {
    const { userInput } = await req.json();
    const resultIds = await inngest.send({
        name: "AiCareerAgent",
        data: {
            userInput: userInput
        }
    });
    const runId = resultIds.ids[0];

    let runStatus;
    while (true) {
        runStatus=await getRuns(runId);
        if(runStatus?.data[0].status==='Completed') {
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for 500 milliseconds before checking again
    }
    return NextResponse.json(runStatus)
}

async function getRuns(runId: string) {
    const result = await axios.get(process.env.INNGEST_SERVER_HOST+'/v1/events/' + runId + '/runs', {
        headers: {
            Authorization: `Bearer ${process.env.INNGEST_API_KEY}`
        }
    })
    return result.data;
}

