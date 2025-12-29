"use client";

import { useState, useEffect } from "react";
import { DashboardLayout }  from "@/components/dashboard-layout";
import {
  Router,
  Wifi,
  AlertCircle,
  Activity,
  RefreshCw,
  Plus,
  Users,
  Shield,
  ShieldCheck,
  Clock,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// Mock user data
const mockUserData = { username: "Admin" };

// Stat Card Component with gradient backgrounds
const StatCard = ({ title, value, icon: Icon, color, subtitle, trend, isLoading, suffix = "" }) => {
  const colorClasses = {
    primary: { 
      gradient: "from-primary/20 via-primary/10 to-transparent",
      icon: "bg-primary/20 text-primary border-primary/30",
      text: "text-primary",
      glow: "shadow-primary/20"
    },
    secondary: { 
      gradient: "from-secondary/20 via-secondary/10 to-transparent",
      icon: "bg-secondary/20 text-secondary border-secondary/30",
      text: "text-secondary",
      glow: "shadow-secondary/20"
    },
    destructive: { 
      gradient: "from-destructive/20 via-destructive/10 to-transparent",
      icon: "bg-destructive/20 text-destructive border-destructive/30",
      text: "text-destructive",
      glow: "shadow-destructive/20"
    },
    accent: { 
      gradient: "from-accent/20 via-accent/10 to-transparent",
      icon: "bg-accent/20 text-accent border-accent/30",
      text: "text-accent",
      glow: "shadow-accent/20"
    }
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <div className={`relative overflow-hidden bg-card rounded-2xl p-5 border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg ${colors.glow} group h-full`}>
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
          {isLoading ? (
            <div className="h-8 w-28 bg-muted/50 rounded-lg animate-pulse mt-2"></div>
          ) : (
            <>
              <div className={`text-3xl font-bold ${colors.text} mb-1.5 tracking-tight`}>
                {typeof value === "number" && value > 1000 ? value.toLocaleString() : value}
                {suffix}
              </div>
              {subtitle && (
                <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>
              )}
            </>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors.icon} border backdrop-blur-sm`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    online: { 
      label: "Online", 
      classes: "bg-accent/20 text-accent border-accent/30 shadow-accent/10"
    },
    offline: { 
      label: "Offline", 
      classes: "bg-destructive/20 text-destructive border-destructive/30 shadow-destructive/10"
    },
    warning: { 
      label: "Warning", 
      classes: "bg-secondary/20 text-secondary border-secondary/30 shadow-secondary/10"
    },
  };

  const config = statusConfig[status] || statusConfig.online;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.classes} shadow-sm`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${status === 'online' ? 'bg-accent' : status === 'offline' ? 'bg-destructive' : 'bg-secondary'} animate-pulse`}></span>
      {config.label}
    </span>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, title, onClick, color }) => {
  const colorClasses = {
    primary: { 
      bg: "from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10", 
      icon: "bg-primary/20 text-primary border-primary/30",
      border: "border-primary/20 hover:border-primary/40"
    },
    secondary: { 
      bg: "from-secondary/20 to-secondary/5 hover:from-secondary/30 hover:to-secondary/10", 
      icon: "bg-secondary/20 text-secondary border-secondary/30",
      border: "border-secondary/20 hover:border-secondary/40"
    },
    accent: { 
      bg: "from-accent/20 to-accent/5 hover:from-accent/30 hover:to-accent/10", 
      icon: "bg-accent/20 text-accent border-accent/30",
      border: "border-accent/20 hover:border-accent/40"
    },
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden flex flex-col items-center justify-center p-5 bg-gradient-to-br ${colors.bg} rounded-2xl transition-all duration-300 border ${colors.border} shadow-sm hover:shadow-md group w-full`}
    >
      <div className={`p-3 rounded-xl ${colors.icon} border backdrop-blur-sm mb-3 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-6 w-6" />
      </div>
      <span className="font-semibold text-foreground text-sm">{title}</span>
    </button>
  );
};

// Router Tile Component
const RouterTile = ({ router, onClick }) => {
  return (
    <div 
      className="group flex items-center justify-between p-4 bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:bg-accent/5 transition-all duration-300 cursor-pointer hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl border backdrop-blur-sm ${router.status === "online" ? "bg-primary/20 text-primary border-primary/30" : "bg-muted text-muted-foreground border-border"}`}>
          <Router className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm mb-0.5">{router.name}</p>
          <p className="text-xs text-muted-foreground font-medium">{router.ip}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={router.status} />
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData] = useState(mockUserData);
  
  const [stats, setStats] = useState({
    totalRouters: 0,
    totalAPs: 0,
    onlineRouters: 0,
    onlineAPs: 0,
    activeAlerts: 0,
    newHosts: 0,
    dhcpConflicts: 0,
    uptime24h: 0,
    networkHealth: 0,
    securityScore: 0,
  });

  const [routers, setRouters] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      setTimeout(() => {
        setStats({
          totalRouters: 5,
          totalAPs: 23,
          onlineRouters: 5,
          onlineAPs: 21,
          activeAlerts: 5,
          newHosts: 15,
          dhcpConflicts: 3,
          uptime24h: 99.8,
          networkHealth: 85,
          securityScore: 92,
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

  const quickActions = [
    { icon: Plus, title: "Add Router", color: "primary", onClick: () => {} },
    { icon: Wifi, title: "Add AP", color: "secondary", onClick: () => {} },
    { icon: Activity, title: "Monitoring", color: "accent", onClick: () => {} },
    { icon: Shield, title: "Security", color: "primary", onClick: () => {} },
  ];

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">Network Dashboard</h1>
            <p className="text-muted-foreground font-medium">
              Welcome back, <span className="text-primary font-semibold">{userData?.username}</span> • Stream Mikrotik Monitor
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border hover:border-primary/30 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            value={stats.networkHealth}
            icon={Activity}
            color="accent"
            isLoading={isLoading}
            subtitle="Overall status"
            suffix="%"
            trend={{ value: 5, label: "improving" }}
          />
          <StatCard
            title="Security Score"
            value={stats.securityScore}
            icon={ShieldCheck}
            color="primary"
            isLoading={isLoading}
            subtitle="System security"
            suffix="%"
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            value={stats.uptime24h}
            icon={Clock}
            color="accent"
            isLoading={isLoading}
            subtitle="Network availability"
            suffix="%"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Router Status */}
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Router Status</h2>
                <p className="text-sm text-muted-foreground">All Mikrotik routers in your network</p>
              </div>
              <button className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors">
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="h-12 w-12 bg-muted/50 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted/50 rounded w-3/4"></div>
                      <div className="h-3 bg-muted/50 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {routers.map((routerData) => (
                  <RouterTile
                    key={routerData.id}
                    router={routerData}
                    onClick={() => {}}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Events */}
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Recent Events</h2>
                <p className="text-sm text-muted-foreground">Latest network activities</p>
              </div>
              <button className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors">
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="h-4 bg-muted/50 rounded w-3/4"></div>
                    <div className="h-3 bg-muted/50 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 hover:bg-accent/10 rounded-xl transition-all duration-200 group border border-transparent hover:border-border/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg border ${
                        event.type === 'new_host' ? 'bg-primary/20 text-primary border-primary/30' :
                        event.type === 'ap_online' ? 'bg-secondary/20 text-secondary border-secondary/30' :
                        event.type === 'security_scan' ? 'bg-accent/20 text-accent border-accent/30' :
                        event.type === 'dhcp_conflict' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                        'bg-muted text-muted-foreground border-border'
                      }`}>
                        {event.type === 'new_host' ? <Users className="h-4 w-4" /> :
                         event.type === 'ap_online' ? <Wifi className="h-4 w-4" /> :
                         event.type === 'security_scan' ? <Shield className="h-4 w-4" /> :
                         event.type === 'dhcp_conflict' ? <AlertCircle className="h-4 w-4" /> :
                         <Activity className="h-4 w-4" />}
                      </div>
                      <span className="text-sm font-medium truncate">{event.message}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-3 font-medium">
                      {event.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-1">Quick Actions</h2>
            <p className="text-sm text-muted-foreground">Common network management tasks</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionButton key={index} {...action} />
            ))}
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}