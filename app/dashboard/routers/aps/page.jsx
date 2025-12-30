"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  Router, 
  Wifi, 
  Users, 
  Search,
  Plus,
  Minus,
  Maximize,
  ChevronDown,
  Server
} from "lucide-react";

// --- Mock Data Generator ---
const generateAPs = (routerId, count) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: routerId * 1000 + i,
    routerId,
    name: `AP-${routerId}-${i + 1}`,
    // Varying name lengths to test overlap
    alias: i % 5 === 0 ? `Lobby Main Entrance` : `Zone ${i + 1}`,
    ip: `192.168.88.${10 + i}`,
    clients: Math.floor(Math.random() * 40),
    status: Math.random() > 0.9 ? "offline" : "online",
    signal: Math.random() > 0.7 ? "good" : "fair",
  }));
};

const MOCK_ROUTERS = [
  { id: 1, name: "HQ Core Gateway", ip: "192.168.88.1", model: "CCR1009" },
  { id: 2, name: "Westlands Branch", ip: "10.20.1.1", model: "RB4011" },
  { id: 3, name: "Mombasa Hub", ip: "172.16.0.1", model: "CCR2004" },
];

const ALL_APS = [
  ...generateAPs(1, 42), // 42 APs
  ...generateAPs(2, 15),
  ...generateAPs(3, 80), // Large amount to test no-overlap
];

// --- Components ---

