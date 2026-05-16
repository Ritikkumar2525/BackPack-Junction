import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Name, email and message are required." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Backpack Junction Contact" <${process.env.SMTP_USER}>`,
      to: "junctionbackpack@gmail.com",
      replyTo: email,
      subject: subject ? `[Contact] ${subject}` : `[Contact] New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0C1420; color: #F5F0E8; border-radius: 12px; overflow: hidden;">
          <div style="background: #C67A3C; padding: 24px 32px;">
            <h1 style="margin:0; color:#fff; font-size: 22px;">New Contact Message</h1>
            <p style="margin:4px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Backpack Junction — Contact Form</p>
          </div>
          <div style="padding: 32px;">
            <table style="width:100%; border-collapse: collapse;">
              <tr><td style="padding: 10px 0; color: rgba(245,240,232,0.5); font-size:13px; width:100px;">From</td><td style="padding: 10px 0; color: #F5F0E8; font-weight: 600;">${name}</td></tr>
              <tr><td style="padding: 10px 0; color: rgba(245,240,232,0.5); font-size:13px;">Email</td><td style="padding: 10px 0; color: #C67A3C;">${email}</td></tr>
              ${subject ? `<tr><td style="padding: 10px 0; color: rgba(245,240,232,0.5); font-size:13px;">Subject</td><td style="padding: 10px 0; color: #F5F0E8;">${subject}</td></tr>` : ""}
            </table>
            <div style="margin-top: 24px; padding: 20px; background: rgba(255,255,255,0.05); border-left: 4px solid #C67A3C; border-radius: 0 8px 8px 0;">
              <p style="margin:0; color: rgba(245,240,232,0.9); line-height: 1.8; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: rgba(245,240,232,0.3);">
            Sent via backpackjunction.com contact form
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json({ success: false, error: "Failed to send email. Please try again." }, { status: 500 });
  }
}
