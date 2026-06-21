import nodemailer from 'nodemailer';

// Gmail SMTP transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Inspirational travel quotes
const travelQuotes = [
  { text: "The mountains are calling, and I must go.", author: "John Muir" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
  { text: "The world is a book and those who do not travel read only one page.", author: "Saint Augustine" },
  { text: "In every walk with nature, one receives far more than he seeks.", author: "John Muir" },
  { text: "To travel is to discover that everyone is wrong about other countries.", author: "Aldous Huxley" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Adventure is worthwhile in itself.", author: "Amelia Earhart" },
  { text: "Travel makes one modest. You see what a tiny place you occupy in the world.", author: "Gustave Flaubert" },
  { text: "We travel not to escape life, but for life not to escape us.", author: "Anonymous" },
];

const getRandomQuote = () => travelQuotes[Math.floor(Math.random() * travelQuotes.length)];

export async function sendBookingEmail(booking, trip, invoicePdfBuffer, itineraryPdfBuffer) {
  try {
    console.log(`📧 sendBookingEmail called — SMTP_USER=${process.env.SMTP_USER ? 'SET' : 'MISSING'}, SMTP_PASSWORD=${process.env.SMTP_PASSWORD ? 'SET' : 'MISSING'}`);
    console.log(`📧 Invoice buffer: ${invoicePdfBuffer?.length || 0} bytes, Itinerary buffer: ${itineraryPdfBuffer?.length || 0} bytes`);
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error("❌ SMTP credentials missing. Cannot send email. Check Vercel env vars.");
      return;
    }

    const transporter = createTransporter();
    const primaryEmail = booking.travellers[0]?.emailAddress;
    const primaryName = booking.travellers[0]?.fullName?.split(' ')[0] || 'Traveller';
    if (!primaryEmail) {
      console.log("No traveller email found. Skipping email.");
      return;
    }

    const isPayLater = booking.paymentMode === 'Pay Later';
    const quote = getRandomQuote();
    const isConfirmed = booking.bookingStatus === 'Confirmed';
    const balanceDue = booking.totalAmount - booking.amountPaid;

    const paymentBadge = isPayLater 
      ? `<span style="background:linear-gradient(135deg,#F59E0B,#D97706);color:#fff;padding:6px 16px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.5px;">PARTIAL PAYMENT — BALANCE DUE</span>`
      : `<span style="background:linear-gradient(135deg,#10B981,#059669);color:#fff;padding:6px 16px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.5px;">FULL PAYMENT RECEIVED</span>`;

    const travellerRows = booking.travellers.map((t, i) => `
      <tr style="border-top:1px solid rgba(245,240,232,0.05);">
        <td style="padding:8px 0;color:rgba(245,240,232,0.5);font-size:12px;">${i + 1}. ${t.fullName}</td>
        <td style="padding:8px 0;color:rgba(245,240,232,0.7);font-size:12px;text-align:right;">${t.age || 'N/A'} / ${t.gender || 'N/A'}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"BackPack Junction" <${process.env.SMTP_USER}>`,
      to: primaryEmail,
      subject: isConfirmed 
        ? `🎒 Your ${trip.title} Adventure is Confirmed! — ${booking.bookingId}`
        : `🎒 Booking ${booking.bookingStatus}: ${trip.title} — ${booking.bookingId}`,
      html: `
        <div style="max-width:620px;margin:0 auto;font-family:'Segoe UI','Inter',Arial,sans-serif;background:#0C1420;color:#F5F0E8;border-radius:20px;overflow:hidden;border:1px solid rgba(198,122,60,0.15);">
          
          <!-- Header with gradient -->
          <div style="background:linear-gradient(135deg,#1A2940 0%,#0C1420 50%,#1E2D4A 100%);padding:40px 32px 32px;text-align:center;border-bottom:1px solid rgba(245,240,232,0.08);">
            <div style="margin-bottom:16px;">
              <span style="font-size:28px;font-weight:800;color:#C67A3C;letter-spacing:1px;">BACKPACK</span>
              <span style="font-size:28px;font-weight:300;color:#F5F0E8;letter-spacing:1px;"> JUNCTION</span>
            </div>
            <p style="margin:0;font-size:10px;color:rgba(245,240,232,0.35);letter-spacing:3px;text-transform:uppercase;">Yatra · Adventure · Memories</p>
          </div>

          <!-- Greeting & Status -->
          <div style="padding:32px;text-align:center;">
            <p style="margin:0 0 8px;font-size:14px;color:rgba(245,240,232,0.5);">Hello <strong style="color:#F5F0E8;">${primaryName}</strong>,</p>
            <h2 style="margin:0 0 20px;font-size:22px;color:#F5F0E8;font-weight:700;">
              ${isConfirmed ? 'Your Adventure Awaits! 🏔️' : `Booking ${booking.bookingStatus}!`}
            </h2>
            ${paymentBadge}
          </div>

          <!-- Inspirational Quote -->
          <div style="margin:0 32px 24px;padding:20px 24px;background:linear-gradient(135deg,rgba(198,122,60,0.08),rgba(198,122,60,0.02));border-left:3px solid #C67A3C;border-radius:0 12px 12px 0;">
            <p style="margin:0 0 6px;font-size:14px;color:rgba(245,240,232,0.8);font-style:italic;line-height:1.6;">"${quote.text}"</p>
            <p style="margin:0;font-size:11px;color:rgba(198,122,60,0.7);font-weight:600;">— ${quote.author}</p>
          </div>

          <!-- Trip Details Card -->
          <div style="margin:0 32px 24px;padding:24px;background:rgba(245,240,232,0.03);border:1px solid rgba(245,240,232,0.06);border-radius:16px;">
            <h3 style="margin:0 0 4px;font-size:18px;color:#C67A3C;font-weight:700;">${trip.title}</h3>
            <p style="margin:0 0 16px;font-size:12px;color:rgba(245,240,232,0.4);">📍 ${trip.destination} · ⏱ ${trip.duration || 'TBD'}</p>
            
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;color:rgba(245,240,232,0.4);font-size:12px;border-bottom:1px solid rgba(245,240,232,0.04);">Booking ID</td>
                <td style="padding:10px 0;color:#F5F0E8;font-size:12px;text-align:right;font-weight:600;font-family:monospace;border-bottom:1px solid rgba(245,240,232,0.04);">${booking.bookingId}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:rgba(245,240,232,0.4);font-size:12px;border-bottom:1px solid rgba(245,240,232,0.04);">Travellers</td>
                <td style="padding:10px 0;color:#F5F0E8;font-size:12px;text-align:right;">${booking.travellers.length} person(s)</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:rgba(245,240,232,0.4);font-size:12px;border-bottom:1px solid rgba(245,240,232,0.04);">Total Amount</td>
                <td style="padding:10px 0;color:#C67A3C;font-size:16px;text-align:right;font-weight:700;">₹${booking.totalAmount.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:rgba(245,240,232,0.4);font-size:12px;border-bottom:1px solid rgba(245,240,232,0.04);">Amount Paid</td>
                <td style="padding:10px 0;color:#10B981;font-size:14px;text-align:right;font-weight:600;">₹${booking.amountPaid.toLocaleString('en-IN')}</td>
              </tr>
              ${balanceDue > 0 ? `
              <tr>
                <td style="padding:10px 0;color:rgba(245,240,232,0.4);font-size:12px;border-bottom:1px solid rgba(245,240,232,0.04);">Balance Due</td>
                <td style="padding:10px 0;color:#F59E0B;font-size:14px;text-align:right;font-weight:600;">₹${balanceDue.toLocaleString('en-IN')}</td>
              </tr>` : ''}
              <tr>
                <td style="padding:10px 0;color:rgba(245,240,232,0.4);font-size:12px;">Payment Method</td>
                <td style="padding:10px 0;color:#F5F0E8;font-size:12px;text-align:right;">${booking.paymentMethod || 'N/A'}</td>
              </tr>
              ${booking.razorpayPaymentId ? `
              <tr>
                <td style="padding:10px 0;color:rgba(245,240,232,0.4);font-size:12px;border-top:1px solid rgba(245,240,232,0.04);">Transaction ID</td>
                <td style="padding:10px 0;color:#F5F0E8;font-size:11px;text-align:right;font-family:monospace;border-top:1px solid rgba(245,240,232,0.04);">${booking.razorpayPaymentId}</td>
              </tr>` : ''}
              <tr>
                <td style="padding:10px 0;color:rgba(245,240,232,0.4);font-size:12px;border-top:1px solid rgba(245,240,232,0.04);">Payment Status</td>
                <td style="padding:10px 0;font-size:12px;text-align:right;font-weight:600;border-top:1px solid rgba(245,240,232,0.04);color:${booking.paymentStatus === 'Completed' ? '#10B981' : '#F59E0B'};">${booking.paymentStatus === 'Partial' ? 'Partially Paid' : booking.paymentStatus}</td>
              </tr>
            </table>
          </div>

          <!-- Traveller List -->
          <div style="margin:0 32px 24px;padding:20px;background:rgba(245,240,232,0.02);border:1px solid rgba(245,240,232,0.05);border-radius:12px;">
            <h4 style="margin:0 0 12px;font-size:12px;color:rgba(245,240,232,0.5);text-transform:uppercase;letter-spacing:1px;">Registered Travellers</h4>
            <table style="width:100%;border-collapse:collapse;">
              ${travellerRows}
            </table>
          </div>

          <!-- Thank You Message -->
          <div style="margin:0 32px 24px;padding:24px;text-align:center;background:linear-gradient(135deg,rgba(16,185,129,0.06),rgba(16,185,129,0.02));border:1px solid rgba(16,185,129,0.1);border-radius:16px;">
            <p style="margin:0 0 8px;font-size:16px;color:#F5F0E8;font-weight:600;">Thank You for Choosing BackPack Junction! 🎒</p>
            <p style="margin:0;font-size:12px;color:rgba(245,240,232,0.5);line-height:1.7;">
              We're honoured to be part of your journey to the majestic Himalayas. 
              Our team is working to make this trip an unforgettable experience for you. 
              ${isConfirmed ? 'Your invoice is attached with this email.' : 'We will notify you once your booking is confirmed.'}
              ${itineraryPdfBuffer ? ' Trip itinerary PDF is also attached for your reference.' : ''}
            </p>
          </div>

          <!-- What's Next Section -->
          <div style="margin:0 32px 24px;">
            <h4 style="margin:0 0 12px;font-size:12px;color:rgba(245,240,232,0.4);text-transform:uppercase;letter-spacing:1px;">What's Next?</h4>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;font-size:12px;color:rgba(245,240,232,0.6);vertical-align:top;">✅</td>
                <td style="padding:8px 0 8px 8px;font-size:12px;color:rgba(245,240,232,0.6);">Join our WhatsApp group (link will be shared closer to the trip date)</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:12px;color:rgba(245,240,232,0.6);vertical-align:top;">📋</td>
                <td style="padding:8px 0 8px 8px;font-size:12px;color:rgba(245,240,232,0.6);">Check your dashboard for trip details, itinerary & packing list</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-size:12px;color:rgba(245,240,232,0.6);vertical-align:top;">📸</td>
                <td style="padding:8px 0 8px 8px;font-size:12px;color:rgba(245,240,232,0.6);">Follow us on <a href="https://instagram.com/backpack_junction" style="color:#C67A3C;text-decoration:none;font-weight:600;">@backpack_junction</a> for trip updates</td>
              </tr>
            </table>
          </div>

          <!-- Cancellation Policy -->
          <div style="margin:0 32px 24px;padding:16px 20px;background:rgba(239,68,68,0.04);border:1px solid rgba(239,68,68,0.1);border-radius:12px;">
            <p style="margin:0;font-size:11px;color:rgba(245,240,232,0.5);line-height:1.7;">
              <strong style="color:#EF4444;">Cancellation Policy:</strong> ₹1,500 per head is a non-refundable booking charge. 
              Remaining amount will be refunded within 7-10 working days upon cancellation.
            </p>
          </div>

          <!-- Footer -->
          <div style="padding:28px 32px;text-align:center;background:rgba(245,240,232,0.02);border-top:1px solid rgba(245,240,232,0.05);">
            <p style="margin:0 0 8px;font-size:12px;color:rgba(245,240,232,0.4);">
              Questions? Reach us at <a href="mailto:junctionbackpack@gmail.com" style="color:#C67A3C;text-decoration:none;font-weight:600;">junctionbackpack@gmail.com</a>
            </p>
            <p style="margin:0 0 12px;font-size:12px;color:rgba(245,240,232,0.3);">
              📞 Call/WhatsApp: <a href="tel:+918595054501" style="color:rgba(245,240,232,0.5);text-decoration:none;">+91 85950 54501</a>
            </p>
            <div style="margin:16px 0 0;">
              <a href="https://instagram.com/backpack_junction" style="color:#C67A3C;text-decoration:none;font-size:11px;margin:0 8px;">Instagram</a>
              <span style="color:rgba(245,240,232,0.1);">|</span>
              <a href="https://backpackjunction.com" style="color:#C67A3C;text-decoration:none;font-size:11px;margin:0 8px;">Website</a>
            </div>
            <p style="margin:16px 0 0;font-size:10px;color:rgba(245,240,232,0.15);">© 2026 BackPack Junction. All rights reserved.</p>
          </div>
        </div>
      `,
      attachments: (() => {
        const att = [];
        if (invoicePdfBuffer) att.push({ filename: `Invoice_${booking.bookingId}.pdf`, content: invoicePdfBuffer });
        if (itineraryPdfBuffer) att.push({ filename: `Itinerary_${trip.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`, content: itineraryPdfBuffer });
        return att;
      })()
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Booking email sent to ${primaryEmail}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}

export async function sendCancellationEmail(booking, trip) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return;

    const transporter = createTransporter();
    const primaryEmail = booking.travellers[0]?.emailAddress;
    const primaryName = booking.travellers[0]?.fullName?.split(' ')[0] || 'Traveller';
    if (!primaryEmail) return;

    const quote = getRandomQuote();

    const mailOptions = {
      from: `"BackPack Junction" <${process.env.SMTP_USER}>`,
      to: primaryEmail,
      subject: `Booking Cancelled: ${booking.bookingId} — ${trip?.title || 'Trip'}`,
      html: `
        <div style="max-width:620px;margin:0 auto;font-family:'Segoe UI','Inter',Arial,sans-serif;background:#0C1420;color:#F5F0E8;border-radius:20px;overflow:hidden;border:1px solid rgba(239,68,68,0.15);">
          <div style="background:linear-gradient(135deg,#1A2940,#0C1420);padding:40px 32px 32px;text-align:center;">
            <div style="margin-bottom:16px;">
              <span style="font-size:28px;font-weight:800;color:#C67A3C;">BACKPACK</span>
              <span style="font-size:28px;font-weight:300;color:#F5F0E8;"> JUNCTION</span>
            </div>
            <p style="margin:0;font-size:10px;color:rgba(245,240,232,0.35);letter-spacing:3px;text-transform:uppercase;">Yatra · Adventure · Memories</p>
          </div>

          <div style="padding:32px;text-align:center;">
            <p style="margin:0 0 8px;font-size:14px;color:rgba(245,240,232,0.5);">Hello <strong style="color:#F5F0E8;">${primaryName}</strong>,</p>
            <h2 style="color:#EF4444;margin:0 0 20px;font-size:22px;">Booking Cancelled</h2>
            <p style="color:rgba(245,240,232,0.5);font-size:13px;margin:0 0 24px;line-height:1.7;">
              Your booking <strong style="color:#F5F0E8;">${booking.bookingId}</strong> for <strong style="color:#C67A3C;">${trip?.title || 'Trip'}</strong> has been cancelled.
            </p>
          </div>

          <div style="margin:0 32px 24px;padding:20px;background:rgba(245,240,232,0.03);border:1px solid rgba(245,240,232,0.06);border-radius:12px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;color:rgba(245,240,232,0.4);font-size:12px;">Booking Charge (Non-refundable)</td>
                <td style="padding:8px 0;color:#EF4444;font-size:13px;text-align:right;font-weight:600;">₹${(booking.bookingCharge || 0).toLocaleString('en-IN')}</td>
              </tr>
              <tr style="border-top:1px solid rgba(245,240,232,0.05);">
                <td style="padding:8px 0;color:rgba(245,240,232,0.4);font-size:12px;">Refund Amount</td>
                <td style="padding:8px 0;color:#10B981;font-size:14px;text-align:right;font-weight:600;">₹${(booking.refundAmount || Math.max(0, (booking.amountPaid || 0) - ((booking.cancellationPolicy?.nonRefundablePerHead || 1500) * (booking.travellers?.length || 1)))).toLocaleString('en-IN')}</td>
              </tr>
              <tr style="border-top:1px solid rgba(245,240,232,0.05);">
                <td style="padding:8px 0;color:rgba(245,240,232,0.4);font-size:12px;">Refund Status</td>
                <td style="padding:8px 0;color:#C67A3C;font-size:12px;text-align:right;font-weight:600;text-transform:uppercase;">${booking.refundStatus || 'Processing'}</td>
              </tr>
            </table>
            <p style="margin:12px 0 0;font-size:11px;color:rgba(245,240,232,0.3);">Refunds are typically processed to your provided UPI ID within 7-10 working days.</p>
          </div>

          <!-- Inspirational Quote -->
          <div style="margin:0 32px 24px;padding:16px 20px;background:rgba(198,122,60,0.05);border-left:3px solid #C67A3C;border-radius:0 12px 12px 0;">
            <p style="margin:0 0 4px;font-size:13px;color:rgba(245,240,232,0.7);font-style:italic;">"${quote.text}"</p>
            <p style="margin:0;font-size:10px;color:rgba(198,122,60,0.6);">— ${quote.author}</p>
          </div>

          <div style="margin:0 32px 24px;text-align:center;">
            <p style="margin:0;font-size:13px;color:rgba(245,240,232,0.5);line-height:1.7;">
              We hope to see you on the trails soon! 🏔️<br/>
              Your next adventure is just a booking away.
            </p>
          </div>

          <div style="padding:24px 32px;text-align:center;border-top:1px solid rgba(245,240,232,0.05);">
            <p style="margin:0 0 8px;font-size:12px;color:rgba(245,240,232,0.3);">
              Questions? <a href="mailto:junctionbackpack@gmail.com" style="color:#C67A3C;text-decoration:none;">junctionbackpack@gmail.com</a>
            </p>
            <p style="margin:0;font-size:10px;color:rgba(245,240,232,0.15);">© 2026 BackPack Junction. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Cancellation email sent to ${primaryEmail}`);
  } catch (error) {
    console.error("❌ Failed to send cancellation email:", error);
  }
}

export async function sendWhatsAppConfirmation(booking, trip) {
  try {
    const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER } = process.env;
    if (!TWILIO_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
      console.log("Twilio credentials missing. Skipping WhatsApp message.");
      return;
    }

    const twilio = (await import('twilio')).default;
    const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
    const primaryPhone = booking.travellers[0]?.contactNumber;
    if (!primaryPhone) return;

    let formattedPhone = primaryPhone;
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone.replace(/\D/g, '');
    }

    const isPayLater = booking.paymentMode === 'Pay Later';
    const message = `*Booking ${booking.bookingStatus}!* 🎉\n\nHi ${booking.travellers[0].fullName},\nYour trip to *${trip.destination}* (${trip.title}) is ${booking.bookingStatus.toLowerCase()}.\n\n*Booking ID:* ${booking.bookingId}\n*Travellers:* ${booking.travellers.length}\n*Total:* ₹${booking.totalAmount.toLocaleString('en-IN')}\n*Paid:* ₹${booking.amountPaid.toLocaleString('en-IN')}${isPayLater ? `\n*Balance Due:* ₹${(booking.totalAmount - booking.amountPaid).toLocaleString('en-IN')}` : ''}\n\nThank you for choosing BackPack Junction! 🎒`;

    await client.messages.create({
      body: message,
      from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${formattedPhone}`
    });
    console.log(`✅ WhatsApp sent to ${formattedPhone}`);
  } catch (error) {
    console.error("❌ Failed to send WhatsApp:", error);
  }
}

// Send email to admin when new booking is received
export async function sendAdminNotification(booking, trip, invoicePdfBuffer, itineraryPdfBuffer) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return;

    const transporter = createTransporter();

    const mailOptions = {
      from: `"BackPack Junction System" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to admin email
      subject: `🆕 New Booking: ${booking.bookingId} - ${trip.title}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;padding:20px;">
          <h2 style="color:#C67A3C;">New Booking Received!</h2>
          <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
          <p><strong>Trip:</strong> ${trip.title} (${trip.destination})</p>
          <p><strong>Travellers:</strong> ${booking.travellers.length}</p>
          <p><strong>Lead:</strong> ${booking.travellers[0]?.fullName} (${booking.travellers[0]?.contactNumber})</p>
          <p><strong>Total:</strong> ₹${booking.totalAmount.toLocaleString('en-IN')}</p>
          <p><strong>Paid:</strong> ₹${booking.amountPaid.toLocaleString('en-IN')}</p>
          <p><strong>Method:</strong> ${booking.paymentMethod}</p>
          <p><strong>Mode:</strong> ${booking.paymentMode}</p>
          <hr/>
          <p style="color:#888;font-size:12px;">Login to admin panel to manage this booking.</p>
        </div>
      `,
      attachments: (() => {
        const att = [];
        if (invoicePdfBuffer) att.push({ filename: `Invoice_${booking.bookingId}.pdf`, content: invoicePdfBuffer });
        if (itineraryPdfBuffer) att.push({ filename: `Itinerary_${trip.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`, content: itineraryPdfBuffer });
        return att;
      })()
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Admin notification sent");
  } catch (error) {
    console.error("❌ Admin notification failed:", error);
  }
}

// Send email to admin when a user requests cancellation
export async function sendCancellationRequestNotification(booking, trip) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return;

    const transporter = createTransporter();

    const mailOptions = {
      from: `"BackPack Junction System" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `⚠️ Cancellation Request: ${booking.bookingId} - ${trip.title}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;padding:20px;">
          <h2 style="color:#EF4444;">New Cancellation Request</h2>
          <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
          <p><strong>Trip:</strong> ${trip.title} (${trip.destination})</p>
          <p><strong>User:</strong> ${booking.travellers[0]?.fullName} (${booking.travellers[0]?.contactNumber})</p>
          <p><strong>Reason:</strong> ${booking.cancellationRequest?.reason}</p>
          <p><strong>UPI ID:</strong> ${booking.cancellationRequest?.upiId}</p>
          <p><strong>Total Paid:</strong> ₹${booking.amountPaid.toLocaleString('en-IN')}</p>
          <hr/>
          <p style="color:#888;font-size:12px;">Login to admin panel -> Cancellations to review and accept/reject.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Admin cancellation request notification sent");
  } catch (error) {
    console.error("❌ Admin cancellation notification failed:", error);
  }
}
