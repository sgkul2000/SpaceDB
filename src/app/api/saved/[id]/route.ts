import { NextResponse } from "next/server";

export function DELETE() {
  return new NextResponse(null, { status: 200 });
}
