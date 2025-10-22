import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  console.log("Deepgram API Key loaded:", !!apiKey);

  if (!apiKey) {
    console.error("DEEPGRAM_API_KEY not set");
    return NextResponse.json({ error: "API key not set" }, { status: 500 });
  }

  // Simply return the API key for the client to use
  // In production, you'd want to create a temporary key or use a proxy
  return NextResponse.json({ key: apiKey });
}
