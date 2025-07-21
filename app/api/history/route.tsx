import { db } from "@/configs/db";
import { userHistoryTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import {  eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//     const user = await currentUser();

//     if (!user || !user.primaryEmailAddress?.emailAddress) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { searchParams } = new URL(req.url);
//     const eventID = searchParams.get('eventID');

//     if (!eventID) {
//         return NextResponse.json({ error: "eventID is required" }, { status: 400 });
//     }

//     try {
//         const history = await db.select()
//             .from(userHistoryTable)
//             .where(
//                 and(
//                     eq(userHistoryTable.eventid, eventID),
//                     eq(userHistoryTable.userEmail, user.primaryEmailAddress.emailAddress)
//                 )
//             )
//             .limit(1); // Ensure we only get one record

//         if (history.length === 0) {
//             return NextResponse.json({ error: "Chat not found" }, { status: 404 });
//         }

//         return NextResponse.json(history[0]);

//     } catch (e: any) {
//         return NextResponse.json(
//             { error: e.message || "Something went wrong" },
//             { status: 500 }
//         );
//     }
// }


export async function POST(req: Request) {
  try {
    const { content, eventID } = await req.json();
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "Unauthorized or missing email address" },
        { status: 401 }
      );
    }

    const result = await db.insert(userHistoryTable).values({
      eventid: eventID,
      content,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: (new Date()).toString(),
    });

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
export async function PUT(req: any) {
  // const {content, eventID} = await req.json();
  try {
    const { content, eventID } = await req.json();
    
    // DEBUG: Log incoming request data
    console.log("PUT /api/history - Request received:", { content, eventID });
    console.log("PUT /api/history - Content type:", typeof content);
    console.log("PUT /api/history - EventID type:", typeof eventID);
    
    const user = await currentUser();
    
    // DEBUG: Log user info
    console.log("PUT /api/history - User:", user ? "authenticated" : "not authenticated");
    console.log("PUT /api/history - User email:", user?.primaryEmailAddress?.emailAddress);

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      console.log("PUT /api/history - ERROR: Unauthorized or missing email address");
      return NextResponse.json(
        { error: "Unauthorized or missing email address" },
        { status: 401 }
      );
    }

    // DEBUG: Log before database operation
    console.log("PUT /api/history - About to execute database update");
    console.log("PUT /api/history - Update parameters:", { content, eventID });

    // FIX: Use the lowercase 'eventid' property from the corrected schema
    const result = await db.update(userHistoryTable).set({
        content: content,
    }).where(eq(userHistoryTable.eventid, eventID));

    // DEBUG: Log database result
    console.log("PUT /api/history - Database update result:", result);
    console.log("PUT /api/history - Result type:", typeof result);
    console.log("PUT /api/history - Result keys:", Object.keys(result));

    return NextResponse.json(result);
  } catch (e: any) {
    // DEBUG: Enhanced error logging
   console.error("PUT /api/history - ERROR occurred:");
    console.error("PUT /api/history - Error message:", e.message);
    console.error("PUT /api/history - Error name:", e.name);
    console.error("PUT /api/history - Error stack:", e.stack);
    console.error("PUT /api/history - Full error object:", e);
    
    return NextResponse.json(
      { error: e.message || "Something went wrong" },
      { status: 500 }
    );
  }
}