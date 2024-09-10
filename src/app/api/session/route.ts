// src/app/api/session/route.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required." });
      }

      // Initialize a new session in Firestore
      const sessionDocRef = doc(db, "sessions", sessionId);
      await setDoc(sessionDocRef, {
        items: [],  // Initialize with an empty items array
        totalInfo: { total: 0, tax: 0, tip: 0 },  // Default total info
        alias: "",
      });

      res.status(200).json({ message: 'Session created successfully' });
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
