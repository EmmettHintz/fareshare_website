"use client";  // Use Client Component

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";  // Ensure Firebase configuration is correct

// Define a TypeScript type for the items
type Item = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  buyers: string[];
  people: number;
};

type SessionData = {
  items: Item[];
  totalInfo: {
    total: number;
    tax: number;
    tip: number;
  };
  alias: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [sessionId, setSessionId] = useState<string>("defaultSession"); // Assume default session ID for simplicity

  // Function to fetch and listen to session data
  const initSessionListener = (sessionId: string) => {
    const sessionDocRef = doc(db, "sessions", sessionId);

    // Real-time listener for session data
    const unsubscribe = onSnapshot(sessionDocRef, (docSnapshot) => {
      const data = docSnapshot.data() as SessionData;
      if (data) {
        setSessionData(data);
        setItems(data.items);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  };

  // Initialize session listener when component mounts
  useEffect(() => {
    const unsubscribe = initSessionListener(sessionId);
    return () => unsubscribe();  // Cleanup on component unmount
  }, [sessionId]);

  // Example function to update an item in Firestore
  const updateItem = async (itemId: string) => {
    if (!sessionData) return;

    const sessionDocRef = doc(db, "sessions", sessionId);
    const docSnap = await getDoc(sessionDocRef);

    if (docSnap.exists()) {
      const sessionData = docSnap.data() as SessionData;
      let items = sessionData.items;

      // Update item logic
      for (let index = 0; index < items.length; index++) {
        const item = items[index];
        if (item.id === itemId) {
          item.buyers.includes("user1")
            ? (item.buyers = item.buyers.filter((buyerId) => buyerId !== "user1"))
            : item.buyers.push("user1");
          break;
        }
      }

      sessionData.items = items;
      await setDoc(sessionDocRef, sessionData);  // Update Firestore document
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Card className="mx-auto max-w-md md:max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold">TabShare</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Tip:</span>
                <span>${sessionData?.totalInfo.tip.toFixed(2)} (split {sessionData?.items[0]?.people || 1}/3)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Tax:</span>
                <span>${sessionData?.totalInfo.tax.toFixed(2)} (split {sessionData?.items[0]?.people || 1}/3)</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>You owe:</span>
                <span>${sessionData?.totalInfo.total.toFixed(2)}</span>
              </div>
              <Button className="w-full mt-2">Venmo</Button>
            </CardContent>
          </Card>

          {items.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center">
                  {/* Icon */}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                  <div className="font-semibold">Price: ${item.price.toFixed(2)}</div>
                  <div className="flex space-x-2 mt-2">
                    {item.buyers.map((buyer: string, buyerIndex: number) => (
                      <Avatar key={buyerIndex} className="w-8 h-8">
                        <AvatarFallback>{buyer[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <Button onClick={() => updateItem(item.id)}>Update Item</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
