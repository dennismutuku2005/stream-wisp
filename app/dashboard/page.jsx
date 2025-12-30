"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { colors } from "@/lib/colors";
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
} from "lucide-react";

// Mock user data
const mockUserData = { username: "Admin" };

// Stat Card Component with updated colors
const StatCard = ({ title, value, icon: Icon, color, subtitle, isLoading, suffix = "" }) => {
  const colorClasses = {
    primary: { 
      gradient: "from-purple-50 to-purple-100/50",
      icon: "bg-purple-100 text-purple-600 border-purple-200",
      text: "text-purple-600",
      glow: "shadow-purple-100"
    },
    secondary: { 
      gradient: "from-pink-50 to-pink-100/50",
      icon: "bg-pink-100 text-pink-600 border-pink-200",
      text: "text-pink-600",
      glow: "shadow-pink-100"
    },
    destructive: { 
      gradient: "from-red-50 to-red-100/50",
      icon: "bg-red-100 text-red-600 border-red-200",
      text: "text-red-600",
      glow: "shadow-red-100"
    },
    accent: { 
      gradient: "from-purple-50 to-indigo-50",
      icon: "bg-purple-100 text-purple-500 border-purple-200",
      text: "text-purple-500",
      glow: "shadow-purple-100"
    }
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <div className={`relative overflow-hidden bg-white rounded-xl p-5 border border-gray-200 hover:border-purple-200 transition-all duration-300 hover:shadow-md group h-full`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}></div>
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</p>
          {isLoading ? (
            <div className="h-8 w-28 bg-gray-100 rounded-lg animate-pulse mt-2"></div>
          ) : (
            <>
              <div className={`text-3xl font-bold ${colors.text} mb-1.5 tracking-tight`}>
                {typeof value === "number" && value > 1000 ? value.toLocaleString() : value}
                {suffix}
              </div>
              {subtitle && (
                <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
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
      classes: "bg-green-100 text-green-700 border-green-200"
    },
    offline: { 
      label: "Offline", 
      classes: "bg-red-100 text-red-700 border-red-200"
    },
    warning: { 
      label: "Warning", 
      classes: "bg-amber-100 text-amber-700 border-amber-200"
    },
  };

  const config = statusConfig[status] || statusConfig.online;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${status === 'online' ? 'bg-green-500' : status === 'offline' ? 'bg-red-500' : 'bg-amber-500'} animate-pulse`}></span>
      {config.label}
    </span>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, title, onClick, color }) => {
  const colorClasses = {
    primary: { 
      bg: "from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200", 
      icon: "bg-purple-100 text-purple-600 border-purple-200",
      border: "border-purple-100 hover:border-purple-300"
    },
    secondary: { 
      bg: "from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200", 
      icon: "bg-pink-100 text-pink-600 border-pink-200",
      border: "border-pink-100 hover:border-pink-300"
    },
    accent: { 
      bg: "from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200", 
      icon: "bg-indigo-100 text-indigo-600 border-indigo-200",
      border: "border-indigo-100 hover:border-indigo-300"
    },
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden flex flex-col items-center justify-center p-5 bg-gradient-to-br ${colors.bg} rounded-xl transition-all duration-300 border ${colors.border} hover:shadow-md group w-full`}
    >
      <div className={`p-3 rounded-xl ${colors.icon} border backdrop-blur-sm mb-3 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-6 w-6" />
      </div>
      <span className="font-semibold text-gray-800 text-sm">{title}</span>
    </button>
  );
};

// Router Tile Component
const RouterTile = ({ router, onClick }) => {
  return (
    <div 
      className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all duration-300 cursor-pointer hover:shadow-sm"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl border backdrop-blur-sm ${router.status === "online" ? "bg-purple-100 text-purple-600 border-purple-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
          <Router className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm mb-0.5">{router.name}</p>
          <p className="text-xs text-gray-500 font-medium">{router.ip}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={router.status} />
        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Network Dashboard</h1>
              <p className="text-gray-600 font-medium">
                Welcome back, <span className="text-purple-600 font-semibold">{userData?.username}</span> • Stream Mikrotik Monitor
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-md disabled:opacity-50 text-gray-700"
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
            />
            <StatCard
              title="Total APs"
              value={stats.totalAPs}
              icon={Wifi}
              color="secondary"
              isLoading={isLoading}
              subtitle={`${stats.onlineAPs} online`}
            />
            <StatCard
              title="Network Health"
              value={stats.networkHealth}
              icon={Activity}
              color="accent"
              isLoading={isLoading}
              subtitle="Overall status"
              suffix="%"
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
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Router Status</h2>
                  <p className="text-sm text-gray-500">All Mikrotik routers in your network</p>
                </div>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 transition-colors">
                  View All <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div className="h-12 w-12 bg-gray-100 rounded-xl"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
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
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Recent Events</h2>
                  <p className="text-sm text-gray-500">Latest network activities</p>
                </div>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 transition-colors">
                  View All <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between animate-pulse">
                      <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 hover:bg-purple-50/50 rounded-xl transition-all duration-200 group border border-transparent hover:border-purple-100"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg border ${
                          event.type === 'new_host' ? 'bg-purple-100 text-purple-600 border-purple-200' :
                          event.type === 'ap_online' ? 'bg-pink-100 text-pink-600 border-pink-200' :
                          event.type === 'security_scan' ? 'bg-green-100 text-green-600 border-green-200' :
                          event.type === 'dhcp_conflict' ? 'bg-red-100 text-red-600 border-red-200' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {event.type === 'new_host' ? <Users className="h-4 w-4" /> :
                           event.type === 'ap_online' ? <Wifi className="h-4 w-4" /> :
                           event.type === 'security_scan' ? <Shield className="h-4 w-4" /> :
                           event.type === 'dhcp_conflict' ? <AlertCircle className="h-4 w-4" /> :
                           <Activity className="h-4 w-4" />}
                        </div>
                        <span className="text-sm font-medium truncate text-gray-700">{event.message}</span>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-3 font-medium">
                        {event.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Quick Actions</h2>
              <p className="text-sm text-gray-500">Common network management tasks</p>
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