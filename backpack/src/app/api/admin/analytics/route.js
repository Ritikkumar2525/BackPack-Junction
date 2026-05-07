import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllBookings, getBookingStats } from "@/lib/bookings";
import { getAllTrips } from "@/lib/trips";
import { getAllUsers } from "@/lib/users";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const bookings = getAllBookings();
  const trips = getAllTrips();
  const users = getAllUsers();
  const stats = getBookingStats();

  // Monthly revenue breakdown
  const monthlyRevenue = [
    { month: "Jan", revenue: 125000 },
    { month: "Feb", revenue: 189000 },
    { month: "Mar", revenue: 245000 },
    { month: "Apr", revenue: 312000 },
    { month: "May", revenue: 398000 },
    { month: "Jun", revenue: stats.totalRevenue + 420000 },
  ];

  // Trip popularity
  const tripPopularity = trips.map((t) => ({
    name: t.destination,
    bookings: t.booked,
    capacity: t.groupSize,
    occupancy: Math.round((t.booked / t.groupSize) * 100),
  }));

  return NextResponse.json({
    stats: {
      ...stats,
      totalTrips: trips.length,
      totalUsers: users.length,
      upcomingTrips: trips.filter((t) => t.status === "upcoming").length,
    },
    monthlyRevenue,
    tripPopularity,
    recentBookings: bookings.slice(-10).reverse(),
  });
}
