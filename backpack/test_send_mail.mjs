import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "junctionbackpack@gmail.com",
    pass: "kksu axun cckr aiyo",
  },
});

async function test() {
  try {
    const dummyInvoice = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF');
    
    // Simulate fetching the itinerary from Cloudinary
    const fetch = (await import('node-fetch')).default;
    const url = 'https://res.cloudinary.com/ddrife5n3/raw/upload/v1781540487/backpack_general/test_pdf_spoofed.dat';
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    const dummyItinerary = Buffer.from(arrayBuffer);

    const mailOptions = {
      from: '"BackPack Junction" <junctionbackpack@gmail.com>',
      to: 'junctionbackpack@gmail.com', // send to themselves for testing
      subject: 'Test Email with Attachments',
      text: 'This is a test email.',
      attachments: [
        { filename: 'Invoice_TEST.pdf', content: dummyInvoice },
        { filename: 'Itinerary_TEST.pdf', content: dummyItinerary },
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Mail sent:", info.messageId);
  } catch (err) {
    console.error("Error sending mail:", err);
  }
}

test();
