"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  Package2,
  ShoppingCart,
  Users,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Star,
  BarChart3,
  Bell,
  Eye,
  EyeOff,
  Package,
  ShoppingBag,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RotateCw,
  Download,
  Plus,
  MessageSquare,
  Settings,
  Megaphone,
  Layers,
  Notebook,
  FileText,
  Tag,
  Store,
  CircleDollarSign,
  Filter,
  Zap,
  Shield,
  Receipt,
  CheckSquare,
  Undo,
  RefreshCw,
  X,
  DollarSign,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PackageOpen,
  FolderTree,
  BadgePercent,
  BarChart,
  LineChart,
  PieChart as PieChartIcon,
  ShoppingBasket,
  Percent,
  Target,
  Activity,
  Calendar,
  TrendingUp as TrendingUpIcon
} from "lucide-react";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as ReLineChart, Line, Cell } from "recharts";
import { useRouter } from "next/navigation";
import CustomToast from "@/components/customtoast";

// Portal Modal Component
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      ></div>

      <div
        className={`relative bg-card rounded-2xl shadow-2xl transform transition-all duration-300 p-6 w-full max-h-[90vh] overflow-y-auto ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-accent"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-4 border rounded-lg shadow-lg">
        <p className="font-semibold text-foreground">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-muted-foreground mt-1">
            <span className="font-medium" style={{ color: entry.color }}>{entry.name}:</span> {entry.value} {entry.name === 'Revenue' ? 'USD' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Stat Card Component - Mobile optimized
const StatCard = ({ title, value, icon: Icon, color, isLoading, subtitle, trend, prefix = "", suffix = "" }) => {
  const colorClasses = {
    primary: { 
      bg: "bg-primary/10", 
      icon: "text-primary", 
      text: "text-primary",
      border: "border-primary/20"
    },
    secondary: { 
      bg: "bg-secondary/10", 
      icon: "text-secondary", 
      text: "text-secondary",
      border: "border-secondary/20"
    },
    destructive: { 
      bg: "bg-destructive/10", 
      icon: "text-destructive", 
      text: "text-destructive",
      border: "border-destructive/20"
    },
    success: { 
      bg: "bg-green-100", 
      icon: "text-green-600", 
      text: "text-green-600",
      border: "border-green-200"
    },
    warning: { 
      bg: "bg-yellow-100", 
      icon: "text-yellow-600", 
      text: "text-yellow-600",
      border: "border-yellow-200"
    }
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border hover:shadow-md transition-all duration-300 hover:border-border/50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">{title}</p>
          {isLoading ? (
            <div className="h-6 sm:h-8 w-20 sm:w-24 bg-muted rounded-lg animate-pulse mt-1"></div>
          ) : (
            <>
              <div className={`text-lg sm:text-2xl font-bold ${colors.text} mb-1`}>
                {prefix}
                {typeof value === "number" && value > 1000 ? value.toLocaleString() : value}
                {suffix}
              </div>
              {subtitle && (
                <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
              )}
              {trend && (
                <div className={`flex items-center text-xs mt-1 ${trend.value > 0 ? 'text-green-600' : trend.value < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {trend.value > 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : trend.value < 0 ? (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  ) : null}
                  {trend.value !== 0 && `${trend.value > 0 ? '+' : ''}${trend.value}%`} {trend.label}
                </div>
              )}
            </>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
          <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  );
};

// Quick Action Button Component - Mobile optimized
const QuickActionButton = ({ icon: Icon, title, onClick, color, description }) => {
  const colorClasses = {
    primary: { 
      bg: "bg-primary/10", 
      icon: "text-primary", 
      hover: "hover:bg-primary/20",
      border: "border-primary/20"
    },
    secondary: { 
      bg: "bg-secondary/10", 
      icon: "text-secondary", 
      hover: "hover:bg-secondary/20",
      border: "border-secondary/20"
    },
    success: { 
      bg: "bg-green-100", 
      icon: "text-green-600", 
      hover: "hover:bg-green-200",
      border: "border-green-200"
    }
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <button
      onClick={onClick}
      className={`flex items-start p-3 sm:p-4 ${colors.bg} ${colors.hover} rounded-xl transition-all duration-200 text-left group border ${colors.border} hover:border-border w-full`}
      aria-label={title}
    >
      <div className={`p-2 rounded-lg ${colors.bg} group-hover:scale-110 transition-transform duration-200 mr-3 border ${colors.border}`}>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-foreground block mb-1 text-sm sm:text-base">{title}</span>
        {description && (
          <span className="text-xs text-muted-foreground block truncate">{description}</span>
        )}
      </div>
    </button>
  );
};

