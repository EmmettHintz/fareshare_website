// src/app/api/session/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required." }, { status: 400 });
    }

    // Initialize a new session in Firestore
    const sessionDocRef = doc(db, "sessions", sessionId);
    await setDoc(sessionDocRef, {
      items: [],  // Initialize with an empty items array
      totalInfo: { total: 0, tax: 0, tip: 0 },  // Default total info
      alias: "",
    });

    return NextResponse.json({ message: 'Session created successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  // Optional: If you want to handle OPTIONS requests, you can add this.
  return NextResponse.json({}, { status: 200 });
}
