"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  ShieldAlert, 
  MapPin, 
  Router, 
  Clock, 
  MoreHorizontal, 
  X, 
  Ban, 
  CheckCircle2, 
  AlertTriangle, 
  BellRing,
  Activity,
  ChevronRight,
  ChevronLeft,
  Eye,
  Search,
  RefreshCw,
  Lock
} from "lucide-react";

// --- Mock Data ---

const generateConflicts = () => {
  // Generates 15 items to demonstrate pagination
  return Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    apName: i % 2 === 0 ? `Lobby AP-${i}` : `Warehouse Link-${i}`,
    location: i % 2 === 0 ? "Headquarters - Lobby" : "Industrial Area - Block C",
    routerName: i % 3 === 0 ? "HQ Core Gateway" : "Branch Router",
    type: i % 4 === 0 ? "Rogue DHCP Server" : "IP Duplicate",
    mac: `14:DD:A9:${(10+i).toString(16).toUpperCase()}:2C:4D`,
    conflictingIp: i % 4 === 0 ? `192.168.88.${i+1}` : "N/A",
    detectedAt: `${i * 5 + 2} mins ago`,
    duration: `0h ${i + 12}m`,
    severity: i % 5 === 0 ? "critical" : i % 3 === 0 ? "high" : "medium",
    isBlocked: i % 2 === 0,
    notificationSent: i % 3 !== 0,
  }));
};

// --- Components ---

const SeverityBadge = ({ level }) => {
  const styles = {
    critical: "bg-red-50 text-red-700 border-red-200",
    high: "bg-orange-50 text-orange-700 border-orange-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[level] || styles.medium}`}>
      {level}
    </span>
  );
};

const ConflictDetailsModal = ({ isOpen, onClose, conflict }) => {
  if (!isOpen || !conflict) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative z-10 bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 bg-red-50/50 flex items-start justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-red-100 text-red-600 rounded-lg"><ShieldAlert className="h-6 w-6" /></div>
             <div>
               <h2 className="text-lg font-bold text-foreground">Conflict Details</h2>
               <p className="text-xs text-red-600 font-medium">Incident #{conflict.id} • {conflict.type}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors"><X className="h-5 w-5 text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${conflict.isBlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} flex flex-col items-center text-center`}>
                 {conflict.isBlocked ? <CheckCircle2 className="h-6 w-6 text-green-600 mb-2" /> : <Activity className="h-6 w-6 text-gray-400 mb-2" />}
                 <span className="text-xs font-bold text-gray-500 uppercase">Protection</span>
                 <span className={`text-sm font-bold ${conflict.isBlocked ? 'text-green-700' : 'text-gray-700'}`}>{conflict.isBlocked ? "Auto-Blocked" : "Monitoring"}</span>
              </div>
              <div className={`p-4 rounded-xl border ${conflict.notificationSent ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} flex flex-col items-center text-center`}>
                 <BellRing className={`h-6 w-6 mb-2 ${conflict.notificationSent ? 'text-blue-600' : 'text-gray-400'}`} />
                 <span className="text-xs font-bold text-gray-500 uppercase">Alerts</span>
                 <span className={`text-sm font-bold ${conflict.notificationSent ? 'text-blue-700' : 'text-gray-700'}`}>{conflict.notificationSent ? "Admin Notified" : "Pending"}</span>
              </div>
           </div>
           <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Forensic Data</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div><span className="text-xs text-gray-500 block mb-1">Source</span><div className="font-medium text-gray-800 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> {conflict.location}</div></div>
                <div><span className="text-xs text-gray-500 block mb-1">Duration</span><div className="font-medium text-gray-800 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-gray-400" /> {conflict.duration}</div></div>
                <div><span className="text-xs text-gray-500 block mb-1">MAC</span><div className="font-mono font-bold text-red-600 bg-red-50 px-2 py-1 rounded w-fit text-xs border border-red-100">{conflict.mac}</div></div>
                <div><span className="text-xs text-gray-500 block mb-1">Target IP</span><div className="font-mono font-medium text-gray-700">{conflict.conflictingIp}</div></div>
              </div>
           </div>
           {conflict.isBlocked ? (
             <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 border border-gray-200"><span className="font-bold">System Action:</span> Bridge filter rule created.</div>
           ) : (
             <button className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2"><Ban className="h-4 w-4" /> Block Device Manually</button>
           )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const TableSkeleton = () => (
  <div className="w-full animate-pulse">
    {Array.from({length: 5}).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-4 w-1/3"><div className="h-10 w-10 bg-gray-100 rounded-lg"></div><div className="space-y-2 w-full"><div className="h-4 w-1/2 bg-gray-100 rounded"></div><div className="h-3 w-3/4 bg-gray-100 rounded"></div></div></div>
        <div className="h-4 w-20 bg-gray-100 rounded"></div>
        <div className="h-4 w-20 bg-gray-100 rounded"></div>
        <div className="h-4 w-10 bg-gray-100 rounded"></div>
      </div>
    ))}
  </div>
);

