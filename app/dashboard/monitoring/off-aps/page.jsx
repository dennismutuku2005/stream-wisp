"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  WifiOff, 
  MapPin, 
  Router, 
  Clock, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  BellRing,
  BellOff,
  MoreHorizontal,
  RefreshCw,
  Activity,
  X,
  Eye,
  Calendar,
  AlertTriangle,
  HardDrive
} from "lucide-react";

// --- Mock Data ---

// Helper to format duration cleanly
const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours < 24) return `${hours}h ${mins}m`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}d ${remainingHours}h ${mins}m`;
};

const generateOfflineAPs = () => {
  return Array.from({ length: 20 }).map((_, i) => {
    // Generate realistic varying downtimes
    const minutesDown = (i + 1) * 35 + (i * i); 
    const now = new Date();
    const offlineDate = new Date(now.getTime() - minutesDown * 60000);

    return {
      id: i + 1,
      name: `AP-${(100 + i)}`,
      mac: `B8:69:F4:1A:${(10 + i).toString(16).toUpperCase().padStart(2, '0')}:00`,
      model: i % 3 === 0 ? "Mikrotik cAP ax" : "Mikrotik wAP LTE",
      location: i % 3 === 0 ? "Warehouse - Loading Bay" : `Floor ${Math.floor(i / 2) + 1} - Corridor`,
      routerName: i % 2 === 0 ? "HQ Core Gateway" : "Branch Router A",
      lastKnownIp: `192.168.88.${100 + i}`,
      offlineSince: offlineDate.toLocaleString(),
      duration: formatDuration(minutesDown),
      isNotified: i % 3 !== 0,
      severity: minutesDown > 1440 ? "critical" : "warning" // Critical if > 24 hours
    };
  });
};

// --- Components ---

/**
 * Offline Details Modal
 */
const OfflineDetailsModal = ({ isOpen, onClose, ap }) => {
  if (!isOpen || !ap) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative z-10 bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-red-50/50 flex items-start justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-red-100 text-red-600 rounded-lg shadow-sm border border-red-200">
               <WifiOff className="h-6 w-6" />
             </div>
             <div>
               <h2 className="text-lg font-bold text-foreground">Device Offline</h2>
               <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                 <AlertTriangle className="h-3 w-3" /> Critical Alert
               </p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
           
           {/* Primary Info Card */}
           <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Device Name</span>
                <p className="font-bold text-foreground text-sm">{ap.name}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Model</span>
                <p className="font-bold text-foreground text-sm">{ap.model}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">MAC Address</span>
                <p className="font-mono text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200 w-fit mt-1">
                  {ap.mac}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Last IP</span>
                <p className="font-mono text-xs text-gray-600 mt-1">{ap.lastKnownIp}</p>
              </div>
           </div>

           {/* Timeline / Status */}
           <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground border-b border-gray-100 pb-2">Outage Timeline</h3>
              
              <div className="flex items-start gap-4">
                 <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="w-px h-10 bg-gray-200 my-1"></div>
                 </div>
                 <div>
                    <span className="text-xs text-gray-500">Total Downtime</span>
                    <p className="text-lg font-bold text-red-600">{ap.duration}</p>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                    <Calendar className="h-4 w-4" />
                 </div>
                 <div>
                    <span className="text-xs text-gray-500">Connection Lost At</span>
                    <p className="text-sm font-medium text-gray-700">{ap.offlineSince}</p>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    {ap.isNotified ? <BellRing className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                 </div>
                 <div>
                    <span className="text-xs text-gray-500">Alert Status</span>
                    <p className="text-sm font-medium text-gray-700">
                      {ap.isNotified 
                        ? "Admin team notified via Email & SMS." 
                        : "Notification pending or failed."}
                    </p>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>,
    document.body
  );
};

/**
 * Table Loading Skeleton
 */
const TableSkeleton = () => (
  <div className="w-full animate-pulse">
    {Array.from({length: 6}).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
        <div className="flex items-center gap-4 w-1/3">
          <div className="h-10 w-10 bg-gray-100 rounded-lg"></div>
          <div className="space-y-2 w-full">
            <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
            <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
          </div>
        </div>
        <div className="h-4 w-24 bg-gray-100 rounded"></div>
        <div className="h-4 w-20 bg-gray-100 rounded"></div>
        <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
      </div>
    ))}
  </div>
);

/**
 * Notification Badge
 */
const NotificationBadge = ({ sent }) => {
  if (sent) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
        <BellRing className="h-3 w-3" /> Sent
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
      <BellOff className="h-3 w-3" /> Pending
    </span>
  );
};

// --- Main Page ---

export default function OfflineAPsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAP, setSelectedAP] = useState(null); // Modal State
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load Data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData(generateOfflineAPs());
      setIsLoading(false);
    }, 1200); 
    return () => clearTimeout(timer);
  }, []);

  // Filter
  const filteredData = data.filter(ap => 
    ap.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ap.routerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ap.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setData(generateOfflineAPs()); 
      setIsLoading(false);
    }, 1000);
  };

  const handleView = (ap) => {
    setSelectedAP(ap);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background 8 font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
              Offline Devices
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Real-time monitor of disconnected Access Points.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end">
               <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Down</span>
               <span className="text-2xl font-bold text-red-600 leading-none">{data.length}</span>
             </div>
             
             <button 
               onClick={handleRefresh}
               className="p-2.5 bg-white border border-border rounded-xl text-gray-500 hover:text-primary hover:border-primary/50 transition-all shadow-sm"
             >
               <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
             </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Location, Name, or Router..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>

        {/* Table Container */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-red-50/30 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  <th className="p-4 pl-6">AP Details</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Connected Router</th>
                  <th className="p-4">Offline Duration</th>
                  <th className="p-4">Notification</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <TableSkeleton />
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((ap) => (
                    <tr key={ap.id} className="group hover:bg-red-50/10 transition-colors">
                      
                      {/* AP Details */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <WifiOff className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-foreground">{ap.name}</div>
                            <div className="text-[10px] text-muted-foreground font-mono bg-gray-100 px-1.5 py-0.5 rounded w-fit mt-0.5">
                              {ap.mac}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{ap.location}</span>
                        </div>
                      </td>

                      {/* Router */}
                      <td className="p-4">
                         <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                           <Router className="h-3.5 w-3.5 opacity-50" />
                           {ap.routerName}
                         </div>
                      </td>

                      {/* Duration */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-red-400" />
                          <div>
                            <span className="block text-sm font-bold text-red-700">{ap.duration}</span>
                            <span className="text-[10px] text-gray-400">Since {ap.offlineSince.split(',')[1]}</span>
                          </div>
                        </div>
                      </td>

                      {/* Notification */}
                      <td className="p-4">
                        <NotificationBadge sent={ap.isNotified} />
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleView(ap)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 hover:border-primary/50 text-xs font-bold text-gray-600 hover:text-primary rounded-lg transition-colors shadow-sm"
                        >
                          <Eye className="h-3 w-3" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                           <Activity className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">All Systems Operational</h3>
                        <p className="text-sm">No offline access points detected.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {!isLoading && filteredData.length > 0 && (
            <div className="p-4 border-t border-border bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
              <span className="text-sm text-muted-foreground">
                Showing <span className="font-bold text-foreground">{indexOfFirstItem + 1}</span> - <span className="font-bold text-foreground">{Math.min(indexOfLastItem, filteredData.length)}</span> of <span className="font-bold text-foreground">{filteredData.length}</span>
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-white border border-border text-foreground hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modal Portal */}
      <OfflineDetailsModal 
        isOpen={!!selectedAP} 
        onClose={() => setSelectedAP(null)} 
        ap={selectedAP} 
      />

    </DashboardLayout>
  );
}