const CompactAPNode = ({ ap }) => (
  <div className="flex flex-col items-center w-full min-w-[140px]">
    {/* Connector Line from Bus */}
    <div className="h-6 w-px border-l border-dashed border-gray-300"></div>
    
    {/* Card */}
    <div className={`
      relative w-full bg-white rounded-xl border p-3 shadow-sm transition-all duration-300
      hover:shadow-md hover:scale-105 hover:z-10 group cursor-pointer
      ${ap.status === 'online' ? 'border-gray-200' : 'border-red-200 bg-red-50/10'}
    `}>
      {/* Status Stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${ap.status === 'online' ? 'bg-secondary' : 'bg-red-500'}`} />

      <div className="flex flex-col items-center text-center mt-1">
        <div className={`p-1.5 rounded-full mb-2 ${ap.status === 'online' ? 'bg-secondary/10 text-secondary' : 'bg-red-100 text-red-500'}`}>
          <Wifi className="h-4 w-4" />
        </div>
        
        <h3 className="text-xs font-bold text-foreground leading-tight w-full truncate px-1" title={ap.alias}>
          {ap.alias}
        </h3>
        <p className="text-[10px] text-muted-foreground font-mono mb-2">{ap.name}</p>

        {/* Metrics Pill */}
        <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 w-full justify-center">
          <div className="flex items-center gap-1" title="Connected Clients">
            <Users className="h-3 w-3 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-600">{ap.clients}</span>
          </div>
          <div className="w-px h-3 bg-gray-200"></div>
          <div className="flex items-center gap-1" title="IP Address">
             <span className="text-[9px] text-gray-500 font-mono truncate max-w-[60px]">{ap.ip}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RouterNode = ({ router, totalAPs }) => (
  <div className="flex flex-col items-center z-20 relative">
    <div className="w-64 bg-primary text-primary-foreground p-4 rounded-2xl shadow-xl border-4 border-white ring-1 ring-gray-100 flex flex-col items-center text-center">
      <div className="p-2 bg-white/10 rounded-xl mb-2">
        <Router className="h-6 w-6 text-white" />
      </div>
      <h2 className="text-sm font-bold">{router.name}</h2>
      <p className="text-xs text-primary-foreground/70 font-mono mb-2">{router.ip}</p>
      
      <div className="bg-black/20 px-3 py-1 rounded-full text-[10px] font-medium backdrop-blur-sm">
        Managing {totalAPs} Access Points
      </div>
    </div>
    {/* Vertical Trunk Line */}
    <div className="h-12 w-1 bg-gray-200/50 relative">
        <div className="absolute inset-0 border-l-2 border-dashed border-gray-300 left-1/2 -translate-x-1/2"></div>
    </div>
  </div>
);

export default function APDistributionBoard() {
  const [selectedRouterId, setSelectedRouterId] = useState(MOCK_ROUTERS[0].id);
  const [zoom, setZoom] = useState(1);
  const [search, setSearch] = useState("");

  const activeRouter = MOCK_ROUTERS.find(r => r.id === Number(selectedRouterId));
  const activeAPs = ALL_APS.filter(ap => 
    ap.routerId === Number(selectedRouterId) && 
    (ap.name.toLowerCase().includes(search.toLowerCase()) || ap.alias.toLowerCase().includes(search.toLowerCase()) || ap.ip.includes(search))
  );

  // Zoom Logic
  const handleZoom = (delta) => setZoom(prev => Math.min(Math.max(prev + delta, 0.4), 2));

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-2rem)] flex flex-col bg-background font-sans overflow-hidden">
        
        {/* Top Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0 bg-white p-4 rounded-2xl border border-border shadow-sm">
          
          {/* Title & Stats */}
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              AP Distribution
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Visualizing network topology and signal distribution
            </p>
          </div>

          {/* Controls: Dropdown & Search */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
             
             {/* Mikrotik Selector Dropdown */}
             <div className="relative group min-w-[240px]">
                <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground absolute -top-2 left-3 bg-white px-1 z-10">
                  Select Router
                </label>
                <div className="relative">
                  <select
                    value={selectedRouterId}
                    onChange={(e) => setSelectedRouterId(e.target.value)}
                    className="w-full appearance-none bg-white border border-border rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/50 transition-all cursor-pointer shadow-sm"
                  >
                    {MOCK_ROUTERS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.ip})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
             </div>

             {/* Search Input */}
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search AP alias or IP..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent hover:bg-white hover:border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
             </div>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="relative flex-1 bg-gray-50 rounded-2xl border border-border overflow-hidden shadow-inner">
          
          {/* Dotted Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{ 
              backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', 
              backgroundSize: `${20 * zoom}px ${20 * zoom}px` 
            }} 
          />

          {/* Floating Zoom Toolbar */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-50 bg-white p-1.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-border/50 backdrop-blur-sm">
            <button onClick={() => handleZoom(0.2)} className="p-2.5 hover:bg-primary/5 text-muted-foreground hover:text-primary rounded-lg transition-colors">
              <Plus className="h-5 w-5" />
            </button>
            <div className="h-px w-full bg-border"></div>
            <button onClick={() => setZoom(1)} className="p-2.5 hover:bg-primary/5 text-muted-foreground hover:text-primary rounded-lg transition-colors">
              <Maximize className="h-5 w-5" />
            </button>
            <div className="h-px w-full bg-border"></div>
            <button onClick={() => handleZoom(-0.2)} className="p-2.5 hover:bg-primary/5 text-muted-foreground hover:text-primary rounded-lg transition-colors">
              <Minus className="h-5 w-5" />
            </button>
            <div className="text-[9px] font-bold text-center text-muted-foreground py-1">
              {Math.round(zoom * 100)}%
            </div>
          </div>

          {/* Scrollable Viewport */}
          <div className="w-full h-full overflow-auto custom-scrollbar">
            <div 
              className="min-w-full min-h-full p-10 flex flex-col items-center origin-top transition-transform duration-200 ease-out"
              style={{ transform: `scale(${zoom})` }}
            >
              
              {/* 1. Parent Node */}
              <RouterNode router={activeRouter} totalAPs={activeAPs.length} />

              {/* 2. Horizontal Distribution Bus */}
              {/* This line spans the width of the AP Grid */}
              <div className="relative w-full max-w-[90vw]">
                
                {/* The visual "Bus" Line */}
                <div className="absolute top-0 left-[2%] right-[2%] h-8 border-t-2 border-l-2 border-r-2 border-dashed border-gray-300 rounded-t-3xl -z-10"></div>
                
                {/* 3. The Grid (Responsive to prevent overlap) */}
                {/* Using CSS Grid with minmax ensures items never squish or overlap */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-6 gap-y-8 pt-8 w-full justify-items-center">
                   {activeAPs.length > 0 ? (
                      activeAPs.map((ap) => (
                        <CompactAPNode key={ap.id} ap={ap} />
                      ))
                   ) : (
                      <div className="col-span-full py-20 text-center opacity-50">
                        <Wifi className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500 font-medium">No Access Points found</p>
                      </div>
                   )}
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}