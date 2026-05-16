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
      { $match: { paymentStatus: { $in: ["Completed", "Partial"] } } },
      { $group: { _id: null, total: { $sum: "$amountPaid" } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Pending payments — calculate actual outstanding balance (totalAmount - amountPaid)
    const pendingPaymentsResult = await Booking.aggregate([
      { $match: { 
        paymentStatus: { $in: ["Pending", "Partial"] },
        bookingStatus: { $nin: ["Cancelled"] }
      }},
      { $group: { 
        _id: null, 
        totalDue: { $sum: { $subtract: ["$totalAmount", { $ifNull: ["$amountPaid", 0] }] } },
        count: { $sum: 1 }
      }}
    ]);
    const pendingPayments = pendingPaymentsResult[0]?.totalDue || 0;
    const pendingPaymentsCount = pendingPaymentsResult[0]?.count || 0;

    // Detailed pending bookings for admin panel
    const pendingBookingsList = await Booking.find({
      paymentStatus: { $in: ["Pending", "Partial"] },
      bookingStatus: { $nin: ["Cancelled"] }
    }).populate('tripId', 'title').populate('userId', 'name email').sort({ createdAt: -1 }).limit(20);
    const pendingBookingsFormatted = pendingBookingsList.map(b => ({
      id: b.bookingId,
      tripTitle: b.tripId?.title || 'Unknown',
      userName: b.userId?.name || b.travellers?.[0]?.name || 'Unknown',
      userEmail: b.userId?.email || '',
      totalAmount: b.totalAmount,
      amountPaid: b.amountPaid || 0,
      balanceDue: b.totalAmount - (b.amountPaid || 0),
      paymentStatus: b.paymentStatus,
      bookingDate: b.createdAt,
      paymentMode: b.paymentMode || 'N/A',
    }));

    // Monthly revenue breakdown (last 6 months) — uses amountPaid for actual collected revenue
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyRevenueRaw = await Booking.aggregate([
      { $match: { 
        createdAt: { $gte: sixMonthsAgo },
        paymentStatus: { $in: ["Completed", "Partial"] }
      }},
      { 
        $group: { 
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, 
          revenue: { $sum: "$amountPaid" },
          totalBooked: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        } 
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Generate 6-month timeline ensuring no gaps
    const monthlyRevenue = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const found = monthlyRevenueRaw.find(r => r._id.month === m && r._id.year === y);
      monthlyRevenue.push({
        month: monthNames[m - 1],
        year: y,
        revenue: found?.revenue || 0,
        totalBooked: found?.totalBooked || 0,
        bookings: found?.count || 0,
      });
    }

    // Real trend calculations (this month vs last month)
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthBookings = await Booking.countDocuments({ createdAt: { $gte: thisMonthStart } });
    const lastMonthBookings = await Booking.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } });

    const thisMonthRevenueResult = await Booking.aggregate([
      { $match: { createdAt: { $gte: thisMonthStart }, paymentStatus: { $in: ["Completed", "Partial"] } } },
      { $group: { _id: null, total: { $sum: "$amountPaid" } } }
    ]);
    const lastMonthRevenueResult = await Booking.aggregate([
      { $match: { createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }, paymentStatus: { $in: ["Completed", "Partial"] } } },
      { $group: { _id: null, total: { $sum: "$amountPaid" } } }
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

    // Trip popularity — compute real occupancy from confirmed bookings
    const trips = await Trip.find({ isPublished: true }).lean();
    const tripIds = trips.map(t => t._id);
    const tripSeatCounts = await Booking.aggregate([
      { $match: { 
        tripId: { $in: tripIds }, 
        bookingStatus: { $in: ["Confirmed"] },
        seatsReserved: true
      }},
      { $group: { 
        _id: "$tripId", 
        bookedSeats: { $sum: { $size: "$travellers" } }
      }}
    ]);
    const tripSeatMap = {};
    tripSeatCounts.forEach(s => { tripSeatMap[s._id.toString()] = s.bookedSeats; });

    const tripPopularity = trips.map(t => {
      const booked = tripSeatMap[t._id.toString()] || 0;
      const capacity = t.totalSeats || 20;
      return {
        name: t.title,
        bookings: booked,
        capacity,
        occupancy: Math.round((booked / capacity) * 100),
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
        pendingPaymentsCount,
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
      pendingBookings: pendingBookingsFormatted,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
