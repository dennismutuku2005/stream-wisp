"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  Menu,
  Home,
  Router,
  Wifi,
  Users,
  Settings,
  Bell,
  Search,
  User,
  ChevronRight,
  Eye,
  Plus,
  Shield,
  AlertCircle,
  FileBarChart,
  Layers,
  Activity,
  Network,
  MapPin,
  MessageSquare,
  Smartphone,
  Server,
  Globe,
  ShieldCheck,
  WifiOff,
  Cpu,
  HardDrive,
  MemoryStick,
  Signal,
  BarChart3,
  History,
  Zap,
  Download,
  Upload,
  Lock,
  Unlock,
  Map,
  MessageCircle,
  Smartphone as PhoneIcon,
  Phone,
  HelpCircle,
  Info,
  Badge,
  Terminal,
  Code,
  Database,
  ShieldAlert,
  Network as NetworkIcon,
  Wifi as WifiIcon,
  Router as RouterIcon,
  Users as UsersIcon,
  Book,
  Video,
  AlignVerticalDistributeEndIcon,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"

// Define ecommerce navigation structure
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Mikrotik Routers",
    href: "/dashboard/routers",
    icon: RouterIcon,
    submenu: [
      { name: "All Routers", href: "/dashboard/routers", icon: Server, badge: "5" },
      { name: "Aps-Distribution", href: "/dashboard/routers/aps", icon: AlignVerticalDistributeEndIcon, badge: "1" },
    ],
  },
  {
    name: "Access Points",
    href: "/dashboard/access-points",
    icon: Badge,
    submenu: [
      { name: "All APs", href: "/dashboard/access-points", icon: Badge, badge: "23" },
      { name: "Unregistered APs", href: "/dashboard/access-points/unregistered", icon: ShieldAlert, badge: "2" },
      { name: "AP Locations", href: "/dashboard/access-points/locations", icon: MapPin },
    ],
  },
  {
    name: "Network Monitoring",
    href: "/dashboard/monitoring",
    icon: Activity,
    submenu: [
      { name: "DHCP Conflicts", href: "/dashboard/monitoring/conflicts", icon: AlertCircle, badge: "3" },
      { name: "Off Aps", href: "/dashboard/monitoring/off-aps", icon: NetworkIcon, badge: "5" },
    ],
  },
  {
    name: "Alerts & Notifications",
    href: "/dashboard/alerts",
    icon: Bell,
    submenu: [
      { name: "All Alerts", href: "/dashboard/alerts", icon: Bell, badge: "8" },
      { name: "WhatsApp Alerts", href: "/dashboard/alerts/whatsapp", icon: MessageSquare },
      { name: "SMS Alerts", href: "/dashboard/alerts/sms", icon: PhoneIcon },
      { name: "Email Alerts", href: "/dashboard/alerts/email", icon: Mail },
      { name: "Alert Rules", href: "/dashboard/alerts/rules", icon: ShieldCheck },
    ],
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FileBarChart,
    submenu: [
      { name: "Network Health", href: "/dashboard/reports/health", icon: BarChart3 },
      { name: "Router Performance", href: "/dashboard/reports/routers", icon: RouterIcon },
      { name: "AP Performance", href: "/dashboard/reports/aps", icon: Wifi },
      { name: "Security Logs", href: "/dashboard/reports/security", icon: Shield },
      { name: "Traffic History", href: "/dashboard/reports/traffic", icon: History },
    ],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    submenu: [
      { name: "General", href: "/dashboard/settings/general", icon: Settings },
      { name: "Personalization", href: "/dashboard/settings/personalization", icon: Zap },
      { name: "Notification Settings", href: "/dashboard/settings/notifications", icon: Bell },
      { name: "API Configuration", href: "/dashboard/settings/api", icon: Code },
      { name: "Backup & Restore", href: "/dashboard/settings/backup", icon: Database },
      { name: "Security", href: "/dashboard/settings/security", icon: Lock },
    ],
  },
  {
    name: "Help & Support",
    href: "/dashboard/help",
    icon: HelpCircle,
    submenu: [
      { name: "Documentation", href: "/dashboard/help/docs", icon: Book },
      { name: "Tutorials", href: "/dashboard/help/tutorials", icon: Video },
      { name: "FAQ", href: "/dashboard/help/faq", icon: HelpCircle },
      { name: "System Info", href: "/dashboard/help/system", icon: Info },
    ],
  },
]

