import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBookingsByUser, getAllBookings, createBooking, getBookingStats } from "@/lib/bookings";
import { getTrip } from "@/lib/trips";

export async function GET(request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const stats = searchParams.get("stats");

  // Admin gets all bookings
  if (session.user.role === "admin") {
    if (stats === "true") {
      return NextResponse.json({ stats: getBookingStats() });
    }
    return NextResponse.json({ bookings: getAllBookings() });
  }

  // User gets own bookings
  const bookings = getBookingsByUser(session.user.id);
  return NextResponse.json({ bookings });
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { tripId, travelers, specialRequests, emergencyContact, paymentMethod } = body;

  const trip = getTrip(tripId);
  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  const totalAmount = trip.price * (travelers || 1);

  const booking = createBooking({
    userId: session.user.id,
    tripId: trip.id,
    tripTitle: trip.title,
    destination: trip.destination,
    travelers: travelers || 1,
    totalAmount,
    paymentMethod: paymentMethod || "Online",
    specialRequests,
    emergencyContact,
    departureDate: trip.departureDate,
    returnDate: trip.returnDate,
  });

  return NextResponse.json({ booking, message: "Booking confirmed!" }, { status: 201 });
}
