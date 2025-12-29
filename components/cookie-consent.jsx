"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cookie, X } from "lucide-react"

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShowConsent(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setShowConsent(false)
  }

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined")
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="border-border shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Cookie className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <h4 className="font-semibold text-sm">Cookie Preferences</h4>
              <p className="text-xs text-muted-foreground">
                We use cookies to enhance your experience and provide secure access to our ISP management platform.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" onClick={acceptCookies} className="text-xs">
                  Accept
                </Button>
                <Button size="sm" variant="outline" onClick={declineCookies} className="text-xs bg-transparent">
                  Decline
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={declineCookies} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
