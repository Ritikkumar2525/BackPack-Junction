import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';
import Destination from '@/models/Destination';

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req) {
  try {
    // API is currently disabled due to invalid/leaked keys.
    // Immediately return the under maintenance message.
    return NextResponse.json({ 
      reply: "I am currently undergoing scheduled maintenance to upgrade my travel database. Please reach out to our team directly via WhatsApp for any immediate queries!" 
    }, { status: 200 });

  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json({ 
      reply: "I am currently undergoing scheduled maintenance. Please reach out to our team directly via WhatsApp for any immediate travel queries!" 
    }, { status: 200 });
  }
}
