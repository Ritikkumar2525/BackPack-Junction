export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";
import Razorpay from "razorpay";

const BOOKING_CHARGE_PER_HEAD = 1500; // ₹1500 non-refundable per head

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const stats = searchParams.get("stats");

    if (session.user.role === "admin") {
      if (stats === "true") {
        const totalBookings = await Booking.countDocuments();
        const confirmedBookings = await Booking.countDocuments({ bookingStatus: 'Confirmed' });
        const pendingBookings = await Booking.countDocuments({ bookingStatus: 'Pending' });
        const cancelledBookings = await Booking.countDocuments({ bookingStatus: 'Cancelled' });
        const totalRevenueResult = await Booking.aggregate([
          { $match: { paymentStatus: { $in: ['Completed', 'Partial'] } } },
          { $group: { _id: null, total: { $sum: "$amountPaid" } } }
        ]);
        const totalRevenue = totalRevenueResult[0]?.total || 0;
        return NextResponse.json({ stats: { totalBookings, confirmedBookings, pendingBookings, cancelledBookings, totalRevenue } });
      }
      const bookings = await Booking.find()
        .populate('tripId', 'title destination duration price images totalSeats availableSeats itinerary inclusions exclusions pickupLocations routeLocations startDate endDate')
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 });
      return NextResponse.json({ bookings });
    }

    const bookings = await Booking.find({ userId: session.user.id })
      .populate('tripId', 'title destination duration price images image totalSeats availableSeats itinerary inclusions exclusions pickupLocations routeLocations startDate endDate')
      .sort({ createdAt: -1 });
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { tripId, travellers, paymentMethod, paymentMode, consentAccepted } = body;

    // Validate consent
    if (!consentAccepted) {
      return NextResponse.json({ error: "You must accept the terms and cancellation policy to proceed." }, { status: 400 });
    }

    // Validate travellers
    if (!travellers || travellers.length === 0) {
      return NextResponse.json({ error: "At least one traveller is required." }, { status: 400 });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Check seat availability
    if (trip.availableSeats < travellers.length) {
      return NextResponse.json({ error: `Only ${trip.availableSeats} seats available. You requested ${travellers.length}.` }, { status: 400 });
    }

    const totalAmount = trip.price * travellers.length;
    const bookingCharge = BOOKING_CHARGE_PER_HEAD * travellers.length;
    const bookingId = "BPJ" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);

    // Determine payment amount based on mode
    const isPayLater = paymentMode === 'Pay Later';
    const payableAmount = isPayLater ? bookingCharge : totalAmount;

    const booking = new Booking({
      bookingId,
      userId: session.user.id,
      tripId: trip._id,
      totalAmount,
      bookingCharge,
      amountPaid: 0,
      paymentStatus: 'Pending',
      bookingStatus: 'Pending',
      paymentMode: isPayLater ? 'Pay Later' : 'Full Payment',
      paymentMethod: 'Razorpay',
      travellers,
      consentAccepted: true,
      cancellationPolicy: {
        nonRefundablePerHead: BOOKING_CHARGE_PER_HEAD,
        acknowledged: true,
      },
    });

    // Razorpay payment only
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET_KEY) {
      return NextResponse.json({ error: "Razorpay credentials not configured." }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const order = await razorpay.orders.create({
      amount: payableAmount * 100, // paise
      currency: "INR",
      receipt: bookingId,
      notes: {
        bookingId,
        paymentMode: isPayLater ? 'booking_charge' : 'full_payment',
        travellers: travellers.length,
      }
    });

    booking.razorpayOrderId = order.id;
    booking.payments = [{
      method: 'Razorpay',
      amount: payableAmount,
      razorpayOrderId: order.id,
      status: 'Pending',
      note: isPayLater ? `Booking charge ₹${BOOKING_CHARGE_PER_HEAD}/head × ${travellers.length}` : 'Full payment',
    }];

    await booking.save();

    return NextResponse.json({
      booking: booking.toJSON(),
      orderId: order.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      payableAmount,
    }, { status: 201 });

  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: "Booking failed: " + error.message }, { status: 500 });
  }
}
