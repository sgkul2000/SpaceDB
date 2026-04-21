import { NextResponse } from "next/server";
import { getData } from "@/lib/data";
import type { Booking } from "@/types/booking";

export function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return request.json().then(async (body: Partial<Booking>) => {
    const { id } = await params;
    const booking = getData.bookings().find(b => b.id === Number(id));
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...booking, ...body });
  });
}
