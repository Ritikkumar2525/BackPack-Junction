import { NextResponse } from "next/server";
import { getAllTrips, getUpcomingTrips } from "@/lib/trips";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter");

  let trips = filter === "upcoming" ? getUpcomingTrips() : getAllTrips();

  return NextResponse.json({ trips });
}
