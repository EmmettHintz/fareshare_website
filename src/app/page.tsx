import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
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
                <span>$4.29 (split 1/3)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Tax:</span>
                <span>$1.89 (split 1/3)</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>You owe:</span>
                <span>$28.66</span>
              </div>
              <Button className="w-full mt-2">Venmo</Button>
            </CardContent>
          </Card>

          {[
            { name: "Traditional Pork & Clams", price: 20.95, quantity: 1, users: ["James", "Zach"] },
            { name: "1 Osso Buco Sp", price: 28.95, quantity: 1, users: ["James", "Emmett"] },
            { name: "House Wines Half Pitcher", price: 18.00, quantity: 1, users: ["James", "Zach", "Emmett"] }
          ].map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                  <div className="font-semibold">Price: ${item.price.toFixed(2)}</div>
                  <div className="flex space-x-2 mt-2">
                    {item.users.map((user, userIndex) => (
                      <Avatar key={userIndex} className="w-8 h-8">
                        <AvatarFallback>{user[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}