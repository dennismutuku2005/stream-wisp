"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Router,
  Wifi,
  Activity,
  Plus,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Fingerprint,
  Badge,
  WifiOff,
  ShieldAlert,
  Server
} from "lucide-react";

// --- Components ---

/** 
 * Metric Card 
 */
const MetricCard = ({ title, value, change, icon: Icon, trend }) => (
  <div className="group p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300">
        <Icon className="h-5 w-5" />
      </div>
      {change && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
          trend === 'up' 
            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {change}
        </span>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-foreground tracking-tight">{value}</h3>
    </div>
  </div>
);

/**
 * Status Pill
 */
const StatusPill = ({ status, text }) => {
  const styles = {
    online: "bg-green-50 text-green-700 border-green-200",
    offline: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-orange-50 text-orange-700 border-orange-200",
    active: "bg-secondary text-secondary-foreground border-transparent font-bold", 
  };

  const activeStyle = styles[status] || styles.online;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${activeStyle}`}>
      {status === 'online' && <span className="w-1 h-1 rounded-full bg-green-500 mr-1.5 animate-pulse" />}
      {text}
    </span>
  );
};

/**
 * Router Row (Compacted)
 * Reduced padding to p-3 to make it smaller
 */
const RouterRow = ({ name, ip, status, model }) => (
  <div className="flex items-center justify-between p-3 border border-border rounded-xl mb-2 hover:border-primary/40 transition-colors bg-white hover:shadow-sm">
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
        <Router className="h-4 w-4" />
      </div>
      <div>
        <h4 className="font-bold text-xs text-foreground">{name}</h4>
        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{ip}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="hidden sm:block text-right">
        <p className="text-[10px] font-semibold text-foreground">{model}</p>
      </div>
      <StatusPill status={status} text={status === 'online' ? 'Active' : 'Down'} />
    </div>
  </div>
);

/**
 * Quick Action Item
 * Styled as a clean, actionable list item with a count badge
 */
const QuickActionItem = ({ icon: Icon, label, count, colorClass, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-white hover:border-primary/30 hover:shadow-sm transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${colorClass} group-hover:scale-105 transition-transform`}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-bold text-foreground">{label}</span>
    </div>
    {count !== undefined && (
      <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
        {count}
      </span>
    )}
    {count === undefined && <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-primary" />}
  </button>
);

/**
 * Main Action Button (Header)
 */
const HeaderActionButton = ({ icon: Icon, label }) => (
  <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground hover:opacity-90 rounded-xl text-sm font-bold transition-all shadow-sm shadow-primary/20">
    <Icon className="h-4 w-4" />
    {label}
  </button>
);

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background font-sans">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
              Overview
            </h1>
            <p className="text-sm text-muted-foreground">
              Network health summary for <span className="font-bold text-primary">Terra</span>.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2.5 text-xs bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-56 transition-all shadow-sm"
              />
            </div>
            <HeaderActionButton icon={Plus} label="Add AP" />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard 
            title="Active Routers" 
            value="12" 
            change="+1" 
            trend="up" 
            icon={Router} 
          />
          <MetricCard 
            title="Total APs" 
            value="48" 
            change="+4" 
            trend="up" 
            icon={Badge} 
          />
          <MetricCard 
            title="Network Load" 
            value="64%" 
            change="-5%" 
            trend="down" 
            icon={Activity} 
          />
          <MetricCard 
            title="Security Score" 
            value="98" 
            icon={Fingerprint} 
            trend="up"
            change="High"
          />
        </div>

        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column: Router List (Takes up 2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Device Status</h2>
              <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                View All <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
              <div className="space-y-1">
                <RouterRow name="HQ Gateway" ip="192.168.1.1" model="CCR1009" status="online" />
                <RouterRow name="Warehouse Main" ip="192.168.20.1" model="RB4011" status="online" />
                <RouterRow name="Guest Network" ip="192.168.88.1" model="hAP ax3" status="warning" />
                <RouterRow name="Backup Link" ip="10.0.0.1" model="LHG 5" status="offline" />
                <RouterRow name="Sales Office" ip="10.20.50.1" model="RB5009" status="online" />
              </div>
            </div>
          </div>

          {/* Right Column: Quick Actions & Status (Takes up 1/3) */}
          <div className="space-y-6">
            
            {/* Quick Actions / Alerts */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Attention Needed</h2>
              <div className="space-y-3">
                <QuickActionItem 
                  icon={WifiOff} 
                  label="Offline APs" 
                  count={3} 
                  colorClass="bg-red-50 text-red-600" 
                  onClick={() => {}}
                />
                <QuickActionItem 
                  icon={ShieldAlert} 
                  label="DHCP Conflicts" 
                  count={1} 
                  colorClass="bg-orange-50 text-orange-600" 
                  onClick={() => {}}
                />
                <QuickActionItem 
                  icon={Server} 
                  label="Mikrotik Routers" 
                  count={12} 
                  colorClass="bg-blue-50 text-blue-600" 
                  onClick={() => {}}
                />
              </div>
            </div>

            {/* "Services" section */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Services</h2>
              <div className="flex flex-wrap gap-2">
                <StatusPill status="active" text="VPN Access" />
                <StatusPill status="active" text="Firewall" />
                <StatusPill status="active" text="Hotspot" />
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                  DPI Analysis
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}