// Missing icon components
function Clock({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function Mail({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function Ticket({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  )
}

// Custom hook to persist sidebar state in localStorage
function useSidebarState() {
  const [expandedItems, setExpandedItems] = useState({})
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('sidebarExpandedItems')
      if (savedState) {
        setExpandedItems(JSON.parse(savedState))
      }
      const savedScroll = localStorage.getItem('sidebarScrollPosition')
      if (savedScroll) {
        setScrollPosition(Number(savedScroll))
      }
    } catch (error) {
      console.error('Error loading sidebar state:', error)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Save expanded items to localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('sidebarExpandedItems', JSON.stringify(expandedItems))
      } catch (error) {
        console.error('Error saving sidebar state:', error)
      }
    }
  }, [expandedItems, isInitialized])

  // Save scroll position to localStorage (with debounce)
  useEffect(() => {
    if (isInitialized && scrollPosition > 0) {
      const timer = setTimeout(() => {
        try {
          localStorage.setItem('sidebarScrollPosition', scrollPosition.toString())
        } catch (error) {
          console.error('Error saving scroll position:', error)
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [scrollPosition, isInitialized])

  return {
    expandedItems,
    setExpandedItems,
    scrollPosition,
    setScrollPosition,
    isInitialized
  }
}

export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userData, setUserData] = useState(null)
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const sidebarRef = useRef(null)
  const pathname = usePathname()
  const router = useRouter()

  // Use our custom hook for sidebar state
  const {
    expandedItems,
    setExpandedItems,
    scrollPosition,
    setScrollPosition,
    isInitialized
  } = useSidebarState()

  // Capitalize first letter of username
  const capitalizeUsername = (username) => {
    if (!username) return "user"
    return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()
  }

  // Get user initials for avatar
  const getInitials = (username) => {
    if (!username) return "US"
    return username
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Check authentication and get user data
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userCookie = Cookies.get("user_data")

        if (!userCookie) {
          router.replace("/login")
          return
        }

        const parsedUserData = JSON.parse(userCookie)

        if (!parsedUserData.username || !parsedUserData.mobile) {
          console.warn("Invalid user data in cookie")
          router.replace("/login")
          return
        }

        setUserData(parsedUserData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error parsing user data:", error)
        Cookies.remove("user_data")
        router.replace("/login")
      }
    }

    checkAuth()
    const interval = setInterval(checkAuth, 60 * 1000)

    return () => clearInterval(interval)
  }, [router])

  // Restore scroll position when sidebar mounts
  useEffect(() => {
    if (sidebarRef.current && scrollPosition > 0) {
      const restoreScroll = () => {
        if (sidebarRef.current) {
          sidebarRef.current.scrollTop = scrollPosition
        }
      }
      
      // Try immediately
      restoreScroll()
      
      // Try again after a short delay
      const timer = setTimeout(restoreScroll, 100)
      return () => clearTimeout(timer)
    }
  }, [scrollPosition, isInitialized])

  // Save scroll position when user scrolls (with debounce)
  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        const currentScroll = sidebarRef.current.scrollTop
        setScrollPosition(currentScroll)
      }
    }

    const sidebar = sidebarRef.current
    if (sidebar) {
      sidebar.addEventListener('scroll', handleScroll)
      return () => sidebar.removeEventListener('scroll', handleScroll)
    }
  }, [setScrollPosition])

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCardOpen && !event.target.closest('.user-card-trigger')) {
        setIsCardOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isCardOpen])

  // Toggle submenu expansion
  const toggleSubmenu = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }))
  }

  // Auto-expand parent menu when navigating to submenu
  useEffect(() => {
    if (!isInitialized) return
    
    let hasChanges = false
    const newExpandedItems = { ...expandedItems }

    // Find the parent menu item for the current path
    navigation.forEach(item => {
      if (item.submenu) {
        const isActiveChild = item.submenu.some(sub => {
          // Match exact path or paths that start with the submenu href
          return pathname === sub.href || pathname.startsWith(sub.href + '/')
        })
        
        // If we're on a child page, expand its parent
        if (isActiveChild && !newExpandedItems[item.name]) {
          newExpandedItems[item.name] = true
          hasChanges = true
        }
        
        // If we're NOT on any child page of this parent, don't collapse it
        // (keep it as is - this is important for maintaining state)
      }
    })

    // Only update if there are changes
    if (hasChanges) {
      setExpandedItems(newExpandedItems)
    }
  }, [pathname, isInitialized])

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }, [pathname])

  // Logout handler
  const handleLogout = () => {
    Cookies.remove("user_data")
    setUserData(null)
    router.replace("/login")
  }

  // Show loading or redirect if no user data
  if (isLoading || !userData) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo Area - Fixed */}
      <div className="flex-shrink-0 h-16 flex items-center border-b border-sidebar-border px-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 relative w-8 h-8">
            <Image
              src="/logos/primarylogo.png"
              alt="Ecommerce Logo"
              width={32}
              height={32}
              className="rounded-lg object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-semibold whitespace-nowrap">Stream V1.0.0</h1>
            <p className="text-xs text-muted-foreground whitespace-nowrap">Monitor Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation - Scrollable with scroll preservation */}
      <div
        ref={sidebarRef}
        className="flex-1 overflow-y-auto"
      >
        <nav className="space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.submenu && item.submenu.some(sub => 
                pathname === sub.href || pathname.startsWith(sub.href + '/')
              ))
            const hasSubmenu = item.submenu && item.submenu.length > 0
            const isExpanded = expandedItems[item.name]
            const Icon = item.icon

            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-3 text-sm transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  onClick={(e) => {
                    if (hasSubmenu) {
                      e.preventDefault()
                      toggleSubmenu(item.name)
                    } else {
                      // Only close sidebar on mobile
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false)
                      }
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="whitespace-nowrap font-medium">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                    {hasSubmenu && (
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isExpanded && "rotate-90"
                      )} />
                    )}
                  </div>
                </Link>

                {hasSubmenu && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-2">
                    {item.submenu.map((subItem) => {
                      const isSubActive = pathname === subItem.href || 
                        pathname.startsWith(subItem.href + '/')
                      const SubIcon = subItem.icon
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all duration-200",
                            isSubActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                          onClick={() => {
                            // Only close sidebar on mobile
                            if (window.innerWidth < 1024) {
                              setSidebarOpen(false)
                            }
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <SubIcon className="h-4 w-4 flex-shrink-0" />
                            <span>{subItem.name}</span>
                          </div>
                          {subItem.badge && (
                            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                              {subItem.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* User Info - Fixed */}
      <div className="flex-shrink-0 border-t border-sidebar-border p-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {getInitials(userData?.username)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium whitespace-nowrap">
              {capitalizeUsername(userData?.username)}
            </p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {userData?.mobile || "Admin"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar - Always Open with independent scrolling */}
      <div className="hidden lg:flex w-64 h-screen shadow-xl relative flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 sm:w-72 h-full flex flex-col">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header - Fixed */}
        <header className="flex-shrink-0 h-14 sm:h-16 flex items-center justify-between border-b px-3 sm:px-6 bg-card shadow-sm">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden flex items-center justify-center h-14 w-14 rounded-md hover:bg-accent cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-7 w-7" />
            </button>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products, orders, customers..."
                className="w-full pl-9"
              />
            </div>
          </div>

          {/* User Avatar Dropdown */}
          <div className="relative user-card-trigger">
            <button
              type="button"
              className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-accent"
              onClick={() => setIsCardOpen(!isCardOpen)}
            >
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {getInitials(userData?.username)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium">
                {capitalizeUsername(userData?.username)}
              </span>
            </button>

            {/* User Dropdown Card */}
            <div
              className={cn(
                "absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-popover shadow-xl border overflow-hidden z-50 transition-all duration-300",
                isCardOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              )}
            >
              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-accent">
                    <User className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Username</p>
                      <p className="text-sm font-medium truncate">{capitalizeUsername(userData?.username)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg bg-accent">
                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Mobile</p>
                      <p className="text-sm font-medium">{userData?.mobile || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}