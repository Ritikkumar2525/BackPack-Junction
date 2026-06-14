import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

export async function generateInvoicePDF(booking, trip) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const primaryTraveller = booking.travellers?.[0] || {};
      const totalAmount = booking.totalAmount || 0;
      const amountPaid = booking.amountPaid || 0;
      const totalDue = Math.max(0, totalAmount - amountPaid);
      const pax = booking.travellers?.length || 1;
      const unitPrice = Math.round(totalAmount / pax);

      // ----- Header (Dark Blue) -----
      doc.rect(0, 0, doc.page.width, 120).fill('#081630');
      
      // Top Left
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(24).text('BACKPACK JUNCTION', 40, 30);
      doc.fillColor('#F59E0B').font('Helvetica-Oblique').fontSize(10).text('Adventure • Memories • Mountains', 40, 60);
      doc.fillColor('#FFFFFF').font('Helvetica').fontSize(10).text('Chopta • Tungnath • Chandrashila', 40, 75);
      doc.fillColor('#E2E8F0').fontSize(9).text('Ph: 8287054501, 8595054501 | IG: @backpack_junction', 40, 90);
      
      // Top Right
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(32).text('INVOICE', 0, 30, { align: 'right', width: doc.page.width - 40 });

      // ----- Watermark Logo -----
      try {
        const logoPath = path.join(process.cwd(), 'public', 'logo.jpg');
        if (fs.existsSync(logoPath)) {
          doc.save();
          doc.opacity(0.06); // Faint watermark
          const logoWidth = 350;
          const x = (doc.page.width - logoWidth) / 2;
          const y = (doc.page.height - logoWidth) / 2 + 50;
          doc.image(logoPath, x, y, { width: logoWidth });
          doc.restore();
        }
      } catch (e) {
        console.error("Logo insertion failed:", e);
      }

      // ----- Invoice Details (Top Right below header) -----
      let startY = 140;
      const rightColX = 350;
      
      const drawLabelValue = (label, value, y, valueColor = '#000000', labelFont = 'Helvetica-Bold') => {
        const safeValue = value !== undefined && value !== null ? String(value) : 'N/A';
        doc.fillColor('#000000').font(labelFont).fontSize(10).text(label, rightColX, y, { width: 80, align: 'right' });
        
        doc.moveTo(rightColX + 90, y + 10).lineTo(doc.page.width - 40, y + 10).lineWidth(0.5).stroke('#E2E8F0');
        doc.fillColor(valueColor).font('Helvetica').text(safeValue, rightColX + 90, y, { width: 120, align: 'left' });
      };

      drawLabelValue('Invoice No:', booking.bookingId, startY);
      drawLabelValue('Date:', booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-') : 'N/A', startY + 15);
      
      const statusColor = booking.paymentStatus === 'Completed' ? '#10B981' : booking.paymentStatus === 'Pending' ? '#F59E0B' : '#EF4444';
      drawLabelValue('Status:', booking.paymentStatus || 'Pending', startY + 30, statusColor);

      // ----- Middle Section: BILLED TO & TRIP DETAILS -----
      startY = 200;
      
      // BILLED TO Box
      doc.rect(40, startY, 240, 18).fill('#F1F5F9');
      doc.fillColor('#000000').font('Helvetica-Bold').fontSize(10).text('BILLED TO:', 45, startY + 5);
      
      doc.font('Helvetica').fontSize(9);
      doc.text('Client Name:', 40, startY + 25); doc.text(primaryTraveller.fullName || 'N/A', 110, startY + 25);
      doc.moveTo(110, startY + 35).lineTo(280, startY + 35).stroke('#E2E8F0');
      
      doc.text('Phone/Email:', 40, startY + 40); 
      const contactInfo = [primaryTraveller.contactNumber, primaryTraveller.emailAddress].filter(Boolean).join(' / ') || 'N/A';
      doc.text(contactInfo, 110, startY + 40);
      doc.moveTo(110, startY + 50).lineTo(280, startY + 50).stroke('#E2E8F0');
      
      doc.text('Address:', 40, startY + 55); doc.text(primaryTraveller.city || 'N/A', 110, startY + 55);
      doc.moveTo(110, startY + 65).lineTo(280, startY + 65).stroke('#E2E8F0');

      // TRIP DETAILS Box
      doc.rect(310, startY, 245, 18).fill('#F1F5F9');
      doc.fillColor('#000000').font('Helvetica-Bold').fontSize(10).text('TRIP DETAILS:', 315, startY + 5);
      
      doc.font('Helvetica').fontSize(9);
      doc.text('Trip Name:', 310, startY + 25); doc.text(trip.title || 'N/A', 380, startY + 25);
      doc.moveTo(380, startY + 35).lineTo(555, startY + 35).stroke('#E2E8F0');
      
      doc.text('Duration:', 310, startY + 40); doc.text(trip.duration || 'N/A', 380, startY + 40);
      doc.moveTo(380, startY + 50).lineTo(555, startY + 50).stroke('#E2E8F0');
      
      let dateOfJourney = 'N/A';
      if (booking.travelDates?.startDate) {
        dateOfJourney = new Date(booking.travelDates.startDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
      } else if (trip.startDate) {
        dateOfJourney = new Date(trip.startDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
      }
      doc.text('Journey Date:', 310, startY + 55); doc.text(dateOfJourney, 380, startY + 55);
      doc.moveTo(380, startY + 65).lineTo(555, startY + 65).stroke('#E2E8F0');
      
      doc.text('Travelers:', 310, startY + 70); doc.text(String(pax), 380, startY + 70);
      doc.moveTo(380, startY + 80).lineTo(555, startY + 80).stroke('#E2E8F0');

      const sharingPref = primaryTraveller.specialRequests?.toLowerCase().includes('sharing') 
        ? primaryTraveller.specialRequests 
        : (pax === 1 ? 'Solo / As requested' : pax === 2 ? 'Double Sharing' : pax === 3 ? 'Triple Sharing' : 'Quad Sharing');
      doc.text('Room Sharing:', 310, startY + 85); doc.text(sharingPref, 380, startY + 85);
      doc.moveTo(380, startY + 95).lineTo(555, startY + 95).stroke('#E2E8F0');

      // ----- Table -----
      startY = 315;
      
      // Table Header Background
      doc.rect(40, startY, doc.page.width - 80, 20).fill('#EBF5FF');
      
      doc.fillColor('#000000').font('Helvetica-Bold').fontSize(9);
      doc.text('#', 40, startY + 6, { width: 30, align: 'center' });
      doc.text('Description', 70, startY + 6, { width: 220, align: 'left' });
      doc.text('Qty/Pax', 290, startY + 6, { width: 60, align: 'center' });
      doc.text('Unit Price', 350, startY + 6, { width: 90, align: 'center' });
      doc.text('Total', 440, startY + 6, { width: 100, align: 'center' });
      
      // Grid lines
      doc.lineWidth(0.5).strokeColor('#CBD5E1');
      doc.rect(40, startY, doc.page.width - 80, 20).stroke(); // Header border
      
      // Row 1
      startY += 20;
      doc.rect(40, startY, doc.page.width - 80, 20).stroke();
      doc.font('Helvetica').fontSize(9);
      doc.text('1', 40, startY + 6, { width: 30, align: 'center' });
      doc.text(`${trip.title || 'Trip Package'}`, 75, startY + 6, { width: 215, align: 'left' });
      doc.text(String(pax), 290, startY + 6, { width: 60, align: 'center' });
      doc.text(`INR ${unitPrice.toLocaleString('en-IN')}`, 350, startY + 6, { width: 90, align: 'center' });
      doc.text(`INR ${totalAmount.toLocaleString('en-IN')}`, 440, startY + 6, { width: 100, align: 'center' });
      
      // Vertical grid lines for the row
      doc.moveTo(70, startY - 20).lineTo(70, startY + 20).stroke();
      doc.moveTo(290, startY - 20).lineTo(290, startY + 20).stroke();
      doc.moveTo(350, startY - 20).lineTo(350, startY + 20).stroke();
      doc.moveTo(440, startY - 20).lineTo(440, startY + 20).stroke();

      // Empty rows for structure
      for (let i = 0; i < 5; i++) {
        startY += 20;
        doc.rect(40, startY, doc.page.width - 80, 20).stroke();
        doc.moveTo(70, startY).lineTo(70, startY + 20).stroke();
        doc.moveTo(290, startY).lineTo(290, startY + 20).stroke();
        doc.moveTo(350, startY).lineTo(350, startY + 20).stroke();
        doc.moveTo(440, startY).lineTo(440, startY + 20).stroke();
      }

      // ----- Totals Section (Bottom Right) -----
      startY += 40;
      doc.font('Helvetica-Bold').fontSize(10);
      doc.text('Subtotal:', 350, startY, { width: 80, align: 'right' });
      doc.font('Helvetica').text(`INR ${totalAmount.toLocaleString('en-IN')}`, 440, startY, { width: 100, align: 'center' });
      
      startY += 15;
      doc.font('Helvetica-Bold').text('Advance Paid:', 350, startY, { width: 80, align: 'right' });
      doc.font('Helvetica').fillColor('#10B981').text(`-INR ${amountPaid.toLocaleString('en-IN')}`, 440, startY, { width: 100, align: 'center' });
      
      startY += 15;
      doc.rect(340, startY - 5, 215, 20).fill('#081630');
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').text('Total Due:', 350, startY, { width: 80, align: 'right' });
      doc.text(`INR ${totalDue.toLocaleString('en-IN')}`, 440, startY, { width: 100, align: 'center' });

      if (booking.paymentStatus === 'Pending') {
        startY += 25;
        const requiredAdvance = booking.bookingCharge || (1500 * pax);
        doc.fillColor('#EF4444').font('Helvetica-Bold').fontSize(9).text(`* Required Advance to Confirm: INR ${requiredAdvance.toLocaleString('en-IN')}`, 340, startY, { align: 'right', width: 200 });
      }

      // ----- Payment Details (Bottom Left) -----
      startY -= 30; // Align with subtotal
      doc.rect(40, startY - 5, 280, 15).fill('#F1F5F9');
      doc.fillColor('#000000').font('Helvetica-Bold').fontSize(9).text('PAYMENT DETAILS:', 45, startY - 1);
      
      startY += 15;
      doc.font('Helvetica').fontSize(8);
      
      if (booking.paymentMethod === 'Razorpay' && !booking.manualUtr) {
        doc.text('Payment Method:', 40, startY); doc.font('Helvetica-Bold').text('Razorpay', 110, startY); doc.font('Helvetica');
        doc.text('Payment Status:', 40, startY + 12); doc.text(booking.paymentStatus || 'Pending', 110, startY + 12);
        
        if (booking.razorpayOrderId) {
           doc.text('Order ID:', 40, startY + 24); doc.text(booking.razorpayOrderId, 110, startY + 24);
        }
        
        const tx = booking.payments?.find(p => p.transactionId);
        if (tx) {
           doc.text('Transaction ID:', 40, startY + 36); doc.text(tx.transactionId, 110, startY + 36);
        }
      } else {
        const isManualSubmitted = !!booking.manualUtr;
        const actualMethod = isManualSubmitted ? 'Bank Transfer / UPI' : booking.paymentMethod || 'Manual';

        doc.text('Payment Method:', 40, startY); doc.font('Helvetica-Bold').text(actualMethod, 110, startY); doc.font('Helvetica');
        doc.text('Payment Status:', 40, startY + 12); doc.text(booking.paymentStatus || 'Pending', 110, startY + 12);

        // If payment is completed or UTR is submitted, show THEIR transaction details, NOT our bank details
        if (booking.paymentStatus === 'Completed' || isManualSubmitted) {
           const txId = booking.manualUtr || booking.payments?.[0]?.transactionId || 'Awaiting Sync';
           doc.text('Transaction / UTR:', 40, startY + 24); doc.text(txId, 110, startY + 24);
        } else {
           // Show our bank details for pending manual payments
           const bankName = process.env.BANK_NAME || 'HDFC Bank';
           const accountName = process.env.BANK_ACCOUNT_NAME || 'Backpack Junction';
           const accountNo = process.env.BANK_ACCOUNT_NUMBER || '50200012345678';
           const ifsc = process.env.BANK_IFSC_CODE || 'HDFC0001234';
           const upi = process.env.BANK_UPI_ID || 'backpackjunction@ybl';

           doc.text('Bank Name:', 40, startY + 24); doc.font('Helvetica-Bold').text(bankName, 110, startY + 24); doc.font('Helvetica');
           doc.text('Account Name:', 40, startY + 36); doc.font('Helvetica-Bold').text(accountName, 110, startY + 36); doc.font('Helvetica');
           doc.text('Account No:', 40, startY + 48); doc.text(accountNo, 110, startY + 48);
           doc.text('IFSC Code:', 40, startY + 60); doc.text(ifsc, 110, startY + 60);
           doc.text('UPI ID:', 40, startY + 72); doc.text(upi, 110, startY + 72);
        }
      }

      // ----- Terms & Conditions -----
      startY += 75;
      doc.font('Helvetica-Bold').fontSize(9).text('TERMS & CONDITIONS:', 40, startY);
      doc.font('Helvetica').fontSize(8).fillColor('#4A5568');
      doc.text('1. INR 1,500 per head booking charge is non-refundable under any circumstances.', 40, startY + 15);
      doc.text('2. Please quote the invoice number when making the payment.', 40, startY + 27);
      
      // Thank You Message
      doc.font('Helvetica-BoldOblique').fontSize(11).fillColor('#081630');
      doc.text('Thank you for traveling with Backpack Junction!', 40, startY + 60, { align: 'center', width: doc.page.width - 80 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
