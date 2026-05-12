import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.email !== "junctionbackpack@gmail.com")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();
    const activeTripsCount = await Trip.countDocuments({ isPublished: true });

    // Revenue calculations
    const totalRevenueResult = await Booking.aggregate([
      { $match: { paymentStatus: "Completed" } },
      { $group: { _id: null, total: { $sum: "$amountPaid" } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Pending payments
    const pendingPaymentsResult = await Booking.aggregate([
      { $match: { paymentStatus: { $ne: "Completed" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const pendingPayments = pendingPaymentsResult[0]?.total || 0;

    // Monthly revenue breakdown (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenueRaw = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { 
        $group: { 
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, 
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        } 
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRevenue = monthlyRevenueRaw.map(m => ({
      month: `${monthNames[m._id.month - 1]}`,
      revenue: m.revenue,
      bookings: m.count
    }));

    if (monthlyRevenue.length === 0) {
      monthlyRevenue.push({ month: monthNames[new Date().getMonth()], revenue: 0, bookings: 0 });
    }

    // Real trend calculations (this month vs last month)
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthBookings = await Booking.countDocuments({ createdAt: { $gte: thisMonthStart } });
    const lastMonthBookings = await Booking.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } });

    const thisMonthRevenueResult = await Booking.aggregate([
      { $match: { createdAt: { $gte: thisMonthStart } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const lastMonthRevenueResult = await Booking.aggregate([
      { $match: { createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    
    const thisMonthRevenue = thisMonthRevenueResult[0]?.total || 0;
    const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;

    const revenueChange = lastMonthRevenue > 0 
      ? `${((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(0)}%` 
      : thisMonthRevenue > 0 ? "+100%" : "0%";

    const bookingChange = lastMonthBookings > 0 
      ? `${((thisMonthBookings - lastMonthBookings) / lastMonthBookings * 100).toFixed(0)}%`
      : thisMonthBookings > 0 ? `+${thisMonthBookings}` : "0";

    // New users this month
    const thisMonthUsers = await User.countDocuments({ createdAt: { $gte: thisMonthStart } });
    const lastMonthUsers = await User.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } });
    const userChange = lastMonthUsers > 0
      ? `${((thisMonthUsers - lastMonthUsers) / lastMonthUsers * 100).toFixed(0)}%`
      : thisMonthUsers > 0 ? `+${thisMonthUsers}` : "0";

    // Trip popularity
    const trips = await Trip.find({ isPublished: true });
    const tripPopularity = trips.map(t => {
      const booked = t.totalSeats - t.availableSeats;
      return {
        name: t.title,
        bookings: booked,
        capacity: t.totalSeats,
        occupancy: Math.round((booked / (t.totalSeats || 1)) * 100),
      };
    }).sort((a, b) => b.occupancy - a.occupancy).slice(0, 5);

    // Recent Bookings
    const recentBookings = await Booking.find()
      .populate('tripId', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    const formattedRecentBookings = recentBookings.map(b => ({
      id: b.bookingId,
      tripTitle: b.tripId?.title || 'Unknown',
      bookingDate: b.createdAt,
      totalAmount: b.totalAmount,
      status: b.bookingStatus,
      paymentStatus: b.paymentStatus
    }));

    // Booking status breakdown
    const confirmed = await Booking.countDocuments({ bookingStatus: "Confirmed" });
    const pending = await Booking.countDocuments({ bookingStatus: "Pending" });
    const cancelled = await Booking.countDocuments({ bookingStatus: "Cancelled" });

    return NextResponse.json({
      stats: {
        totalRevenue,
        pendingPayments,
        total: totalBookings,
        totalTrips: trips.length,
        totalUsers,
        upcomingTrips: activeTripsCount,
        revenueChange,
        bookingChange,
        userChange,
        confirmed,
        pending,
        cancelled,
      },
      monthlyRevenue,
      tripPopularity,
      recentBookings: formattedRecentBookings,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
