import connectDB from './src/lib/mongodb.js';
import Booking from './src/models/Booking.js';

async function run() {
  try {
    await connectDB();
    const id = "69ffc4b34e8bd7168c65a04f";
    const booking = await Booking.findById(id);
    console.log("Before payments length:", booking.payments?.length);
    
    if (!booking.payments) booking.payments = [];
    const paymentRecord = booking.payments.find(p => p.status === 'Pending' && p.method !== 'Razorpay');
    
    if (paymentRecord) {
      paymentRecord.transactionId = "TEST_UTR_123";
      paymentRecord.screenshot = "test_base64";
      console.log("Updated existing record");
    } else {
      const fallbackMethod = booking.paymentMethod !== 'Razorpay' ? booking.paymentMethod : 'Bank Transfer';
      booking.payments.push({
        method: fallbackMethod,
        amount: booking.totalAmount,
        transactionId: "TEST_UTR_123",
        screenshot: "test_base64",
        status: 'Pending',
        note: 'Submitted UTR from user'
      });
      console.log("Pushed new record");
    }
    
    booking.markModified('payments');
    await booking.save();
    console.log("Saved.");
    
    const check = await Booking.findById(id).lean();
    console.log("After save, transactionId is:", check.payments[check.payments.length - 1].transactionId);
    
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
run();
