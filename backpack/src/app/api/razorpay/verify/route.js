import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";
import { generateInvoicePDF } from "@/lib/pdfGenerator";
import { sendBookingEmail, sendWhatsAppConfirmation, sendAdminNotification } from "@/lib/notifications";

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = await req.json();
    const secret = process.env.RAZORPAY_SECRET_KEY;

    if (!secret) {
      return NextResponse.json({ error: "Razorpay secret not configured" }, { status: 500 });
    }

    // Verify signature
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed. Invalid signature." }, { status: 400 });
    }

    await connectDB();
    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const trip = await Trip.findById(booking.tripId);

    // Determine how much was paid
    const isPayLater = booking.paymentMode === 'Pay Later';
    const paidAmount = isPayLater ? booking.bookingCharge : booking.totalAmount;

    // Update booking
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.amountPaid = paidAmount;
    booking.paymentStatus = isPayLater ? 'Partial' : 'Completed';
    booking.bookingStatus = 'Confirmed';

    // Update the payment record
    const paymentRecord = booking.payments.find(p => p.razorpayOrderId === razorpay_order_id);
    if (paymentRecord) {
      paymentRecord.status = 'Completed';
      paymentRecord.razorpayPaymentId = razorpay_payment_id;
      paymentRecord.razorpaySignature = razorpay_signature;
    }

    await booking.save();

    // Mark seats as reserved
    if (!booking.seatsReserved) {
      booking.seatsReserved = true;
      await booking.save();
    }

    // Generate Invoice PDF
    let pdfBuffer;
    try {
      pdfBuffer = await generateInvoicePDF(booking, trip);
      console.log(`✅ Invoice PDF generated: ${pdfBuffer?.length || 0} bytes`);
    } catch (err) {
      console.error("❌ PDF Generation failed:", err);
    }

    // Extract itinerary PDF from trip if available
    let itineraryBuffer;
    try {
      if (trip?.itineraryPdf) {
        console.log(`📄 Itinerary PDF source: ${trip.itineraryPdf.substring(0, 50)}...`);
        if (trip.itineraryPdf.startsWith('http')) {
          const res = await fetch(trip.itineraryPdf);
          console.log(`📄 Itinerary fetch status: ${res.status}`);
          const arrayBuffer = await res.arrayBuffer();
          itineraryBuffer = Buffer.from(arrayBuffer);
        } else {
          const base64Data = trip.itineraryPdf.split(',')[1];
          if (base64Data) {
            itineraryBuffer = Buffer.from(base64Data, 'base64');
          }
        }
        console.log(`✅ Itinerary buffer: ${itineraryBuffer?.length || 0} bytes`);
      } else {
        console.log("ℹ️ No itinerary PDF on this trip");
      }
    } catch (err) {
      console.error("❌ Itinerary PDF extraction failed:", err);
    }

    // Send email notification with both PDFs
    try {
      console.log(`📧 Sending booking email to ${booking.travellers[0]?.emailAddress}...`);
      await sendBookingEmail(booking, trip, pdfBuffer, itineraryBuffer);
      console.log("✅ sendBookingEmail completed");
    } catch (err) {
      console.error("❌ Email sending failed:", err);
    }

    // Send WhatsApp notification
    try {
      await sendWhatsAppConfirmation(booking, trip);
    } catch (err) {
      console.error("WhatsApp sending failed:", err);
    }

    // Notify admin
    try {
      await sendAdminNotification(booking, trip, pdfBuffer, itineraryBuffer);
    } catch (err) {
      console.error("Admin notification failed:", err);
    }

    return NextResponse.json({ success: true, booking: booking.toJSON() }, { status: 200 });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
