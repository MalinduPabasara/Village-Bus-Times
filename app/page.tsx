"use client"

import { useState, useEffect } from "react"
import { Clock, Bus, MapPin, Bell, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

// Bus schedule data
const busSchedule = {
  galle: [
    { time: "04:10", operator: "Private" },
    { time: "04:40", operator: "CTB" },
    { time: "05:40", operator: "CTB" },
    { time: "06:10", operator: "CTB" },
    { time: "06:35", operator: "CTB" },
    { time: "07:00", operator: "CTB" },
    { time: "07:45", operator: "Private" },
    { time: "08:25", operator: "Private" },
    { time: "10:30", operator: "CTB" },
    { time: "11:20", operator: "CTB" },
    { time: "11:50", operator: "Private" },
    { time: "12:45", operator: "Private" },
    { time: "13:25", operator: "CTB" },
    { time: "15:05", operator: "Private" },
    { time: "16:40", operator: "CTB" },
  ],
  udugama: [
    { time: "04:55", operator: "Private" },
    { time: "05:15", operator: "Private" },
    { time: "07:20", operator: "CTB" },
    { time: "08:05", operator: "CTB" },
    { time: "08:45", operator: "CTB" },
    { time: "09:10", operator: "Private" },
    { time: "09:35", operator: "CTB" },
    { time: "10:00", operator: "Private" },
    { time: "10:55", operator: "Private" },
    { time: "12:20", operator: "CTB" },
    { time: "13:10", operator: "CTB" },
    { time: "13:40", operator: "CTB" },
    { time: "14:10", operator: "Private" },
    { time: "14:40", operator: "CTB" },
    { time: "15:30", operator: "Private" },
    { time: "15:55", operator: "CTB" },
    { time: "16:10", operator: "CTB" },
    { time: "17:05", operator: "Private" },
    { time: "17:35", operator: "CTB" },
    { time: "18:20", operator: "CTB" },
  ],
  dellawa: [
    { time: "06:30", operator: "Private" },
    { time: "06:50", operator: "CTB" },
    { time: "07:30", operator: "Private" },
    { time: "07:50", operator: "CTB" },
    { time: "08:15", operator: "Private" },
    { time: "08:40", operator: "CTB" },
    { time: "09:05", operator: "Private" },
    { time: "09:50", operator: "CTB" },
    { time: "10:10", operator: "Private" },
    { time: "11:10", operator: "Private" },
    { time: "11:50", operator: "Private" },
    { time: "12:20", operator: "CTB" },
    { time: "13:10", operator: "Private" },
    { time: "13:40", operator: "CTB" },
    { time: "14:05", operator: "CTB" },
    { time: "14:25", operator: "Private" },
    { time: "14:40", operator: "Private" },
    { time: "15:05", operator: "CTB" },
    { time: "15:30", operator: "CTB" },
    { time: "15:50", operator: "Private" },
    { time: "16:20", operator: "CTB" },
    { time: "16:45", operator: "Private" },
    { time: "17:10", operator: "CTB" },
    { time: "17:35", operator: "Private" },
    { time: "18:35", operator: "CTB" },
    { time: "19:25", operator: "CTB" },
    { time: "20:20", operator: "CTB" },
    { time: "21:40", operator: "CTB" },
  ],
}

// Location arrival time adjustments (in minutes)
const locationAdjustments = {
  neluwa: { galle: 0, udugama: 0, dellawa: 0 },
  mawanana: { galle: 5, udugama: 10, dellawa: -5 },
  suduallawa: { galle: 15, udugama: 20, dellawa: -10 },
  habarkada: { galle: 20, udugama: 25, dellawa: -20 },
  thawalama: { galle: 30, udugama: 35, dellawa: -30 },
}

// Location display names
const locationNames = {
  neluwa: "Neluwa",
  mawanana: "Mawanana",
  suduallawa: "Suduallawa",
  habarkada: "Habarkada",
  thawalama: "Thawalama",
}

// Route display names and colors
const routeInfo = {
  galle: { name: "Galle", color: "bg-emerald-500" },
  udugama: { name: "Udugama", color: "bg-blue-500" },
  dellawa: { name: "Dellawa", color: "bg-amber-500" },
}

// Parse time string to minutes since midnight
function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number)
  return hours * 60 + minutes
}

// Format minutes since midnight to time string
function formatMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

