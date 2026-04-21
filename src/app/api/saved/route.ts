import { NextResponse } from "next/server";
import { getData } from "@/lib/data";

export function GET() {
  return NextResponse.json(getData.saved());
}

export async function POST(request: Request) {
  const body = await request.json() as { spaceId: number };
  const newRecord = { id: Date.now(), spaceId: body.spaceId };
  return NextResponse.json(newRecord, { status: 201 });
}
