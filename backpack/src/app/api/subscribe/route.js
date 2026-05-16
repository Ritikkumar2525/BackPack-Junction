import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      if (!existingSubscriber.isActive) {
        // Re-subscribe them if they previously unsubscribed
        existingSubscriber.isActive = true;
        await existingSubscriber.save();
        return NextResponse.json({ message: "Welcome back! You've successfully resubscribed to the early access club." }, { status: 200 });
      }
      return NextResponse.json({ error: "You are already a member of our exclusive early access club!" }, { status: 400 });
    }

    const newSubscriber = await Subscriber.create({ email });

    return NextResponse.json({ 
      message: "Welcome to the club! You'll now be the first to know about our upcoming Himalayan journeys." 
    }, { status: 201 });

  } catch (error) {
    console.error("Subscription Error:", error);
    return NextResponse.json({ 
      error: "Unable to complete subscription at this time. Please try again later." 
    }, { status: 500 });
  }
}
