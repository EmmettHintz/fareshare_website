"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { doc, getDoc, setDoc, onSnapshot, updateDoc, deleteField } from "firebase/firestore"
import { db } from "@/lib/firebaseConfig"
import { Loader2, DollarSign, Users, AlertTriangle, LogOut, CreditCard } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { v4 as uuidv4 } from 'uuid'

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
  activeUsers: { [userId: string]: string }
}

export default function SessionPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = params
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")
  const [nameInput, setNameInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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
  }, [userId, sessionId, userName])

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
      await updateDoc(sessionDocRef, {
        [`activeUsers.${userId}`]: deleteField()
      })

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

      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
      setUserId(null)
      setUserName("")

      router.push('/')
    } catch (err) {
      console.error("Error leaving session:", err)
      setError("Failed to leave session")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-[#6A7573]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <Alert variant="destructive" className="max-w-md bg-[#DBFACB] border-[#6A7573] text-[#6A7573]">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md bg-white shadow-lg border-[#DBFACB]">
            <CardHeader className="text-center bg-[#DBFACB] rounded-t-lg">
              <CardTitle className="text-3xl font-bold text-[#6A7573]">Welcome to TabShare</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <Input
                type="text"
                placeholder="Enter your name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="bg-white border-[#DBFACB] focus:ring-[#6A7573] focus:border-[#6A7573] text-[#6A7573] text-lg"
              />
              <Button 
                onClick={handleJoinSession} 
                className="w-full bg-[#DBFACB] hover:bg-[#C7E6B8] text-[#6A7573] text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Join Session
              </Button>
              {error && <p className="text-[#6A7573] text-sm">{error}</p>}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl bg-white shadow-lg border-[#DBFACB]">
          <CardHeader className="text-center bg-[#DBFACB] rounded-t-lg flex flex-col items-center">
            <CardTitle className="text-4xl md:text-5xl font-bold text-[#6A7573] mb-2">TabShare</CardTitle>
            <p className="text-[#6A7573] text-lg">Session: {sessionId}</p>
            <p className="text-[#6A7573] text-xl font-semibold mt-2">Welcome, {userName}!</p>
            <Button 
              onClick={handleLeaveSession} 
              variant="outline" 
              className="mt-4 text-[#6A7573] border-[#6A7573] hover:bg-[#6A7573] hover:text-white transition-all duration-300 ease-in-out"
            >
              <LogOut className="mr-2 h-4 w-4" /> Leave Session
            </Button>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            {sessionData && sessionData.activeUsers && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-[#DBFACB] p-6 rounded-lg shadow-md"
              >
                <h3 className="text-[#6A7573] font-semibold text-xl mb-4">Active Users</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(sessionData.activeUsers).map(([userId, name]) => (
                    <Avatar key={userId} className="w-10 h-10 bg-white text-[#6A7573] border-2 border-[#6A7573] transition-all duration-300 ease-in-out hover:scale-110">
                      <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </motion.div>
            )}

            {sessionData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="bg-[#DBFACB] border-[#6A7573] shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold text-[#6A7573]">Tip:</span>
                      <span className="text-[#6A7573]">${sessionData.totalInfo.tip.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold text-[#6A7573]">Tax:</span>
                      <span className="text-[#6A7573]">${sessionData.totalInfo.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl font-bold">
                      <span className="text-[#6A7573]">You owe:</span>
                      <span className="text-[#6A7573]">${sessionData.totalInfo.total.toFixed(2)}</span>
                    </div>
                    <Button className="w-full mt-6 bg-[#6A7573] hover:bg-[#5A6563] text-white text-lg font-semibold py-3 transition-all duration-300 ease-in-out transform hover:scale-105">
                      <DollarSign className="mr-2 h-5 w-5" /> Pay with Venmo
                    </Button>
                    <Button variant="outline" className="w-full mt-2 border-[#6A7573] text-[#6A7573] hover:bg-[#6A7573] hover:text-white text-lg font-semibold py-3 transition-all duration-300 ease-in-out">
                      <CreditCard className="mr-2 h-5 w-5" /> Pay with Card
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-[#6A7573] mb-4">Items</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="flex flex-col justify-between bg-white border-[#DBFACB]">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-[#DBFACB] rounded-full flex items-center justify-center text-[#6A7573]">
                              <Users className="h-8 w-8" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-xl text-[#6A7573]">{item.name}</h3>
                              <div className="text-sm text-[#6A7573]">Qty: {item.quantity}</div>
                            </div>
                          </div>
                          <div className="font-semibold text-2xl text-[#6A7573]">${item.price.toFixed(2)}</div>
                          <div className="flex flex-wrap gap-2">
                            {item.buyers.map((buyerId: string, buyerIndex: number) => {
                              const buyerName = sessionData?.activeUsers[buyerId] || "Unknown"
                              return (
                                <Avatar key={buyerIndex} className="w-8 h-8 bg-[#DBFACB] text-[#6A7573]">
                                  <AvatarFallback>{buyerName[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                              )
                            })}
                          </div>
                          <Button 
                            className="w-full text-[#6A7573] text-lg font-semibold py-3 transition-all duration-300 ease-in-out transform hover:scale-105" 
                            variant={item.buyers.includes(userId) ? "default" : "outline"}
                            onClick={() => updateItem(item.id)}
                            style={{
                              backgroundColor: item.buyers.includes(userId) ? '#DBFACB' : 'white',
                              color: '#6A7573',
                              borderColor: '#DBFACB'
                            }}
                          >
                            {item.buyers.includes(userId) ? "Remove" : "Add"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}