// Notice Card Component
const NoticeCard = ({ type, title, message, icon: Icon, action }) => {
  const typeClasses = {
    warning: {
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      text: "text-yellow-900",
      subtitle: "text-yellow-700"
    },
    info: {
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      text: "text-blue-900",
      subtitle: "text-blue-700"
    },
    success: {
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      text: "text-green-900",
      subtitle: "text-green-700"
    }
  };

  const styles = typeClasses[type] || typeClasses.info;

  return (
    <div className={`p-3 sm:p-4 rounded-xl border ${styles.bg}`}>
      <div className="flex items-start space-x-3">
        <div className={`p-1.5 sm:p-2 rounded-full ${styles.iconBg}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${styles.text} truncate`}>
            {title}
          </h3>
          <p className={`text-xs sm:text-sm mt-1 ${styles.subtitle} line-clamp-2`}>
            {message}
          </p>
          {action && (
            <button className={`text-xs font-medium mt-2 ${styles.subtitle} hover:underline`}>
              {action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Category Distribution Card - Replaces Pie Chart
const CategoryDistributionCard = ({ categories, totalProducts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-sm border">
        <div className="h-8 bg-muted rounded-lg animate-pulse mb-4"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-sm border text-center">
        <FolderTree className="h-12 w-12 mx-auto mb-3 text-muted" />
        <p className="font-medium text-foreground">No categories available</p>
        <p className="text-sm text-muted-foreground mt-1">Add categories to see distribution</p>
      </div>
    );
  }

  const sortedCategories = [...categories].sort((a, b) => b.value - a.value);

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Top Categories</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">By product count</p>
        </div>
        <Link
          href="/dashboard/products/categories"
          className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1"
        >
          View All
          <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </Link>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {sortedCategories.slice(0, 5).map((category, index) => {
          const percentage = totalProducts > 0 ? (category.value / totalProducts) * 100 : 0;
          return (
            <div key={index} className="flex items-center justify-between p-2 sm:p-3 hover:bg-accent rounded-lg transition-colors">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm sm:text-base truncate">{category.name}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: category.color
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              <div className="text-right ml-2 sm:ml-4">
                <p className="font-semibold text-foreground text-sm sm:text-base">{category.value}</p>
                <p className="text-xs text-muted-foreground">${category.amount?.toLocaleString() || '0'}</p>
              </div>
            </div>
          );
        })}
      </div>

      {sortedCategories.length > 5 && (
        <div className="mt-4 pt-4 border-t">
          <Link
            href="/dashboard/products/categories"
            className="text-center block text-primary hover:text-primary/80 font-medium text-sm"
          >
            View {sortedCategories.length - 5} more categories →
          </Link>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showNotifications, setShowNotifications] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    monthlySales: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    returnedOrders: 0,
    activeCampaigns: 0,
    inventoryValue: 0,
    discountActive: 0,
    abandonedCarts: 0
  });
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);

  const router = useRouter();

  const [toast, setToast] = useState({
    message: "",
    type: "error",
    isVisible: false
  });

  const showToast = (message, type = "error") => {
    setToast({
      message,
      type,
      isVisible: true
    });

    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 5000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Check for notification preference cookie on mount
  useEffect(() => {
    const hiddenPref = Cookies.get("hide_dashboard_notifications");
    if (hiddenPref === "true") {
      setShowNotifications(false);
    }
  }, []);

  // Handler to toggle notifications
  const toggleNotifications = () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
    
    if (newState === false) {
      Cookies.set("hide_dashboard_notifications", "true", { expires: 7 });
    } else {
      Cookies.remove("hide_dashboard_notifications");
    }
  };

  // Get user data from cookie
  useEffect(() => {
    const userCookie = Cookies.get("user_data");
    if (userCookie) {
      try {
        const parsedUserData = JSON.parse(userCookie);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        showToast("Invalid user session. Please login again.", "error");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } else {
      showToast("No user session found. Please login.", "error");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }, [router]);

  // Simulate fetching dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalProducts: 1564,
          totalOrders: 289,
          totalCustomers: 1247,
          todayRevenue: 15480,
          pendingOrders: 45,
          lowStockProducts: 23,
          monthlySales: 125400,
          conversionRate: 3.2,
          averageOrderValue: 124.50,
          returnedOrders: 12,
          activeCampaigns: 5,
          inventoryValue: 250000,
          discountActive: 8,
          abandonedCarts: 42
        });

        setCategoryDistribution([
          { name: "Electronics", value: 450, color: "#3B82F6", amount: 45000 },
          { name: "Fashion", value: 320, color: "#8B5CF6", amount: 32000 },
          { name: "Home & Garden", value: 280, color: "#10B981", amount: 28000 },
          { name: "Books", value: 210, color: "#F59E0B", amount: 21000 },
          { name: "Sports", value: 180, color: "#EF4444", amount: 18000 },
          { name: "Beauty", value: 150, color: "#06B6D4", amount: 15000 }
        ]);

        setRecentOrders([
          { id: 1, customer: "John Doe", amount: 249.99, status: "Delivered", time: "2 hours ago", items: 3 },
          { id: 2, customer: "Jane Smith", amount: 149.50, status: "Processing", time: "4 hours ago", items: 2 },
          { id: 3, customer: "Robert Johnson", amount: 89.99, status: "Shipped", time: "6 hours ago", items: 1 },
          { id: 4, customer: "Sarah Wilson", amount: 329.99, status: "Pending", time: "1 day ago", items: 5 },
          { id: 5, customer: "Michael Brown", amount: 199.99, status: "Delivered", time: "1 day ago", items: 4 }
        ]);

        setAlerts([
          { type: "warning", title: "Low Stock Alert", message: "23 products are running low in inventory" },
          { type: "info", title: "New Campaign Live", message: "Summer Sale campaign is now active" },
          { type: "success", title: "Record Sales", message: "Highest daily revenue recorded yesterday" }
        ]);

        setSalesData([
          { day: "Mon", revenue: 4500, orders: 45 },
          { day: "Tue", revenue: 5200, orders: 52 },
          { day: "Wed", revenue: 4800, orders: 48 },
          { day: "Thu", revenue: 6200, orders: 62 },
          { day: "Fri", revenue: 7100, orders: 71 },
          { day: "Sat", revenue: 8900, orders: 89 },
          { day: "Sun", revenue: 7600, orders: 76 }
        ]);

        setPerformanceMetrics([
          { name: "Page Views", value: 12450, change: 12 },
          { name: "Conversion", value: 3.2, change: 0.8, suffix: "%" },
          { name: "Avg. Session", value: 4.2, change: -0.3, suffix: "min" },
          { name: "Bounce Rate", value: 42, change: -5, suffix: "%" }
        ]);

        setIsLoading(false);
      }, 1500);
    };

    fetchDashboardData();
  }, []);

  // Quick actions handlers based on sidebar navigation
  const quickActions = [
    {
      icon: Plus,
      title: "Add Product",
      description: "Create new product listing",
      color: "primary",
      onClick: () => router.push("/dashboard/products/add")
    },
    {
      icon: ShoppingCart,
      title: "View Orders",
      description: "Manage customer orders",
      color: "secondary",
      onClick: () => router.push("/dashboard/orders")
    },
    {
      icon: Users,
      title: "Customers",
      description: "View customer database",
      color: "success",
      onClick: () => router.push("/dashboard/customers")
    },
    {
      icon: Megaphone,
      title: "Marketing",
      description: "Create campaigns & discounts",
      color: "primary",
      onClick: () => router.push("/dashboard/marketing")
    },
    {
      icon: Layers,
      title: "Inventory",
      description: "Manage stock levels",
      color: "secondary",
      onClick: () => router.push("/dashboard/inventory")
    },
    {
      icon: BarChart3,
      title: "Reports",
      description: "Generate analytics reports",
      color: "success",
      onClick: () => router.push("/dashboard/reports")
    },
    {
      icon: Notebook,
      title: "Notes",
      description: "Take quick notes",
      color: "primary",
      onClick: () => router.push("/dashboard/notes")
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Configure store settings",
      color: "secondary",
      onClick: () => router.push("/dashboard/system")
    },
  ];

  if (!userData && isLoading) {
    return (
      <>
        <CustomToast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
        <DashboardLayout>
          <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <RotateCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading user session...</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-4 sm:py-6 space-y-4 sm:space-y-6">
          {/* Header Section - Mobile optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
               <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Admin • Bidhaa Mart
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => router.push('/dashboard/notes')}
                title="Open notepad"
                aria-label="Open notepad"
                className="flex items-center px-2 sm:px-3 py-2 bg-card border rounded-lg hover:bg-accent transition-colors"
              >
                <Notebook className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline ml-2 text-sm text-foreground">Notes</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                disabled={isLoading}
                className="flex items-center px-3 sm:px-4 py-2 bg-card border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Refresh</span>
              </button>
            </div>
          </div>

          {/* Alerts / Notifications Panel - Mobile optimized */}
          {alerts.length > 0 && !isLoading && (
            <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
              {/* Notifications Header with Toggle Button */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between bg-accent/50">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    {showNotifications && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 sm:h-2.5 sm:w-2.5 bg-destructive rounded-full animate-pulse"></span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    Notifications
                    <span className="ml-2 text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                      {alerts.length}
                    </span>
                  </h3>
                </div>

                <button
                  onClick={toggleNotifications}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all duration-200 ${
                    showNotifications 
                    ? 'bg-card border-border text-foreground hover:bg-accent' 
                    : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
                  }`}
                >
                  {showNotifications ? (
                    <>
                      <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Show</span>
                    </>
                  )}
                </button>
              </div>

              {/* Collapsible Content */}
              {showNotifications && (
                <div className="p-4 sm:p-6 grid gap-3 sm:gap-4 bg-card animate-in fade-in slide-in-from-top-2 duration-300">
                  {alerts.map((alert, index) => (
                    <NoticeCard
                      key={index}
                      type={alert.type}
                      icon={alert.type === "warning" ? AlertCircle : alert.type === "success" ? CheckCircle : Bell}
                      title={alert.title}
                      message={alert.message}
                      action="View Details"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Key Metrics Grid - Mobile optimized */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              icon={Package2}
              color="primary"
              isLoading={isLoading}
              trend={{ value: 8, label: "from last month" }}
            />
            <StatCard
              title="Today's Orders"
              value={stats.totalOrders}
              icon={ShoppingCart}
              color="primary"
              isLoading={isLoading}
              subtitle={`${stats.pendingOrders} pending`}
              trend={{ value: 12, label: "vs yesterday" }}
            />
            <StatCard
              title="Today's Revenue"
              value={stats.todayRevenue}
              icon={DollarSign}
              color="success"
              isLoading={isLoading}
              prefix="$"
              subtitle={`Avg: $${stats.averageOrderValue}`}
              trend={{ value: 15, label: "growth" }}
            />
            <StatCard
              title="Customers"
              value={stats.totalCustomers}
              icon={Users}
              color="warning"
              isLoading={isLoading}
              subtitle={`${stats.conversionRate}% conversion`}
              trend={{ value: 5, label: "from last week" }}
            />
          </div>

          {/* Second Row Metrics - Mobile optimized */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <StatCard
              title="Pending Orders"
              value={stats.pendingOrders}
              icon={Clock}
              color="destructive"
              isLoading={isLoading}
              subtitle="Need attention"
            />
            <StatCard
              title="Low Stock"
              value={stats.lowStockProducts}
              icon={AlertCircle}
              color="destructive"
              isLoading={isLoading}
              subtitle="Need restocking"
            />
            <StatCard
              title="Monthly Sales"
              value={stats.monthlySales}
              icon={TrendingUpIcon}
              color="primary"
              isLoading={isLoading}
              prefix="$"
              trend={{ value: 18, label: "vs last month" }}
            />
            <StatCard
              title="Return Rate"
              value={`${((stats.returnedOrders / stats.totalOrders) * 100 || 0).toFixed(1)}%`}
              icon={Undo}
              color="warning"
              isLoading={isLoading}
              subtitle={`${stats.returnedOrders} returns`}
            />
          </div>

          {/* Charts & Data Section - Mobile optimized */}
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Sales Trend Chart */}
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Weekly Sales Trend</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1">Revenue over the past week</p>
                </div>
                <Link
                  href="/dashboard/reports"
                  className="text-primary hover:text-primary/80 font-medium text-xs sm:text-sm flex items-center gap-1"
                >
                  Details
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </div>

              {isLoading ? (
                <div className="h-48 sm:h-80 bg-muted rounded-xl animate-pulse"></div>
              ) : (
                <div className="h-48 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                      <XAxis 
                        dataKey="day" 
                        stroke="black"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="black"
                        fontSize={12}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" //all types are 1.monotone 2
                        dataKey="revenue" 
                        stroke="green"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Category Distribution Card - Replaces Pie Chart */}
            <CategoryDistributionCard 
              categories={categoryDistribution}
              totalProducts={stats.totalProducts}
              isLoading={isLoading}
            />
          </div>

          {/* Performance Metrics */}
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">Performance Metrics</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mt-1">Key store performance indicators</p>
              </div>
              <Link
                href="/dashboard/analytics"
                className="text-primary hover:text-primary/80 font-medium text-xs sm:text-sm flex items-center gap-1"
              >
                Analytics
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="bg-accent p-3 sm:p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">{metric.name}</span>
                    <span className={`text-xs font-medium ${metric.change > 0 ? 'text-green-600' : 'text-destructive'}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}{metric.suffix || ''}
                    </span>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-foreground">
                    {metric.value.toLocaleString()}{metric.suffix || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section - Mobile optimized */}
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Recent Orders - Mobile optimized */}
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Recent Orders</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1">Latest customer transactions</p>
                </div>
                <Link
                  href="/dashboard/orders"
                  className="text-primary hover:text-primary/80 font-medium text-xs sm:text-sm"
                >
                  View All
                </Link>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 animate-pulse">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-2 sm:h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-2 sm:p-3 hover:bg-accent rounded-lg transition-colors group"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                        <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          order.status === 'Delivered' ? 'bg-green-100' :
                          order.status === 'Processing' ? 'bg-blue-100' :
                          order.status === 'Shipped' ? 'bg-purple-100' :
                          'bg-yellow-100'
                        }`}>
                          {order.status === 'Delivered' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                           order.status === 'Processing' ? <Clock className="h-4 w-4 text-blue-600" /> :
                           order.status === 'Shipped' ? <Truck className="h-4 w-4 text-purple-600" /> :
                           <AlertCircle className="h-4 w-4 text-yellow-600" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm sm:text-base truncate">{order.customer}</p>
                          <p className="text-xs text-muted-foreground truncate">{order.items} items • {order.time}</p>
                        </div>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <span className="font-semibold text-foreground text-sm sm:text-base block">
                          ${order.amount.toFixed(2)}
                        </span>
                        <p className={`text-xs font-medium ${
                          order.status === 'Delivered' ? 'text-green-600' :
                          order.status === 'Processing' ? 'text-blue-600' :
                          order.status === 'Shipped' ? 'text-purple-600' :
                          'text-yellow-600'
                        }`}>
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-muted-foreground">
                  <ShoppingCart className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 text-muted" />
                  <p className="text-sm sm:text-base">No recent orders</p>
                </div>
              )}
            </div>

            {/* Quick Actions - Mobile optimized */}
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Quick Actions</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1">Manage your store efficiently</p>
                </div>
                <Link
                  href="/dashboard"
                  className="text-primary hover:text-primary/80 font-medium text-xs sm:text-sm"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {quickActions.slice(0, 4).map((action, index) => (
                  <QuickActionButton key={index} {...action} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-3">
                {quickActions.slice(4, 8).map((action, index) => (
                  <QuickActionButton key={index} {...action} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Modals - Removed for simplicity, can be re-added as needed */}
    </>
  );
}