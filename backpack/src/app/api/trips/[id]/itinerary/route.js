import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Trip from '@/models/Trip';

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const trip = await Trip.findById(id).select('itineraryPdf title');

    if (!trip || !trip.itineraryPdf) {
      return NextResponse.json({ error: 'No itinerary found' }, { status: 404 });
    }

    let pdfBuffer;
    let contentType = 'application/pdf';

    if (trip.itineraryPdf.startsWith('data:')) {
      // base64 data URI
      const base64Data = trip.itineraryPdf.split(',')[1];
      if (!base64Data) {
        return NextResponse.json({ error: 'Invalid PDF data' }, { status: 400 });
      }
      pdfBuffer = Buffer.from(base64Data, 'base64');
    } else if (trip.itineraryPdf.startsWith('http')) {
      // Cloudinary URL — fetch it server-side (bypasses ACL for some cases)
      const res = await fetch(trip.itineraryPdf);
      if (!res.ok) {
        return NextResponse.json({ error: 'Failed to fetch PDF from storage' }, { status: 502 });
      }
      const arrayBuffer = await res.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);
    } else {
      return NextResponse.json({ error: 'Unknown PDF format' }, { status: 400 });
    }

    const filename = `Itinerary_${trip.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'trip'}.pdf`;

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error serving itinerary PDF:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
