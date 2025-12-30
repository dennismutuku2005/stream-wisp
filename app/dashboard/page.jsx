"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout"; // Assuming this exists
import {
  Router,
  Wifi,
  Activity,
  RefreshCw,
  Plus,
  ShieldCheck,
  Zap,
  Server,
  Bell,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Fingerprint,
  Badge
} from "lucide-react";

// Mock Data
const mockUserData = { username: "Admin", company: "Terra" };

// --- Components ---

/** 
 * Metric Card 
 * Style: Clean white with subtle border, matching the input fields in the image.
 * Icon: Uses the Indigo primary color.
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
 * Style: Matches the "Credit Scoring", "ID Verification" pink pills from the image.
 */
const StatusPill = ({ status, text }) => {
  const styles = {
    online: "bg-green-50 text-green-700 border-green-200",
    offline: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-orange-50 text-orange-700 border-orange-200",
    // Special 'Terra' style for active tags
    active: "bg-secondary text-secondary-foreground border-transparent font-bold", 
  };

  const activeStyle = styles[status] || styles.online;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${activeStyle}`}>
      {status === 'online' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />}
      {status === 'offline' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />}
      {text}
    </span>
  );
};

/**
 * Router Row
 * Style: Looks like the "Select Country" input field from the image.
 */
const RouterRow = ({ name, ip, status, model }) => (
  <div className="flex items-center justify-between p-4 border border-border rounded-xl mb-3 hover:border-primary/40 transition-colors bg-white dark:bg-card/50">
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
        <Router className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-bold text-sm text-foreground">{name}</h4>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">{ip}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="hidden sm:block text-right">
        <p className="text-xs font-semibold text-foreground">{model}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Model</p>
      </div>
      <StatusPill status={status} text={status === 'online' ? 'Active' : 'Down'} />
    </div>
  </div>
);

/**
 * Action Button
 * Style: Matches the big "Sign Up" button (Solid Indigo).
 */
const ActionButton = ({ icon: Icon, label, variant = "primary" }) => {
  const base = "flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200";
  const styles = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm shadow-primary/20",
    outline: "bg-transparent border border-border text-foreground hover:bg-muted hover:border-primary/30",
    ghost: "bg-primary/5 text-primary hover:bg-primary/10"
  };

  return (
    <button className={`${base} ${styles[variant]}`}>
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background font-sans">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
              Overview
            </h1>
            <p className="text-muted-foreground">
              Manage your <span className="font-bold text-primary">Mikrotik</span> network infrastructure.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search devices..." 
                className="pl-9 pr-4 py-2.5 text-sm bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
              />
            </div>
            <button className="p-2.5 bg-white border border-border rounded-lg hover:border-primary/40 text-muted-foreground hover:text-primary transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <ActionButton icon={Plus} label="Add AP" variant="primary" />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <MetricCard 
            title="Active Routers" 
            value="12" 
            change="+2.5%" 
            trend="up" 
            icon={Router} 
          />
          <MetricCard 
            title="Total Access Points" 
            value="48" 
            change="+12%" 
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
            value="98/100" 
            icon={Fingerprint} 
            trend="up"
            change="Secure"
          />
        </div>

        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Router List (Takes up 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Device Management</h2>
              <button className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
                View All <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              {/* Table Header */}
              <div className="flex items-center justify-between mb-6 text-sm font-semibold text-muted-foreground px-1">
                <span>Device Name</span>
                <span className="hidden sm:block">Model</span>
              </div>

              {/* Rows - styled like input fields */}
              <div className="space-y-1">
                <RouterRow name="HQ Gateway" ip="192.168.1.1" model="CCR1009" status="online" />
                <RouterRow name="Warehouse Main" ip="192.168.20.1" model="RB4011" status="online" />
                <RouterRow name="Guest Network" ip="192.168.88.1" model="hAP ax3" status="warning" />
                <RouterRow name="Backup Link" ip="10.0.0.1" model="LHG 5" status="offline" />
              </div>
            </div>
          </div>

          {/* Right Column: Quick Actions & Status (Takes up 1/3) */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
            
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Common tasks and configuration shortcuts.
              </p>
              
              <ActionButton icon={Zap} label="Run Speed Test" variant="outline" />
              <ActionButton icon={RefreshCw} label="Reboot System" variant="outline" />
              <ActionButton icon={Server} label="Update Firmware" variant="outline" />
            </div>

            {/* "Services" section styled like the Tags in your image */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Active Services</h2>
              <div className="flex flex-wrap gap-2">
                <StatusPill status="active" text="VPN Access" />
                <StatusPill status="active" text="Firewall" />
                <StatusPill status="active" text="Hotspot" />
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                  DPI Analysis
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                  Container
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}