export default function Home() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [location, setLocation] = useState<string>("neluwa")
  const [filter, setFilter] = useState<string>("all")
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false)
  const [leadTime, setLeadTime] = useState<number>(10)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Check for dark mode preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(prefersDark)

      if (prefersDark) {
        document.documentElement.classList.add("dark")
      }
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  // Calculate arrival time based on location and route
  const calculateArrivalTime = (departureTime: string, route: string): string => {
    const departureMinutes = parseTimeToMinutes(departureTime)
    const adjustmentMinutes =
      locationAdjustments[location as keyof typeof locationAdjustments][
        route as keyof (typeof locationAdjustments)[typeof location]
      ]
    const arrivalMinutes = departureMinutes + adjustmentMinutes
    return formatMinutesToTime(arrivalMinutes)
  }

  // Get current time in minutes since midnight
  const getCurrentTimeInMinutes = (): number => {
    return currentTime.getHours() * 60 + currentTime.getMinutes()
  }

  // Find next buses based on filter
  const getNextBuses = () => {
    const currentMinutes = getCurrentTimeInMinutes()
    const allBuses: any[] = []

    // Combine all routes with route name
    Object.entries(busSchedule).forEach(([route, buses]) => {
      if (
        filter === "all" ||
        filter === route ||
        (filter === "ctb" && buses.some((bus) => bus.operator === "CTB")) ||
        (filter === "private" && buses.some((bus) => bus.operator === "Private"))
      ) {
        buses.forEach((bus) => {
          if (filter === "ctb" && bus.operator !== "CTB") return
          if (filter === "private" && bus.operator !== "Private") return

          const departureMinutes = parseTimeToMinutes(bus.time)
          const adjustmentMinutes =
            locationAdjustments[location as keyof typeof locationAdjustments][
              route as keyof (typeof locationAdjustments)[typeof location]
            ]
          const arrivalMinutes = departureMinutes + adjustmentMinutes

          allBuses.push({
            route,
            departureTime: bus.time,
            arrivalTime: formatMinutesToTime(arrivalMinutes),
            operator: bus.operator,
            departureMinutes,
            arrivalMinutes,
          })
        })
      }
    })

    // Sort by arrival time
    allBuses.sort((a, b) => a.arrivalMinutes - b.arrivalMinutes)

    // Find the next buses after current time
    let nextBuses = allBuses.filter((bus) => bus.arrivalMinutes > currentMinutes)

    // If no buses are found for today, show the first buses for tomorrow
    if (nextBuses.length === 0 && allBuses.length > 0) {
      nextBuses = allBuses.slice(0, 2)
    }

    // Limit to next 5 buses
    return nextBuses.slice(0, 5)
  }

  // Format time for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get minutes until arrival
  const getMinutesUntil = (timeStr: string): number => {
    const targetMinutes = parseTimeToMinutes(timeStr)
    const currentMinutes = getCurrentTimeInMinutes()
    return targetMinutes - currentMinutes
  }

  // Format minutes until arrival for display
  const formatMinutesUntil = (minutes: number): string => {
    if (minutes <= 0) return "Departed"

    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins} min`
  }

  // Get next buses
  const nextBuses = getNextBuses()

  return (
    <div
      className={`min-h-screen bg-background text-foreground bg-[url('https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=2070')] bg-fixed bg-cover`}
    >
      {/* Current Time Display */}
      <div className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            <div>
              <div className="text-xl font-bold">{formatTime(currentTime)}</div>
              <div className="text-xs">{formatDate(currentTime)}</div>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={toggleDarkMode} className="bg-primary-foreground/10">
            {isDarkMode ? "☀️" : "🌙"}
          </Button>
        </div>
      </div>

      <main className="container mx-auto p-4 space-y-6 relative z-10 backdrop-blur-sm bg-background/70 rounded-lg my-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <div className="relative w-12 h-12 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5">
            <div className="absolute inset-0 flex items-center justify-center">
              <Bus className="h-6 w-6 text-white" />
            </div>
          </div>
          Village Bus Notification App
        </h1>

        {/* Location Selection */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Your Current Location
            </CardTitle>
            <div className="grid grid-cols-5 gap-2 mt-4 mb-2">
              <div
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                  location === "neluwa" ? "ring-2 ring-primary scale-105" : "opacity-70 hover:opacity-100"
                }`}
                onClick={() => setLocation("neluwa")}
              >
                <img
                  src="https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?q=80&w=1974"
                  alt="Neluwa"
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-1">
                  <span className="text-white text-xs font-medium">Neluwa</span>
                </div>
              </div>
              <div
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                  location === "mawanana" ? "ring-2 ring-primary scale-105" : "opacity-70 hover:opacity-100"
                }`}
                onClick={() => setLocation("mawanana")}
              >
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070"
                  alt="Mawanana"
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-1">
                  <span className="text-white text-xs font-medium">Mawanana</span>
                </div>
              </div>
              <div
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                  location === "suduallawa" ? "ring-2 ring-primary scale-105" : "opacity-70 hover:opacity-100"
                }`}
                onClick={() => setLocation("suduallawa")}
              >
                <img
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070"
                  alt="Suduallawa"
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-1">
                  <span className="text-white text-xs font-medium">Suduallawa</span>
                </div>
              </div>
              <div
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                  location === "habarkada" ? "ring-2 ring-primary scale-105" : "opacity-70 hover:opacity-100"
                }`}
                onClick={() => setLocation("habarkada")}
              >
                <img
                  src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070"
                  alt="Habarkada"
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-1">
                  <span className="text-white text-xs font-medium">Habarkada</span>
                </div>
              </div>
              <div
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                  location === "thawalama" ? "ring-2 ring-primary scale-105" : "opacity-70 hover:opacity-100"
                }`}
                onClick={() => setLocation("thawalama")}
              >
                <img
                  src="https://images.unsplash.com/photo-1510797215324-95aa89f43c33?q=80&w=2035"
                  alt="Thawalama"
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-1">
                  <span className="text-white text-xs font-medium">Thawalama</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your location" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(locationNames).map(([key, name]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Bus Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex-1">
                Receive alerts before buses reach your location
              </Label>
              <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadTime">Notification lead time</Label>
              <Select
                value={leadTime.toString()}
                onValueChange={(value) => setLeadTime(Number.parseInt(value))}
                disabled={!notificationsEnabled}
              >
                <SelectTrigger id="leadTime">
                  <SelectValue placeholder="Select lead time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes before arrival</SelectItem>
                  <SelectItem value="10">10 minutes before arrival</SelectItem>
                  <SelectItem value="15">15 minutes before arrival</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Bus className="h-4 w-4" />
              Upcoming Buses
            </TabsTrigger>
            <TabsTrigger value="timetable" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Full Timetable
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Buses Tab */}
          <TabsContent value="upcoming" className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
              <div
                className={`cursor-pointer rounded-lg overflow-hidden relative h-16 bg-slate-200 hover:bg-slate-300 transition-colors ${
                  filter === "all" ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setFilter("all")}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-medium text-sm">All Routes</span>
                </div>
              </div>

              <div
                className={`cursor-pointer rounded-lg overflow-hidden relative h-16 bg-emerald-200 hover:bg-emerald-300 transition-colors ${
                  filter === "galle" ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setFilter("galle")}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-medium text-sm">Galle</span>
                </div>
              </div>

              <div
                className={`cursor-pointer rounded-lg overflow-hidden relative h-16 bg-blue-200 hover:bg-blue-300 transition-colors ${
                  filter === "udugama" ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setFilter("udugama")}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-medium text-sm">Udugama</span>
                </div>
              </div>

              <div
                className={`cursor-pointer rounded-lg overflow-hidden relative h-16 bg-amber-200 hover:bg-amber-300 transition-colors ${
                  filter === "dellawa" ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setFilter("dellawa")}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-medium text-sm">Dellawa</span>
                </div>
              </div>

              <div
                className={`cursor-pointer rounded-lg overflow-hidden relative h-16 bg-sky-200 hover:bg-sky-300 transition-colors ${
                  filter === "ctb" ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setFilter("ctb")}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-medium text-sm">CTB Only</span>
                </div>
              </div>

              <div
                className={`cursor-pointer rounded-lg overflow-hidden relative h-16 bg-rose-200 hover:bg-rose-300 transition-colors ${
                  filter === "private" ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setFilter("private")}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-medium text-sm">Private Only</span>
                </div>
              </div>
            </div>

            {/* Next Buses List */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Next Available Buses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {nextBuses.length > 0 ? (
                  nextBuses.map((bus, index) => {
                    const minutesUntilDeparture = getMinutesUntil(bus.departureTime)
                    const minutesUntilArrival = getMinutesUntil(bus.arrivalTime)
                    const routeData = routeInfo[bus.route as keyof typeof routeInfo]

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border relative overflow-hidden"
                      >
                        <div
                          className="absolute inset-0 opacity-10"
                          style={{
                            background: `linear-gradient(135deg, ${
                              bus.route === "galle" ? "#10b981" : bus.route === "udugama" ? "#3b82f6" : "#f59e0b"
                            } 0%, transparent 70%)`,
                          }}
                        ></div>

                        <div className="space-y-1 relative z-10">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{
                                background:
                                  bus.route === "galle" ? "#10b981" : bus.route === "udugama" ? "#3b82f6" : "#f59e0b",
                              }}
                            >
                              <Bus className="h-4 w-4 text-white" />
                            </div>
                            <Badge className={`${routeData.color} text-white`}>{routeData.name}</Badge>
                            <Badge variant={bus.operator === "CTB" ? "default" : "destructive"}>{bus.operator}</Badge>
                          </div>
                          <div className="font-medium">Departs Neluwa: {bus.departureTime}</div>
                          <div className="text-primary font-medium">
                            Arrives at {locationNames[location as keyof typeof locationNames]}: {bus.arrivalTime}
                          </div>
                        </div>
                        <div className="text-right relative z-10">
                          <div className="text-sm text-muted-foreground">
                            {minutesUntilDeparture <= 0
                              ? "En route"
                              : `Departs in ${formatMinutesUntil(minutesUntilDeparture)}`}
                          </div>
                          <div className="font-bold">
                            {minutesUntilArrival <= 0
                              ? "Arrived"
                              : `Arrives in ${formatMinutesUntil(minutesUntilArrival)}`}
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No buses available with the current filter.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Full Timetable Tab */}
          <TabsContent value="timetable">
            <Card>
              <CardHeader>
                <CardTitle>Complete Bus Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th colSpan={2} className="bg-emerald-500 text-white p-2 text-center">
                          Galle
                        </th>
                        <th colSpan={2} className="bg-blue-500 text-white p-2 text-center">
                          Udugama
                        </th>
                        <th colSpan={2} className="bg-amber-500 text-white p-2 text-center">
                          Dellawa
                        </th>
                      </tr>
                      <tr>
                        <th className="border p-2">Time</th>
                        <th className="border p-2">Type</th>
                        <th className="border p-2">Time</th>
                        <th className="border p-2">Type</th>
                        <th className="border p-2">Time</th>
                        <th className="border p-2">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({
                        length: Math.max(
                          busSchedule.galle.length,
                          busSchedule.udugama.length,
                          busSchedule.dellawa.length,
                        ),
                      }).map((_, i) => (
                        <tr key={i} className="even:bg-muted/50">
                          {/* Galle */}
                          <td className="border p-2">{busSchedule.galle[i]?.time || ""}</td>
                          <td className="border p-2">
                            {busSchedule.galle[i]?.operator === "CTB" ? (
                              <Badge variant="default">CTB</Badge>
                            ) : busSchedule.galle[i]?.operator === "Private" ? (
                              <Badge variant="destructive">Private</Badge>
                            ) : (
                              ""
                            )}
                          </td>

                          {/* Udugama */}
                          <td className="border p-2">{busSchedule.udugama[i]?.time || ""}</td>
                          <td className="border p-2">
                            {busSchedule.udugama[i]?.operator === "CTB" ? (
                              <Badge variant="default">CTB</Badge>
                            ) : busSchedule.udugama[i]?.operator === "Private" ? (
                              <Badge variant="destructive">Private</Badge>
                            ) : (
                              ""
                            )}
                          </td>

                          {/* Dellawa */}
                          <td className="border p-2">{busSchedule.dellawa[i]?.time || ""}</td>
                          <td className="border p-2">
                            {busSchedule.dellawa[i]?.operator === "CTB" ? (
                              <Badge variant="default">CTB</Badge>
                            ) : busSchedule.dellawa[i]?.operator === "Private" ? (
                              <Badge variant="destructive">Private</Badge>
                            ) : (
                              ""
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-muted p-4 text-center text-sm text-muted-foreground">
        <p>© 2025 Village Bus Notification App. All rights reserved.</p>
      </footer>
    </div>
  )
}

