"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  Wifi, 
  Router, 
  Search, 
  Info, 
  Loader2, 
  Plus, 
  Signal, 
  SignalHigh, 
  SignalMedium, 
  SignalLow, 
  MapPin,
  X,
  Radar,
  ArrowRight,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

// --- Mock Data ---
const MOCK_ROUTERS = [
  { id: 1, name: "HQ Core Gateway", ip: "192.168.88.1" },
  { id: 2, name: "Westlands Branch", ip: "10.20.1.1" },
  { id: 3, name: "Mombasa Uplink", ip: "172.16.0.1" },
];

// Helper to generate random found devices
const generateFoundDevices = () => {
  return Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    mac: `BC:22:3D:4E:5F:${(10 + i).toString(16).toUpperCase()}`,
    ip: `192.168.88.${200 + i}`,
    interface: "wlan1-station",
    signal: Math.floor(Math.random() * (-50 - -90) + -90), // -50 to -90 dBm
    uptime: "00:42:15",
    manufacturer: i % 3 === 0 ? "Mikrotik" : "Unknown",
  }));
};

// --- Components ---

/**
 * Signal Strength Visualizer
 */
const SignalBadge = ({ dbm }) => {
  let color = "text-gray-400";
  let Icon = Signal;
  let label = "Weak";

  if (dbm > -60) { color = "text-green-500"; Icon = SignalHigh; label = "Excellent"; }
  else if (dbm > -75) { color = "text-primary"; Icon = SignalMedium; label = "Good"; }
  else if (dbm > -85) { color = "text-orange-500"; Icon = SignalLow; label = "Fair"; }
  else { color = "text-red-500"; Icon = SignalLow; label = "Poor"; }

  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${color}`} />
      <div className="flex flex-col">
        <span className="text-xs font-bold text-foreground">{dbm} dBm</span>
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for Scanning State
 */
const ScanningSkeleton = () => (
  <div className="w-full space-y-4 animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-gray-100 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-100 rounded"></div>
            <div className="h-3 w-24 bg-gray-100 rounded"></div>
          </div>
        </div>
        <div className="h-8 w-20 bg-gray-100 rounded-lg"></div>
        <div className="h-8 w-24 bg-gray-100 rounded-lg"></div>
      </div>
    ))}
  </div>
);

/**
 * Radar Scanning Animation
 */
const RadarAnimation = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative flex items-center justify-center h-24 w-24">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/20 opacity-75 duration-1000"></span>
      <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-primary/30 opacity-75 delay-150 duration-1000"></span>
      <div className="relative inline-flex rounded-full h-12 w-12 bg-primary items-center justify-center shadow-lg shadow-primary/40">
        <Loader2 className="h-6 w-6 text-white animate-spin" />
      </div>
    </div>
    <h3 className="mt-6 text-lg font-bold text-foreground">Scanning Network...</h3>
    <p className="text-sm text-muted-foreground"> querying neighbor discovery & ARP tables</p>
  </div>
);

/**
 * Modal to Select Router for Scanning
 */
const ScanSelectorModal = ({ isOpen, onClose, onStartScan }) => {
  const [selectedRouter, setSelectedRouter] = useState(MOCK_ROUTERS[0].id);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative z-10 bg-white w-full max-w-md rounded-2xl shadow-2xl border border-border p-6 animate-in fade-in zoom-in-95 duration-200 mx-4">
        
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <Radar className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Scan for Devices</h2>
          <p className="text-sm text-muted-foreground mt-1">Select a Mikrotik router to initiate a neighbor scan.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Target Router</label>
            <div className="relative">
              <Router className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={selectedRouter}
                onChange={(e) => setSelectedRouter(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer font-medium"
              >
                {MOCK_ROUTERS.map((r) => (
                  <option key={r.id} value={r.id}>{r.name} ({r.ip})</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            onClick={() => onStartScan(selectedRouter)}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            Start Scan <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- Main Page Component ---

export default function UnregisteredAPsPage() {
  const [scanState, setScanState] = useState("idle"); // idle | scanning | results
  const [modalOpen, setModalOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [scannedRouter, setScannedRouter] = useState(null);

  const handleStartScan = (routerId) => {
    setModalOpen(false);
    setScanState("scanning");
    const router = MOCK_ROUTERS.find(r => r.id === routerId);
    setScannedRouter(router);

    // Simulate Scan Delay
    setTimeout(() => {
      setResults(generateFoundDevices());
      setScanState("results");
    }, 3000); // 3 seconds scan
  };

  const handleRegister = (device) => {
    // Logic to open "Add AP" modal would go here
    alert(`Opening registration for ${device.mac}`);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background font-sans">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2">
            Unregistered APs
          </h1>
          <p className="text-muted-foreground text-sm">
            Discover and onboard new devices from your network.
          </p>
        </div>

        {/* Info Notification */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-8 flex items-start gap-4 shadow-sm">
          <div className="p-2 bg-white rounded-full text-primary shadow-sm shrink-0">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1">About this feature</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This tool scans the selected Mikrotik router's <strong>ARP table</strong> and <strong>Neighbor Discovery</strong> list to find devices that are connected but not yet registered in your inventory.
            </p>
          </div>
        </div>

        {/* Actions Toolbar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-foreground">
            {scanState === "results" ? `Found Devices on ${scannedRouter?.name}` : "Scan Results"}
          </h2>
          
          <button 
            onClick={() => setModalOpen(true)}
            disabled={scanState === "scanning"}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {scanState === "results" ? <RefreshCw className="h-4 w-4" /> : <Radar className="h-4 w-4" />}
            <span>{scanState === "results" ? "Scan Again" : "Scan Now"}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white border border-border rounded-2xl shadow-sm min-h-[400px] overflow-hidden relative">
          
          {/* STATE 1: IDLE */}
          {scanState === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <Search className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No Scan Data</h3>
              <p className="text-sm text-muted-foreground max-w-xs mt-2">
                Click the "Scan Now" button to search for unregistered devices on your network.
              </p>
            </div>
          )}

          {/* STATE 2: SCANNING */}
          {scanState === "scanning" && (
            <div className="p-8">
              <RadarAnimation />
              <div className="mt-8 max-w-3xl mx-auto">
                <ScanningSkeleton />
              </div>
            </div>
          )}

          {/* STATE 3: RESULTS TABLE */}
          {scanState === "results" && (
            <div className="flex flex-col animate-in fade-in duration-500">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-bold">
                      <th className="p-4 pl-6">Device Info (MAC/IP)</th>
                      <th className="p-4">Signal Strength</th>
                      <th className="p-4">Interface</th>
                      <th className="p-4">Uptime</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {results.map((device) => (
                      <tr key={device.id} className="group hover:bg-primary/[0.02] transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex flex-col">
                            <span className="font-mono text-sm font-bold text-foreground">{device.mac}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              {device.ip} 
                              <span className="w-1 h-1 rounded-full bg-gray-300"></span> 
                              {device.manufacturer}
                            </span>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <SignalBadge dbm={device.signal} />
                        </td>
                        
                        <td className="p-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-mono border border-gray-200">
                            {device.interface}
                          </span>
                        </td>
                        
                        <td className="p-4 text-sm text-muted-foreground font-mono">
                          {device.uptime}
                        </td>
                        
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleRegister(device)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 text-secondary-foreground border border-secondary/20 hover:bg-secondary hover:text-white rounded-lg text-xs font-bold transition-all"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Register
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 bg-gray-50/50 border-t border-border text-xs text-muted-foreground text-center">
                Found {results.length} unregistered devices.
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Selector Portal */}
      <ScanSelectorModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onStartScan={handleStartScan} 
      />

    </DashboardLayout>
  );
}