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
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showLoadingScreen, setShowLoadingScreen] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const [toast, setToast] = useState({
    message: "",
    type: "error",
    isVisible: false
  })

  const router = useRouter()

  const showToast = (message, type = "error") => {
    setToast({
      message,
      type,
      isVisible: true
    })

    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }))
    }, 5000)
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const cookieData = Cookies.get("user_data")
        const token = Cookies.get("auth_token")
        
        if (cookieData && token) {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/validate_token.php`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            })
            
            const data = await res.json()
            
            if (data.valid) {
              setShowLoadingScreen(true)
              setTimeout(() => {
                router.push("/dashboard")
              }, 1000)
              return
            } else {
              Cookies.remove("user_data")
              Cookies.remove("auth_token")
            }
          } catch (err) {
            console.error("Token validation error:", err)
            Cookies.remove("user_data")
            Cookies.remove("auth_token")
          }
        }
      } catch (err) {
        console.error("Auth check error:", err)
        Cookies.remove("user_data")
        Cookies.remove("auth_token")
      }

      setIsCheckingAuth(false)
    }

    checkAuthStatus()
  }, [router])

  const handleLogin = async (e) => {
    if (e) e.preventDefault()
    
    if (!identifier || !password) {
      showToast("Please fill in all fields", "error")
      return
    }

    setIsLoading(true)
    setShowLoadingScreen(true)

    const payload = { password }
    
    if (/^\d+$/.test(identifier)) {
      payload.mobile = identifier
    } else if (identifier.includes('@')) {
      payload.email = identifier
    } else {
      payload.username = identifier
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format")
      }

      const data = await res.json()
      console.log("🔑 Login Response:", data)

      if (!res.ok) {
        throw new Error(data.message || "Login failed")
      }

      if (data.success && data.user) {
        const userData = {
          user: data.user,
          token: data.token || data.user.token,
          timestamp: new Date().toISOString()
        }
        
        const expires = rememberMe ? 7 : 1
        
        Cookies.set("user_data", JSON.stringify(userData.user), { expires })
        Cookies.set("auth_token", userData.token, { expires })
        
        if (typeof window !== 'undefined') {
          localStorage.setItem("user_data", JSON.stringify(userData.user))
          localStorage.setItem("auth_token", userData.token)
        }
        
        showToast("✅ Login successful!", "success")
        
        const redirectPath = data.user.role === 'admin' ? '/admin/dashboard' : '/dashboard'
        setTimeout(() => router.push(redirectPath), 1500)
        
      } else {
        throw new Error(data.message || "Invalid credentials")
      }
      
    } catch (err) {
      console.error("❌ Login error:", err)
      showToast(err.message || "Something went wrong. Please try again.", "error")
      setShowLoadingScreen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  if (isCheckingAuth || showLoadingScreen) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
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
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="min-h-screen flex bg-background">
        {/* Mobile Layout Only */}
        <div className="block lg:hidden w-full min-h-screen flex flex-col">
          {/* Logo Section - Top */}
          <div className="pt-8 px-6 pb-4">
            <Image
              src="/logos/logo.png"
              alt="One Network Logo"
              width={160}
              height={80}
              className="mx-auto"
              priority
            />
            <p className="text-center text-sm text-muted-foreground mt-2">
              Sign in with your account
            </p>
          </div>
          
          {/* Centered Form Container - Takes remaining space */}
          <div className="flex-1 flex items-center justify-center px-4 pb-6">
            <div className="w-full max-w-md">
              <Card className="border-border/50 shadow-sm">
                <CardContent className="px-5 py-6">
                  <form onSubmit={handleLogin} onKeyDown={handleKeyPress}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="identifier" className="text-sm font-medium">
                          Username, Email or Mobile
                        </Label>
                        <Input
                          id="identifier"
                          type="text"
                          placeholder="Enter username, email or mobile"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="h-12 px-4"
                          autoComplete="username"
                          required
                        />
                      </div>

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
                            autoComplete="current-password"
                            required
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

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 font-medium rounded-lg mt-4"
                      >
                        {isLoading ? <Loader2 className="h-5 w-5 text-2xl font-bold animate-spin mx-auto" /> : "Sign in"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Mobile Footer Links - Below the centered form */}
              <div className="mt-8 text-center">
                <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground mb-3">
                  <Link 
                    href="/terms" 
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <span className="text-border">•</span>
                  <Link 
                    href="/privacy" 
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <span className="text-border">•</span>
                  <Link 
                    href="/cookie-policy" 
                    className="hover:text-foreground transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground/70">
                  © {new Date().getFullYear()} One Network. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - UNCHANGED from original */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <Card>
              <CardHeader className="text-center pb-3 pt-8">
                <Image
                  src="/logos/logo.png"
                  alt="One Network Logo"
                  width={200}
                  height={100}
                  className="mx-auto mb-4"
                  priority
                />
                <p className="text-sm text-muted-foreground">Sign in with your account</p>
              </CardHeader>

              <CardContent className="px-6 pb-8">
                <form onSubmit={handleLogin} onKeyDown={handleKeyPress}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="identifier" className="text-sm font-medium">
                        Username, Email or Mobile
                      </Label>
                      <Input
                        id="identifier"
                        type="text"
                        placeholder="Enter username, email or mobile"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="h-12 px-4"
                        autoComplete="username"
                        required
                      />
                    </div>

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
                          autoComplete="current-password"
                          required
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

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 font-medium rounded-lg mt-4"
                    >
                      {isLoading ? <Loader2 className="h-5 w-5 text-2xl font-bold animate-spin mx-auto" /> : "Sign in"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Side image - Desktop only (unchanged) */}
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