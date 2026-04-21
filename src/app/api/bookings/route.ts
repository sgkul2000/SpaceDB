import { NextResponse } from "next/server";
import { getData } from "@/lib/data";

export function GET() {
  return NextResponse.json(getData.bookings());
}
