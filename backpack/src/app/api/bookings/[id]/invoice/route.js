import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";
import { generateInvoicePDF } from "@/lib/pdfGenerator";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { bookingId: id };
    const booking = await Booking.findOne(query);
    if (!booking) return new NextResponse("Booking not found", { status: 404 });

    const trip = await Trip.findById(booking.tripId);
    if (!trip) return new NextResponse("Trip not found", { status: 404 });

    const pdfBuffer = await generateInvoicePDF(booking, trip);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice_${booking.bookingId}.pdf"`
      }
    });

  } catch (error) {
    console.error("PDF download error:", error);
    return new NextResponse(`Failed to generate PDF: ${error.message || error}`, { status: 500 });
  }
}
