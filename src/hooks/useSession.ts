// hooks/useSession.ts

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

type Item = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  buyers: string[];
};

type TotalData = {
  total: number;
  tax: number;
  tip: number;
  alias: string;
  people: number;
};

type UseSessionHook = {
  items: Item[];
  totalData: TotalData | null;
  userName: string | null;
  setUserName: (name: string) => void;
  updateItem: (itemId: string) => void;
};

export function useSession(sessionId: string): UseSessionHook {
  const [items, setItems] = useState<Item[]>([]);
  const [totalData, setTotalData] = useState<TotalData | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return; // Wait until sessionId is available

    const sessionDocRef = doc(db, "sessions", sessionId);

    // Real-time listener for session data
    const unsubscribe = onSnapshot(sessionDocRef, (docSnapshot) => {
      const data = docSnapshot.data();
      if (data) {
        setItems(data.items || []);
        setTotalData(data.totalInfo);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [sessionId]);

  const updateItem = async (itemId: string) => {
    if (!userName || !sessionId) return;

    const sessionDocRef = doc(db, "sessions", sessionId);
    const docSnap = await getDoc(sessionDocRef);

    if (docSnap.exists()) {
      const sessionData = docSnap.data();
      const updatedItems = sessionData.items.map((item: Item) => {
        if (item.id === itemId) {
          if (item.buyers.includes(userName)) {
            item.buyers = item.buyers.filter((buyer) => buyer !== userName);
          } else {
            item.buyers.push(userName);
          }
        }
        return item;
      });

      await setDoc(sessionDocRef, { ...sessionData, items: updatedItems });
    }
  };

  return {
    items,
    totalData,
    userName,
    setUserName,
    updateItem,
  };
}
