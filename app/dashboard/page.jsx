"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  Router,
  Wifi,
  AlertCircle,
  Activity,
  Cpu,
  MemoryStick,
  RefreshCw,
  Plus,
  Users,
  Shield,
  MapPin,
  MessageSquare,
  BarChart3,
  ChevronUp,
  ChevronDown,
  Clock,
  Server,
  WifiOff,
  ShieldCheck,
  Settings,
  ShieldAlert,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CustomToast from "@/components/customtoast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Stat Card Component - Using your color system
const StatCard = ({ title, value, icon: Icon, color, subtitle, trend, isLoading, suffix = "" }) => {
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
    accent: { 
      bg: "bg-accent/10", 
      icon: "text-accent", 
      text: "text-accent",
      border: "border-accent/20"
    }
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <div className={`bg-card rounded-xl p-4 shadow-sm border hover:shadow-md transition-all duration-300 hover:border-border/50 h-full ${colors.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">{title}</p>
          {isLoading ? (
            <div className="h-7 w-24 bg-muted rounded animate-pulse mt-1"></div>
          ) : (
            <>
              <div className={`text-xl sm:text-2xl font-bold ${colors.text} mb-1`}>
                {typeof value === "number" && value > 1000 ? value.toLocaleString() : value}
                {suffix}
              </div>
              {subtitle && (
                <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
              )}
            </>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  );
};

// Status Badge Component - Using your color system
const StatusBadge = ({ status }) => {
  const statusConfig = {
    online: { label: "Online", variant: "success" },
    offline: { label: "Offline", variant: "destructive" },
    warning: { label: "Warning", variant: "warning" },
    critical: { label: "Critical", variant: "destructive" },
  };

  const config = statusConfig[status] || statusConfig.online;

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

// Quick Action Button Component - 2 columns on mobile, 4 on desktop
const QuickActionButton = ({ icon: Icon, title, onClick, color }) => {
  const colorClasses = {
    primary: { 
      bg: "bg-primary/10 hover:bg-primary/20", 
      icon: "text-primary",
      border: "border-primary/20"
    },
    secondary: { 
      bg: "bg-secondary/10 hover:bg-secondary/20", 
      icon: "text-secondary",
      border: "border-secondary/20"
    },
    accent: { 
      bg: "bg-accent/10 hover:bg-accent/20", 
      icon: "text-accent",
      border: "border-accent/20"
    },
    default: { 
      bg: "bg-muted hover:bg-accent", 
      icon: "text-muted-foreground",
      border: "border-border"
    }
  };

  const colors = colorClasses[color] || colorClasses.default;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 ${colors.bg} rounded-lg transition-all duration-200 text-center group border ${colors.border} hover:border-primary/30 w-full`}
      aria-label={title}
    >
      <div className={`p-2 rounded-lg ${colors.bg} group-hover:scale-110 transition-transform duration-200 mb-2 border ${colors.border}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="font-medium text-foreground text-xs sm:text-sm">{title}</span>
    </button>
  );
};

// Router Tile Component - Using your color system
const RouterTile = ({ router, onClick }) => {

  return (
    <div 
      className="flex items-center justify-between p-3 bg-card rounded-lg border hover:bg-accent transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${router.status === "online" ? "bg-primary/10" : "bg-muted"}`}>
          <Router className={`h-4 w-4 ${router.status === "online" ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div>
          <p className="font-medium text-foreground text-sm">{router.name}</p>
          <p className="text-xs text-muted-foreground">{router.ip}</p>
        </div>
      </div>
      <StatusBadge status={router.status} />
    </div>
  );
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  
  // Dashboard stats
  const [stats, setStats] = useState({
    totalRouters: 0,
    totalAPs: 0,
    issuesThisMonth: 0,
    recentEvents: 0,
    onlineRouters: 0,
    onlineAPs: 0,
    dhcpConflicts: 0,
    newHosts: 0,
    unregisteredAPs: 0,
    cpuAverage: 0,
    memoryAverage: 0,
    activeAlerts: 0,
    networkHealth: 0,
    securityScore: 0,
    uptime24h: 0,
  });

  const [routers, setRouters] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);

  const routerNav = useRouter();

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
          routerNav.push("/login");
        }, 2000);
      }
    } else {
      showToast("No user session found. Please login.", "error");
      setTimeout(() => {
        routerNav.push("/login");
      }, 2000);
    }
  }, [routerNav]);

  // Simulate fetching dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalRouters: 5,
          totalAPs: 23,
          issuesThisMonth: 8,
          recentEvents: 12,
          onlineRouters: 5,
          onlineAPs: 21,
          dhcpConflicts: 3,
          newHosts: 15,
          unregisteredAPs: 2,
          cpuAverage: 42,
          memoryAverage: 68,
          activeAlerts: 5,
          networkHealth: 85,
          securityScore: 92,
          uptime24h: 99.8,
        });

        setRouters([
          { id: 1, name: "Main Router", ip: "192.168.1.1", status: "online" },
          { id: 2, name: "Branch Office", ip: "192.168.2.1", status: "online" },
          { id: 3, name: "Warehouse", ip: "192.168.3.1", status: "warning" },
          { id: 4, name: "Retail Store", ip: "192.168.4.1", status: "online" },
          { id: 5, name: "Backup Router", ip: "192.168.5.1", status: "offline" },
        ]);

        setRecentEvents([
          { id: 1, type: "new_host", message: "New device: iPhone-13", time: "5 min ago" },
          { id: 2, type: "ap_online", message: "AP-02 came online", time: "10 min ago" },
          { id: 3, type: "config_change", message: "Router config updated", time: "1 hour ago" },
          { id: 4, type: "security_scan", message: "Security scan completed", time: "3 hours ago" },
          { id: 5, type: "dhcp_conflict", message: "DHCP conflict detected", time: "4 hours ago" },
        ]);

        setIsLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, []);

  // 4 Quick Actions - 2 columns on mobile, 4 on desktop
  const quickActions = [
    {
      icon: Plus,
      title: "Add Router",
      color: "primary",
      onClick: () => routerNav.push("/dashboard/routers/add")
    },
    {
      icon: Wifi,
      title: "Add AP",
      color: "secondary",
      onClick: () => routerNav.push("/dashboard/access-points/add")
    },
    {
      icon: Activity,
      title: "Monitoring",
      color: "accent",
      onClick: () => routerNav.push("/dashboard/monitoring")
    },
    {
      icon: Shield,
      title: "Security",
      color: "primary",
      onClick: () => routerNav.push("/dashboard/monitoring/security")
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
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
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
        <div className="max-w-7xl py-4 sm:py-6 space-y-4 sm:space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Network Dashboard</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Welcome back, {userData?.username || "Admin"} • Stream Mikrotik Monitor
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={() => window.location.reload()}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>

          {/* First Row - Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <StatCard
              title="Total Routers"
              value={stats.totalRouters}
              icon={Router}
              color="primary"
              isLoading={isLoading}
              subtitle={`${stats.onlineRouters} online`}
              trend={{ value: 0, label: "stable" }}
            />
            <StatCard
              title="Total APs"
              value={stats.totalAPs}
              icon={Wifi}
              color="secondary"
              isLoading={isLoading}
              subtitle={`${stats.onlineAPs} online`}
              trend={{ value: 12, label: "this month" }}
            />
            <StatCard
              title="Network Health"
              value={`${stats.networkHealth}%`}
              icon={Activity}
              color="accent"
              isLoading={isLoading}
              subtitle="Overall status"
              trend={{ value: 5, label: "improving" }}
            />
            <StatCard
              title="Security Score"
              value={`${stats.securityScore}%`}
              icon={ShieldCheck}
              color="primary"
              isLoading={isLoading}
              subtitle="System security"
            />
          </div>

          {/* Second Row - More Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <StatCard
              title="Active Alerts"
              value={stats.activeAlerts}
              icon={AlertCircle}
              color="destructive"
              isLoading={isLoading}
              subtitle="Require attention"
            />
            <StatCard
              title="New Hosts"
              value={stats.newHosts}
              icon={Users}
              color="secondary"
              isLoading={isLoading}
              subtitle="Last 24 hours"
              trend={{ value: 25, label: "increase" }}
            />
            <StatCard
              title="DHCP Conflicts"
              value={stats.dhcpConflicts}
              icon={ShieldAlert}
              color="destructive"
              isLoading={isLoading}
              subtitle="Current issues"
            />
            <StatCard
              title="24h Uptime"
              value={`${stats.uptime24h}%`}
              icon={Clock}
              color="accent"
              isLoading={isLoading}
              subtitle="Network availability"
            />
          </div>

          {/* Main Content Area */}
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Router Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Router Status</CardTitle>
                    <CardDescription>All Mikrotik routers in your network</CardDescription>
                  </div>
                  <Link
                    href="/dashboard/routers"
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    View All →
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 animate-pulse">
                        <div className="h-10 w-10 bg-muted rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {routers.map((routerData) => (
                      <RouterTile
                        key={routerData.id}
                        router={routerData}
                        onClick={() => routerNav.push(`/dashboard/routers/${routerData.id}`)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Network Events */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Events</CardTitle>
                    <CardDescription>Latest network activities</CardDescription>
                  </div>
                  <Link
                    href="/dashboard/monitoring"
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    View All →
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : recentEvents.length > 0 ? (
                  <div className="space-y-2">
                    {recentEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-1.5 rounded ${
                            event.type === 'new_host' ? 'bg-primary/10 text-primary' :
                            event.type === 'ap_online' ? 'bg-secondary/10 text-secondary' :
                            event.type === 'security_scan' ? 'bg-accent/10 text-accent' :
                            event.type === 'dhcp_conflict' ? 'bg-destructive/10 text-destructive' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {event.type === 'new_host' ? <Users className="h-3 w-3" /> :
                             event.type === 'ap_online' ? <Wifi className="h-3 w-3" /> :
                             event.type === 'security_scan' ? <Shield className="h-3 w-3" /> :
                             event.type === 'dhcp_conflict' ? <AlertCircle className="h-3 w-3" /> :
                             <Activity className="h-3 w-3" />}
                          </div>
                          <span className="text-sm truncate">{event.message}</span>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {event.time}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent events</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Grid - 2 columns on mobile, 4 on desktop */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common network management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <QuickActionButton key={index} {...action} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status Summary */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Overall network status summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Router Health</h4>
                    <Badge variant={stats.onlineRouters === stats.totalRouters ? "secondary" : "destructive"}>
                      {((stats.onlineRouters / stats.totalRouters) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stats.onlineRouters} of {stats.totalRouters} routers online
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">AP Coverage</h4>
                    <Badge variant={stats.unregisteredAPs === 0 ? "secondary" : "destructive"}>
                      {((stats.onlineAPs / stats.totalAPs) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stats.onlineAPs} of {stats.totalAPs} APs online
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Issues This Month</h4>
                    <Badge variant={stats.issuesThisMonth === 0 ? "secondary" : "destructive"}>
                      {stats.issuesThisMonth}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stats.dhcpConflicts} conflicts • {stats.activeAlerts} alerts
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Recent Activity</h4>
                    <Badge variant="default">
                      {stats.recentEvents}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stats.newHosts} new hosts • {stats.recentEvents} events
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}