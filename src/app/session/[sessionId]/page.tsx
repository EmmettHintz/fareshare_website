"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation' // Import useRouter for navigation
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { doc, getDoc, setDoc, onSnapshot, updateDoc, deleteField } from "firebase/firestore"
import { db } from "@/lib/firebaseConfig"
import { Loader2, DollarSign, Users, AlertTriangle, LogOut } from "lucide-react" // Import LogOut icon
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { v4 as uuidv4 } from 'uuid' // Import UUID
import { arrayUnion, arrayRemove } from "firebase/firestore"

type Item = {
  id: string
  name: string
  price: number
  quantity: number
  buyers: string[]
  people: number
}

type TotalInfo = {
  total: number
  tax: number
  tip: number
}

type SessionData = {
  items: Item[]
  totalInfo: TotalInfo
  alias: string
  activeUsers: { [userId: string]: string } // Updated to a map
}

export default function SessionPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = params
  const router = useRouter() // Initialize router
  const [items, setItems] = useState<Item[]>([])
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [userId, setUserId] = useState<string | null>(null) // New state for userId
  const [userName, setUserName] = useState<string>("") // Initialize as empty string
  const [nameInput, setNameInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for stored userId and userName in localStorage
    const storedUserId = localStorage.getItem('userId')
    const storedUserName = localStorage.getItem('userName')
    if (storedUserId && storedUserName) {
      setUserId(storedUserId)
      setUserName(storedUserName)
    }
  }, [])

  useEffect(() => {
    if (!sessionId) {
      setError("Session ID is missing")
      setIsLoading(false)
      return
    }

    const sessionDocRef = doc(db, "sessions", sessionId)

    const unsubscribe = onSnapshot(
      sessionDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as SessionData
          setSessionData(data)
          setItems(data.items)
        } else {
          setError("Session not found")
        }
        setIsLoading(false)
      },
      (err) => {
        console.error("Error fetching session data:", err)
        setError("Failed to load session data")
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [sessionId])

  useEffect(() => {
    if (userId && sessionId) {
      const sessionDocRef = doc(db, "sessions", sessionId)

      // Add user to activeUsers
      const addActiveUser = async () => {
        try {
          await updateDoc(sessionDocRef, {
            [`activeUsers.${userId}`]: userName
          })
        } catch (err) {
          console.error("Error adding active user:", err)
        }
      }

      addActiveUser()

      // Remove user from activeUsers on cleanup
      return () => {
        const removeActiveUser = async () => {
          try {
            await updateDoc(sessionDocRef, {
              [`activeUsers.${userId}`]: deleteField()
            })
          } catch (err) {
            console.error("Error removing active user:", err)
          }
        }
        removeActiveUser()
      }
    }
  }, [userId, sessionId])

  const updateItem = async (itemId: string) => {
    if (!userId || !sessionId || !sessionData) {
      setError("Unable to update item. Please check your connection and try again.")
      return
    }

    try {
      const sessionDocRef = doc(db, "sessions", sessionId)
      const docSnap = await getDoc(sessionDocRef)

      if (docSnap.exists()) {
        const sessionData = docSnap.data() as SessionData
        const updatedItems = sessionData.items.map((item: Item) => {
          if (item.id === itemId) {
            if (item.buyers.includes(userId)) {
              item.buyers = item.buyers.filter(buyerId => buyerId !== userId)
            } else {
              item.buyers.push(userId)
            }
          }
          return item
        })

        await setDoc(sessionDocRef, { ...sessionData, items: updatedItems })
      } else {
        setError("Session not found")
      }
    } catch (err) {
      console.error("Error updating item:", err)
      setError("Failed to update item")
    }
  }

  const handleJoinSession = () => {
    if (nameInput.trim() === "") {
      setError("Please enter your name.")
      return
    }
    const newUserId = uuidv4()
    setUserName(nameInput.trim())
    setUserId(newUserId)
    localStorage.setItem('userId', newUserId)
    localStorage.setItem('userName', nameInput.trim())
    setError(null)
  }

  const handleLeaveSession = async () => {
    if (!userId || !sessionId) return

    const confirmLeave = window.confirm("Are you sure you want to leave the session?")
    if (!confirmLeave) return

    const sessionDocRef = doc(db, "sessions", sessionId)
    try {
      // Remove user from activeUsers
      await updateDoc(sessionDocRef, {
        [`activeUsers.${userId}`]: deleteField()
      })

      // Remove user from any items they are associated with
      const docSnap = await getDoc(sessionDocRef)
      if (docSnap.exists()) {
        const sessionData = docSnap.data() as SessionData
        const updatedItems = sessionData.items.map((item: Item) => {
          if (item.buyers.includes(userId)) {
            item.buyers = item.buyers.filter(buyerId => buyerId !== userId)
          }
          return item
        })
        await setDoc(sessionDocRef, { ...sessionData, items: updatedItems })
      }

      // Clear user data from localStorage and state
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
      setUserId(null)
      setUserName("")

      // Redirect to join session page or home page
      router.push('/') // Redirect to home page or any other page
    } catch (err) {
      console.error("Error leaving session:", err)
      setError("Failed to leave session")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf4ed]">
        <Loader2 className="h-8 w-8 animate-spin text-[#575279]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf4ed] p-4">
        <Alert variant="destructive" className="max-w-md bg-[#fffaf3] border-[#b4637a] text-[#575279]">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#faf4ed] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#fffaf3] shadow-lg border-[#dfdad9]">
          <CardHeader className="text-center bg-[#f2e9e1] rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-[#575279]">Welcome to TabShare</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Input
              type="text"
              placeholder="Enter your name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="bg-[#fffaf3] border-[#cecacd] focus:ring-[#907aa9] focus:border-[#907aa9] text-[#575279]"
            />
            <Button onClick={handleJoinSession} className="w-full bg-[#286983] hover:bg-[#56949f] text-[#fffaf3]">
              Join Session
            </Button>
            {error && <p className="text-[#b4637a] text-sm">{error}</p>}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf4ed] p-4 md:p-8">
      <Card className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl bg-[#fffaf3] shadow-lg border-[#dfdad9]">
        <CardHeader className="text-center bg-[#f2e9e1] rounded-t-lg flex flex-col items-center">
          <CardTitle className="text-3xl md:text-4xl font-bold text-[#575279]">TabShare</CardTitle>
          <p className="text-[#797593]">Session: {sessionId}</p>
          <p className="text-[#797593]">Welcome, {userName}!</p>
          {/* Leave Session Button */}
          <Button onClick={handleLeaveSession} variant="outline" className="mt-2 text-[#b4637a] border-[#b4637a]">
            <LogOut className="mr-2 h-4 w-4" /> Leave Session
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {sessionData && sessionData.activeUsers && (
            <div className="bg-[#f2e9e1] p-4 rounded-lg">
              <h3 className="text-[#575279] font-semibold mb-2">Active Users</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(sessionData.activeUsers).map(([userId, name]) => (
                  <Avatar key={userId} className="w-8 h-8 bg-[#fffaf3] text-[#575279]">
                    <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          )}

          {sessionData && (
            <Card className="bg-[#f2e9e1] border-[#dfdad9]">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#575279]">Tip:</span>
                  <span className="text-[#56949f]">${sessionData.totalInfo.tip.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#575279]">Tax:</span>
                  <span className="text-[#56949f]">${sessionData.totalInfo.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-[#575279]">You owe:</span>
                  <span className="text-[#56949f]">${sessionData.totalInfo.total.toFixed(2)}</span>
                </div>
                <Button className="w-full mt-4 bg-[#286983] hover:bg-[#56949f] text-[#fffaf3]">
                  <DollarSign className="mr-2 h-4 w-4" /> Pay with Venmo
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <Card key={index} className="flex flex-col justify-between bg-[#fffaf3] border-[#dfdad9]">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#f2e9e1] rounded-md flex items-center justify-center text-[#575279]">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#575279]">{item.name}</h3>
                      <div className="text-sm text-[#797593]">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-semibold text-lg text-[#56949f]">${item.price.toFixed(2)}</div>
                  <div className="flex flex-wrap gap-2">
                    {item.buyers.map((buyerId: string, buyerIndex: number) => {
                      const buyerName = sessionData?.activeUsers[buyerId] || "Unknown"
                      return (
                        <Avatar key={buyerIndex} className="w-8 h-8 bg-[#f2e9e1] text-[#575279]">
                          <AvatarFallback>{buyerName[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                      )
                    })}
                  </div>
                  <Button 
                    className="w-full text-[#fffaf3]" 
                    variant={item.buyers.includes(userId) ? "default" : "outline"}
                    onClick={() => updateItem(item.id)}
                    style={{
                      backgroundColor: item.buyers.includes(userId) ? '#286983' : '#fffaf3',
                      color: item.buyers.includes(userId) ? '#fffaf3' : '#286983',
                      borderColor: '#286983'
                    }}
                  >
                    {item.buyers.includes(userId) ? "Remove" : "Add"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}