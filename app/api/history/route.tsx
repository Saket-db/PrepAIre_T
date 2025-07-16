import { db } from "@/configs/db";
import { userHistoryTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, recordId } = await req.json();
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "Unauthorized or missing email address" },
        { status: 401 }
      );
    }

    const result = await db.insert(userHistoryTable).values({
      recordId,
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
  // const {content, recordId} = await req.json();
  try {
    const { content, recordId } = await req.json();
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "Unauthorized or missing email address" },
        { status: 401 }
      );
    }

    const result = await db.update(userHistoryTable).set({
      content: content,

    }).where(eq(userHistoryTable.recordId, recordId));

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Something went wrong" },
      { status: 500 }
    );
  }

}