// --- Main Page ---

export default function DHCPConflictsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [conflicts, setConflicts] = useState([]);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load Data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setConflicts(generateConflicts());
      setIsLoading(false);
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setConflicts(generateConflicts());
      setIsLoading(false);
    }, 1000);
  };

  // Filter
  const filteredConflicts = conflicts.filter(c => 
    c.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredConflicts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredConflicts.length / itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background  font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
              DHCP Conflicts
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Monitor and resolve network IP collisions and rogue DHCP servers.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <button onClick={handleRefresh} className="p-2.5 bg-white border border-border rounded-xl text-gray-500 hover:text-primary hover:border-primary/50 transition-all">
               <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
             </button>
             <div className="bg-red-50 text-red-700 px-4 py-2 rounded-xl border border-red-100 font-bold text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{conflicts.filter(c => !c.isBlocked).length} Active Threats</span>
             </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Location or Conflict Type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>

        {/* Table Container */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  <th className="p-4 pl-6">Conflict Source</th>
                  <th className="p-4">Type / Severity</th>
                  <th className="p-4">Offending MAC</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr><td colSpan={6} className="p-0"><TableSkeleton /></td></tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((conflict) => (
                    <tr key={conflict.id} className="group hover:bg-red-50/30 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${conflict.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{conflict.location}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Router className="h-3 w-3" /> {conflict.apName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1.5">
                           <div className="text-sm font-medium text-foreground">{conflict.type}</div>
                           <SeverityBadge level={conflict.severity} />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 w-fit">
                          {conflict.mac}
                        </div>
                        {conflict.conflictingIp !== "N/A" && <div className="text-xs text-gray-400 mt-1">Target: {conflict.conflictingIp}</div>}
                      </td>
                      <td className="p-4">
                         {conflict.isBlocked ? (
                           <div className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200 w-fit">
                             <Lock className="h-3 w-3" /> Blocked
                           </div>
                         ) : (
                           <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-full border border-red-200 w-fit animate-pulse">
                             <Activity className="h-3 w-3" /> Active
                           </div>
                         )}
                         <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                           <BellRing className="h-3 w-3" /> {conflict.notificationSent ? 'Notified' : 'Pending'}
                         </div>
                      </td>
                      <td className="p-4">
                         <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4 text-gray-400" />
                            {conflict.duration}
                         </div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => setSelectedConflict(conflict)} className="px-3 py-1.5 bg-white border border-border hover:border-primary/50 text-xs font-bold text-gray-600 hover:text-primary rounded-lg transition-colors shadow-sm inline-flex items-center gap-1">
                          <Eye className="h-3 w-3" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-muted-foreground">
                       <div className="flex flex-col items-center gap-2">
                         <CheckCircle2 className="h-10 w-10 text-green-500 opacity-50" />
                         <p className="font-medium text-gray-900">No conflicts detected</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {!isLoading && filteredConflicts.length > 0 && (
            <div className="p-4 border-t border-border bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
              <span className="text-sm text-muted-foreground">
                Showing <span className="font-bold text-foreground">{indexOfFirstItem + 1}</span> - <span className="font-bold text-foreground">{Math.min(indexOfLastItem, filteredConflicts.length)}</span> of <span className="font-bold text-foreground">{filteredConflicts.length}</span>
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

      <ConflictDetailsModal 
        isOpen={!!selectedConflict} 
        onClose={() => setSelectedConflict(null)} 
        conflict={selectedConflict} 
      />

    </DashboardLayout>
  );
}