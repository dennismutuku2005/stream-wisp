"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { 
  Calendar, 
  Download, 
  Filter, 
  Activity, 
  WifiOff, 
  ShieldAlert, 
  Router,
  TrendingDown,
  TrendingUp,
  RefreshCw
} from "lucide-react";

// --- Mock Data ---

const UPTIME_DATA = [
  { time: "Mon", online: 12, offline: 0 },
  { time: "Tue", online: 11, offline: 1 },
  { time: "Wed", online: 12, offline: 0 },
  { time: "Thu", online: 10, offline: 2 },
  { time: "Fri", online: 9,  offline: 3 }, // Outage spike
  { time: "Sat", online: 11, offline: 1 },
  { time: "Sun", online: 12, offline: 0 },
];

const CONFLICT_DATA = [
  { time: "00:00", conflicts: 0 },
  { time: "04:00", conflicts: 1 },
  { time: "08:00", conflicts: 5 }, // Morning rush
  { time: "12:00", conflicts: 2 },
  { time: "16:00", conflicts: 8 }, // Afternoon shift
  { time: "20:00", conflicts: 3 },
  { time: "23:59", conflicts: 1 },
];

const PROBLEMATIC_ROUTERS = [
  { name: "HQ Core Gateway", issues: 45, color: "#6366f1" }, // Indigo
  { name: "Westlands Branch", issues: 23, color: "#ec4899" }, // Pink
  { name: "Mombasa Uplink", issues: 12, color: "#10b981" }, // Emerald
  { name: "Kisumu Failover", issues: 5,  color: "#f59e0b" }, // Amber
];

// --- Components ---

/**
 * Custom Tooltip for Charts
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
        <p className="text-xs font-bold text-gray-500 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-bold flex items-center gap-2" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Loading Skeleton
 */
const ReportSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
    <div className="h-80 bg-gray-100 rounded-2xl"></div>
    <div className="h-80 bg-gray-100 rounded-2xl"></div>
    <div className="h-80 bg-gray-100 rounded-2xl col-span-1 lg:col-span-2"></div>
  </div>
);

// --- Main Page ---

export default function StreamReportPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [timeRange]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
              Stream Report
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Network performance analytics and incident trends.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
             {/* Time Filter */}
             <div className="flex bg-white border border-border rounded-xl p-1 shadow-sm">
                {["24h", "7d", "30d"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      timeRange === range 
                        ? "bg-gray-100 text-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {range}
                  </button>
                ))}
             </div>

             <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-md shadow-primary/20">
               <Download className="h-4 w-4" /> Export PDF
             </button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
           <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div>
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Uptime</p>
                   <h3 className="text-2xl font-bold text-foreground mt-1">99.4%</h3>
                 </div>
                 <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                   <Activity className="h-5 w-5" />
                 </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium text-green-600">
                 <TrendingUp className="h-3 w-3 mr-1" /> +0.2% vs last week
              </div>
           </div>

           <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div>
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Outages</p>
                   <h3 className="text-2xl font-bold text-foreground mt-1">14</h3>
                 </div>
                 <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                   <WifiOff className="h-5 w-5" />
                 </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium text-red-600">
                 <TrendingDown className="h-3 w-3 mr-1" /> +2 new events today
              </div>
           </div>

           <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div>
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">DHCP Conflicts</p>
                   <h3 className="text-2xl font-bold text-foreground mt-1">8</h3>
                 </div>
                 <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                   <ShieldAlert className="h-5 w-5" />
                 </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-medium text-orange-600">
                 High activity detected in Warehouse
              </div>
           </div>
        </div>

        {/* Charts Section */}
        {isLoading ? (
          <ReportSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 1. Router Availability (Area Chart) */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-foreground text-lg">Router Availability</h3>
                  <p className="text-xs text-muted-foreground">Online vs Offline Routers (Last 7 Days)</p>
                </div>
                <div className="flex gap-2 text-xs font-medium">
                   <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Online</div>
                   <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500"></span> Offline</div>
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={UPTIME_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOffline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="online" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorOnline)" name="Online" />
                    <Area type="monotone" dataKey="offline" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorOffline)" name="Offline" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. DHCP Conflicts (Line Chart) */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-foreground text-lg">DHCP Conflicts</h3>
                  <p className="text-xs text-muted-foreground">Incident frequency over 24 Hours</p>
                </div>
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                   <ShieldAlert className="h-4 w-4" />
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={CONFLICT_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="conflicts" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff'}} name="Conflicts" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. Problematic APs per Mikrotik (Bar Chart) */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm col-span-1 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-foreground text-lg">Problematic Access Points</h3>
                  <p className="text-xs text-muted-foreground">Which Mikrotik Core Routers have the most disconnected APs?</p>
                </div>
                <div className="p-2 bg-gray-50 text-gray-600 rounded-lg">
                   <Router className="h-4 w-4" />
                </div>
              </div>

              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PROBLEMATIC_ROUTERS} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                    <YAxis dataKey="name" type="category" width={150} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#4b5563', fontWeight: 600}} />
                    <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                    <Bar dataKey="issues" radius={[0, 6, 6, 0]} barSize={30} name="Failing APs">
                      {PROBLEMATIC_ROUTERS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}