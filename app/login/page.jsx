"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"
import Cookies from "js-cookie"
import CustomToast from "@/components/customtoast"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [identifier, setIdentifier] = useState("") // username or mobile
  const [password, setPassword] = useState("")
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true) // New state to track auth check

  // Custom toast states
  const [toast, setToast] = useState({
    message: "",
    type: "error", // 'success' or 'error'
    isVisible: false
  })

  const router = useRouter()

  // Custom toast function
  const showToast = (message, type = "error") => {
    setToast({
      message,
      type,
      isVisible: true
    })

    // Auto hide after 5 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }))
    }, 5000)
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const cookieData = Cookies.get("user_data")
        if (cookieData) {
          // Parse the cookie to validate it's proper JSON
          JSON.parse(cookieData)
          setShowLoadingScreen(true)
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
          return
        }
      } catch (err) {
        console.error("Cookie parsing error:", err)
        // If cookie is corrupted, remove it
        Cookies.remove("user_data")
      }

      // If no valid user data, show login page
      setIsCheckingAuth(false)
    }

    checkAuthStatus()
  }, [router])

  const handleLogin = async () => {
    if (!identifier || !password) {
      showToast("Please fill in all fields", "error")
      return
    }

    setIsLoading(true)
    setShowLoadingScreen(true)

    // Build payload dynamically (if digits → mobile, else → username)
    const payload = /^\d+$/.test(identifier)
      ? { mobile: identifier, password }
      : { username: identifier, password }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON")
      }

      const data = await res.json()
      console.log("🔑 Login Response:", data)

      if (!res.ok) {
        showToast(data.message || "❌ Login failed", "error")
        setShowLoadingScreen(false)
        return
      }

      if (data.success) {
        if (rememberMe) {
          Cookies.set("user_data", JSON.stringify(data), { expires: 7 })
        } else {
          Cookies.set("user_data", JSON.stringify(data), { expires: 1 })
        }

        showToast("✅ Login successful!", "success")
        // Keep loading screen visible while redirecting
        setTimeout(() => router.push("/dashboard"), 2000)
      } else {
        showToast(data.message || "❌ Login failed", "error")
        setShowLoadingScreen(false)
      }
    } catch (err) {
      console.error("❌ Login error:", err)
      showToast("Something went wrong. Please try again.", "error")
      setShowLoadingScreen(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading screen while checking authentication or during login
  if (isCheckingAuth || showLoadingScreen) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <div className="text-sm text-muted-foreground">
            {isCheckingAuth ? "Checking authentication..." : "Signing you in..."}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Custom Toast Component */}
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="min-h-screen flex bg-background">
        {/* Left Side */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">

            <Card className="">
              <CardHeader className="text-center pb-3 pt-8">
                <Image
                  src="/logos/logo.png"
                  alt="One Network Logo"
                  width={200}
                  height={100}
                  className="mx-auto mb-4"
                />
                <p className="text-sm text-muted-foreground">Sign in with your account</p>
              </CardHeader>

              <CardContent className="px-6 pb-8">
                <div className="space-y-4">
                  {/* Username or Mobile */}
                  <div className="space-y-2">
                    <Label htmlFor="identifier" className="text-sm font-medium">Username or Mobile</Label>
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="Enter your username or mobile"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="h-12 px-4"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-12 h-12 px-4"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-md"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2.5">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(val) => setRememberMe(!!val)}
                        className="h-5 w-5"
                      />
                      <Label htmlFor="remember" className="text-sm font-medium cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm font-medium p-0 h-auto"
                    >
                      Forgot password?
                    </Button>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 font-medium rounded-lg mt-4"
                    onClick={handleLogin}
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 text-2xl font-bold animate-spin mx-auto" /> : "Sign in"}
                  </Button>
                </div>
              </CardContent>
            </Card> </div>
        </div>

        {/* Right Side Image */}
        <div className="hidden lg:flex flex-1 relative">
          <Image
            src="/images/sideimage.png"
            alt="Network dashboard illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </>
  )
}