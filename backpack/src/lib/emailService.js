import nodemailer from 'nodemailer';
import Subscriber from '@/models/Subscriber';
import connectDB from '@/lib/mongodb';

// Create a singleton transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Sends a beautifully formatted HTML email to all active early access subscribers.
 * We fire and forget this function so it doesn't block the API response.
 */
export async function notifySubscribersOfNewTrip(trip) {
  try {
    await connectDB();
    const activeSubscribers = await Subscriber.find({ isActive: true }).select('email').lean();
    
    if (!activeSubscribers || activeSubscribers.length === 0) {
      console.log("No active subscribers to notify.");
      return;
    }

    const emails = activeSubscribers.map(sub => sub.email);
    
    // Format dates
    const startDate = new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const endDate = trip.endDate ? new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
    const dateString = endDate ? `${startDate} - ${endDate}` : startDate;
    
    // Price formatting
    const formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(trip.price);

    const tripLink = `${process.env.NEXTAUTH_URL}/trips/${trip.destination}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Exclusive Early Access: ${trip.title}</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0C1420; color: #f2e8d9; }
        .container { max-width: 600px; margin: 0 auto; background-color: #141F33; overflow: hidden; }
        .header { background-color: #0a111a; padding: 30px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .logo { font-size: 24px; font-weight: bold; color: #f2e8d9; letter-spacing: 2px; text-transform: uppercase; }
        .logo-orange { color: #C67A3C; }
        .hero { width: 100%; height: auto; display: block; border-bottom: 2px solid #C67A3C; }
        .content { padding: 40px 30px; }
        .pre-title { color: #C67A3C; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; font-weight: bold; margin-bottom: 10px; }
        h1 { font-size: 28px; font-weight: bold; color: #ffffff; margin-top: 0; margin-bottom: 15px; line-height: 1.3; }
        .story { font-size: 16px; line-height: 1.6; color: #d0d6e0; margin-bottom: 30px; }
        .details-box { background-color: rgba(198,122,60,0.1); border: 1px solid rgba(198,122,60,0.3); border-radius: 12px; padding: 25px; margin-bottom: 35px; }
        .detail-row { display: flex; margin-bottom: 15px; }
        .detail-row:last-child { margin-bottom: 0; }
        .detail-label { width: 100px; font-weight: bold; color: #C67A3C; font-size: 14px; }
        .detail-value { color: #ffffff; font-size: 15px; font-weight: 500; }
        .cta-container { text-align: center; margin: 40px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #C67A3C, #D4842A); color: #ffffff; text-decoration: none; padding: 16px 36px; font-size: 16px; font-weight: bold; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(198,122,60,0.3); }
        .footer { background-color: #0a111a; padding: 30px; text-align: center; font-size: 12px; color: rgba(242,232,217,0.4); }
        .footer a { color: rgba(242,232,217,0.6); text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Backpack<span class="logo-orange">Junction</span></div>
        </div>
        
        ${trip.images && trip.images[0] ? `<img src="${trip.images[0]}" alt="${trip.title}" class="hero" />` : ''}
        
        <div class="content">
          <div class="pre-title">Inner Circle Early Access</div>
          <h1>Your next Himalayan story is calling.</h1>
          
          <div class="story">
            A new journey has just opened — breathtaking landscapes, unforgettable memories, and an adventure waiting beyond the mountains. Because you're part of our early access club, you get to see it before anyone else. Limited seats are available.
          </div>
          
          <div class="details-box">
            <div class="detail-row">
              <div class="detail-label">EXPEDITION</div>
              <div class="detail-value">${trip.title}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">DURATION</div>
              <div class="detail-value">${trip.duration}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">DATES</div>
              <div class="detail-value">${dateString}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">PRICE</div>
              <div class="detail-value">${formattedPrice}</div>
            </div>
          </div>
          
          <div class="cta-container">
            <a href="${tripLink}" class="btn">View Expedition</a>
          </div>
        </div>
        
        <div class="footer">
          <p>You received this email because you joined the Backpack Junction Early Access list.</p>
          <p>&copy; ${new Date().getFullYear()} Backpack Junction. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"Backpack Junction" <${process.env.SMTP_USER}>`,
      bcc: emails, // Use BCC to hide subscriber emails from each other
      subject: `Early Access: New Expedition to ${trip.destination} 🏔️`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Trip announcement emails sent successfully:", info.messageId);

  } catch (error) {
    console.error("Error sending trip announcement emails:", error);
  }
}
