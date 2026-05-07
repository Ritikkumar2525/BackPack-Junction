import { NextResponse } from "next/server";
import { getTrip } from "@/lib/trips";

export async function GET(request, { params }) {
  const { id } = await params;
  const trip = getTrip(id);

  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  return NextResponse.json({ trip });
}
