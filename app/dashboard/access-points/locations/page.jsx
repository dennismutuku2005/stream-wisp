"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  Search, 
  MapPin, 
  Router, 
  Wifi, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  X,
  Server,
  CheckCircle2,
  AlertCircle,
  Activity,
  Signal
} from "lucide-react";

// --- Mock Data Generators ---

const generateLocations = () => {
  const locations = [
    "Headquarters - Server Room", "Headquarters - Lobby", "Headquarters - 1st Floor", "Headquarters - 2nd Floor", 
    "Headquarters - Cafeteria", "Westlands Branch - Main", "Westlands Branch - Office A", "Mombasa Distribution Center", 
    "Kisumu Regional Office", "Eldoret Supply Depot", "Nakuru Sales Point", "Nairobi CBD - Showroom", 
    "Industrial Area - Warehouse A", "Industrial Area - Warehouse B", "Remote Site - Alpha", "Remote Site - Beta"
  ];

  return locations.map((loc, i) => ({
    id: i + 1,
    name: loc,
    type: loc.includes("Server") ? "Critical Infrastructure" : loc.includes("Warehouse") ? "Storage" : "Office Space",
    routerCount: loc.includes("Server") ? 2 : Math.random() > 0.7 ? 1 : 0,
    apCount: Math.floor(Math.random() * 12) + 1,
    status: Math.random() > 0.1 ? "active" : "maintenance"
  }));
};

// Generate fake details for the modal
const generateLocationDetails = (location) => {
  return {
    ...location,
    routers: Array.from({ length: location.routerCount }).map((_, i) => ({
      id: i,
      name: `${location.name.split(" - ")[0]} Gateway ${i + 1}`,
      ip: `192.168.${10 + location.id}.${1 + i}`,
      model: "Mikrotik CCR1009",
      status: "online"
    })),
    aps: Array.from({ length: location.apCount }).map((_, i) => ({
      id: i,
      name: `AP-${location.id}-${i + 1}`,
      mac: `00:1A:2B:3C:${(10 + i).toString(16).toUpperCase()}`,
      model: i % 3 === 0 ? "cAP ax" : "cAP ac",
      status: Math.random() > 0.1 ? "online" : "offline",
      clients: Math.floor(Math.random() * 25)
    }))
  };
};

// --- Components ---

const StatusPill = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
    status === 'active' || status === 'online'
      ? 'bg-green-50 text-green-700 border border-green-200' 
      : 'bg-amber-50 text-amber-700 border border-amber-200'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${status === 'active' || status === 'online' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
    {status}
  </span>
);

/**
 * View Details Modal
 */
const ViewLocationModal = ({ isOpen, onClose, location }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (isOpen && location) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setDetails(generateLocationDetails(location));
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, location]);

  if (!isOpen || !location) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative z-10 bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                {location.type}
              </span>
              <StatusPill status={location.status} />
            </div>
            <h2 className="text-xl font-bold text-foreground">{location.name}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-white rounded-full border border-gray-100 hover:bg-gray-100 text-muted-foreground transition-colors shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 bg-white custom-scrollbar">
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-gray-100 rounded-xl"></div>
                <div className="h-24 bg-gray-100 rounded-xl"></div>
              </div>
              <div className="space-y-3">
                <div className="h-6 w-32 bg-gray-100 rounded"></div>
                <div className="h-16 bg-gray-100 rounded-xl"></div>
                <div className="h-16 bg-gray-100 rounded-xl"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-gray-50/50 flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm text-primary">
                    <Router className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Routers</p>
                    <p className="text-2xl font-bold text-foreground">{details.routers.length}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-gray-50/50 flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm text-secondary">
                    <Wifi className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Access Points</p>
                    <p className="text-2xl font-bold text-foreground">{details.aps.length}</p>
                  </div>
                </div>
              </div>

              {details.routers.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" /> Installed Routers
                  </h3>
                  <div className="space-y-2">
                    {details.routers.map((router) => (
                      <div key={router.id} className="flex items-center justify-between p-3 border border-border rounded-xl hover:border-primary/30 transition-colors bg-white shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{router.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{router.ip}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">{router.model}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" /> Access Point List
                </h3>
                
                {details.aps.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {details.aps.map((ap) => (
                      <div key={ap.id} className="p-3 border border-border rounded-xl bg-white hover:shadow-md transition-all flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Wifi className={`h-4 w-4 ${ap.status === 'online' ? 'text-secondary' : 'text-gray-300'}`} />
                            <span className="text-sm font-bold text-foreground">{ap.name}</span>
                          </div>
                          {ap.status === 'online' 
                            ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                            : <AlertCircle className="h-4 w-4 text-gray-300" />
                          }
                        </div>
                        <div className="flex justify-between items-end mt-1">
                          <span className="text-[10px] font-mono text-muted-foreground bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                            {ap.mac}
                          </span>
                          <span className="text-[10px] font-bold text-foreground flex items-center gap-1">
                            <Signal className="h-3 w-3 text-gray-400" /> {ap.clients} Clients
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                    <Wifi className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-muted-foreground">No Access Points installed here.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {!isLoading && (
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm text-gray-700"
                >
                    Close
                </button>
            </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// --- Main Page ---

export default function APLocationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setLocations(generateLocations());
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleView = (location) => {
    setSelectedLocation(location);
    setViewModalOpen(true);
  };

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLocations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Location Directory
            </h1>
            <p className="text-muted-foreground text-sm">
              View network density across physical locations.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-xl border border-border shadow-sm flex flex-col items-center">
               <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Sites</span>
               <span className="text-lg font-bold text-primary">{locations.length}</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>

        {/* Data Table */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  <th className="p-4 pl-6">Location Name</th>
                  <th className="p-4">Routers</th>
                  <th className="p-4">Access Points</th>
                  {/* Type Column Removed */}
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">View</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({length: 5}).map((_, i) => (
                    <tr key={i}>
                       <td className="p-4"><div className="h-10 w-48 bg-gray-100 rounded animate-pulse"></div></td>
                       <td className="p-4"><div className="h-6 w-12 bg-gray-100 rounded animate-pulse"></div></td>
                       <td className="p-4"><div className="h-6 w-12 bg-gray-100 rounded animate-pulse"></div></td>
                       <td className="p-4"><div className="h-6 w-20 bg-gray-100 rounded animate-pulse"></div></td>
                       <td className="p-4"></td>
                    </tr>
                  ))
                ) : currentItems.length > 0 ? (
                  currentItems.map((loc) => (
                    <tr key={loc.id} className="group hover:bg-primary/[0.02] transition-colors cursor-pointer" onClick={() => handleView(loc)}>
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-sm text-foreground">{loc.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Router className="h-4 w-4 text-muted-foreground" />
                          <span className={`text-sm font-mono font-bold ${loc.routerCount > 0 ? 'text-foreground' : 'text-gray-400'}`}>
                            {loc.routerCount}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-mono font-bold text-foreground">
                            {loc.apCount}
                          </span>
                        </div>
                      </td>
                      {/* Type Cell Removed */}
                      <td className="p-4">
                        <StatusPill status={loc.status} />
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={(e) => { e.stopPropagation(); handleView(loc); }} className="p-2 rounded-lg text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors">
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-16 text-center text-muted-foreground">
                       No locations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && filteredLocations.length > 0 && (
            <div className="p-4 border-t border-border bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
              <span className="text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLocations.length)} of {filteredLocations.length}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ViewLocationModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        location={selectedLocation} 
      />

    </DashboardLayout>
  );
}