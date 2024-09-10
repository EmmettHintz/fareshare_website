// src/app/session/[sessionId]/page.tsx

"use client";  // Use Client Component

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";  // Import shadcn Input component
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

type Item = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  buyers: string[];
  people: number;
};

type TotalInfo = {
  total: number;
  tax: number;
  tip: number;
};

type SessionData = {
  items: Item[];
  totalInfo: TotalInfo;
  alias: string;
};

export default function SessionPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = params;  // Retrieve the sessionId from the URL params
  const [items, setItems] = useState<Item[]>([]);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (!sessionId) return;  // Wait until sessionId is available

    const sessionDocRef = doc(db, "sessions", sessionId);

    // Real-time listener for session data
    const unsubscribe = onSnapshot(sessionDocRef, (docSnapshot) => {
      const data = docSnapshot.data() as SessionData;
      if (data) {
        setSessionData(data);
        setItems(data.items);
      }
    });

    return () => unsubscribe();  // Cleanup listener on unmount
  }, [sessionId]);

  const updateItem = async (itemId: string) => {
    if (!userName || !sessionId || !sessionData) return;

    const sessionDocRef = doc(db, "sessions", sessionId);
    const docSnap = await getDoc(sessionDocRef);

    if (docSnap.exists()) {
      const sessionData = docSnap.data() as SessionData;
      const updatedItems = sessionData.items.map((item: Item) => {
        if (item.id === itemId) {
          if (item.buyers.includes(userName)) {
            item.buyers = item.buyers.filter(buyer => buyer !== userName);
          } else {
            item.buyers.push(userName);
          }
        }
        return item;
      });

      await setDoc(sessionDocRef, { ...sessionData, items: updatedItems });
    }
  };

  const handleNameUpdate = () => {
    if (inputValue.trim() === "") {
      alert("Please enter a name.");
      return;
    }
    setUserName(inputValue.trim());
    console.log("User name updated to:", inputValue.trim());
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Card className="mx-auto max-w-md md:max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold">TabShare - Session: {sessionId}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Name Input using shadcn Input Component */}
          {!userName && (
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter your name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={handleNameUpdate}>Save</Button>
            </div>
          )}

          {/* Display total information if sessionData is available */}
          {sessionData && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Tip:</span>
                  <span>${sessionData.totalInfo.tip.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Tax:</span>
                  <span>${sessionData.totalInfo.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>You owe:</span>
                  <span>${sessionData.totalInfo.total.toFixed(2)}</span>
                </div>
                <Button className="w-full mt-2">Venmo</Button>
              </CardContent>
            </Card>
          )}

          {/* Display Item List */}
          {items.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center">
                  {/* Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                  </svg>
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
                  <Button className="mt-2" onClick={() => updateItem(item.id)}>Update Item</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
