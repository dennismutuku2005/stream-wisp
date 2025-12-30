"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  Search, 
  MapPin, 
  Globe, 
  Server, 
  Hash,
  MoreHorizontal,
  X,
  Save,
  Lock,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// --- Mock Data Generator (More items for pagination) ---
const generateRouters = () => {
  const base = [
    { id: 1, alias: "HQ Core Gateway", ip: "192.168.88.1", port: 8291, location: "Nairobi HQ - Server Room A" },
    { id: 2, alias: "Westlands Branch", ip: "10.20.1.1", port: 8728, location: "Westlands, 4th Floor" },
    { id: 3, alias: "Mombasa Uplink", ip: "172.16.0.254", port: 8291, location: "Mombasa Distribution Center" },
    { id: 4, alias: "Kisumu Failover", ip: "10.30.5.1", port: 8291, location: "Kisumu CBD" },
    { id: 5, alias: "Guest Wifi Controller", ip: "192.168.200.1", port: 80, location: "Nairobi HQ - Lobby" },
    { id: 6, alias: "Finance Dept Router", ip: "10.10.50.1", port: 22, location: "Nairobi HQ - 2nd Floor" },
    { id: 7, alias: "Warehouse AP Bridge", ip: "192.168.90.5", port: 8291, location: "Industrial Area - Block C" },
    { id: 8, alias: "Remote Site A", ip: "41.204.10.20", port: 8291, location: "Nakuru Town" },
    { id: 9, alias: "Remote Site B", ip: "41.204.10.21", port: 8291, location: "Eldoret Town" },
    { id: 10, alias: "Backup Link V", ip: "10.0.0.5", port: 8291, location: "Nairobi HQ - Roof" },
    { id: 11, alias: "Reception AP", ip: "192.168.88.50", port: 80, location: "Nairobi HQ - Reception" },
    { id: 12, alias: "HR Switch", ip: "192.168.88.51", port: 22, location: "Nairobi HQ - 3rd Floor" },
  ];
  return base;
};

// --- Components ---

/** 
 * Skeleton Loader for the Modal 
 */
const ModalSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div>
      <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
      <div className="h-11 w-full bg-gray-100 rounded-xl"></div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
        <div className="h-11 w-full bg-gray-100 rounded-xl"></div>
      </div>
      <div>
        <div className="h-4 w-12 bg-gray-200 rounded mb-2"></div>
        <div className="h-11 w-full bg-gray-100 rounded-xl"></div>
      </div>
    </div>
    <div>
      <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
      <div className="h-11 w-full bg-gray-100 rounded-xl"></div>
    </div>
    <div className="flex justify-end pt-4 gap-3">
      <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-32 bg-gray-300 rounded-lg"></div>
    </div>
  </div>
);

/**
 * Edit Modal Component (Portal Version)
 */
const EditRouterModal = ({ isOpen, onClose, router, onSave }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ alias: "", location: "" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen && router) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setFormData({ alias: router.alias, location: router.location });
        setIsLoading(false);
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [isOpen, router]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave({ ...router, ...formData });
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  // Prevent rendering on server or if not open
  if (!mounted || !isOpen || !router) return null;

  // Portal Content
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay: Covers whole screen */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 mx-4">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-foreground">Edit Router Details</h2>
            <p className="text-xs text-muted-foreground">ID #{router.id}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <ModalSkeleton />
          ) : (
            <div className="space-y-6">
              
              {/* Alias Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Router Name (Alias)</label>
                <div className="relative">
                  <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <input 
                    type="text" 
                    value={formData.alias}
                    onChange={(e) => setFormData({...formData, alias: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground shadow-sm"
                  />
                </div>
              </div>

              {/* Locked Fields Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* IP Address */}
                <div className="space-y-1.5 group relative">
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                    IP Address <Lock className="h-3 w-3" />
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                    <input 
                      type="text" 
                      value={router.ip} 
                      readOnly
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400 cursor-not-allowed font-mono select-none"
                    />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20">
                    System controlled field.
                    <div className="absolute bottom-[-4px] left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>

                {/* Port */}
                <div className="space-y-1.5 group relative">
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                    Port <Lock className="h-3 w-3" />
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                    <input 
                      type="text" 
                      value={router.port} 
                      readOnly
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400 cursor-not-allowed font-mono select-none"
                    />
                  </div>
                   {/* Tooltip */}
                   <div className="absolute -top-10 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20">
                    Port configuration locked.
                    <div className="absolute bottom-[-4px] left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              </div>

              {/* Location Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Physical Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-white hover:text-foreground border border-transparent hover:border-gray-200 transition-all"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// --- Main Page ---

export default function RouterInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [routers, setRouters] = useState(generateRouters());
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRouter, setSelectedRouter] = useState(null);

  // Filter Logic
  const filteredRouters = routers.filter((router) =>
    router.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
    router.ip.includes(searchTerm) ||
    router.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRouters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRouters.length / itemsPerPage);

  // Reset page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleEditClick = (router) => {
    setSelectedRouter(router);
    setIsModalOpen(true);
  };

  const handleSaveChanges = (updatedRouter) => {
    setRouters((prev) => 
      prev.map((r) => r.id === updatedRouter.id ? updatedRouter : r)
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background font-sans">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Mikrotiks
            </h1>
            <p className="text-muted-foreground text-sm">
              Tall your mikrtoik from here.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-md shadow-primary/20">
            <span>Add New Router</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Alias, IP, or Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>

        {/* Table Container */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  <th className="p-4 pl-6">Alias / Name</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Port</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentItems.length > 0 ? (
                  currentItems.map((router) => (
                    <tr key={router.id} className="group hover:bg-primary/[0.02] transition-colors">
                      <td className="p-4 pl-6 font-bold text-foreground text-sm">{router.alias}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-xs font-mono font-medium">
                          {router.ip}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground font-mono">{router.port}</td>
                      <td className="p-4 text-sm text-foreground flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {router.location}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleEditClick(router)}
                          className="p-2 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-muted-foreground">
                      No results found for "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredRouters.length > 0 && (
            <div className="p-4 border-t border-border bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                Showing <span className="font-bold text-foreground">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-bold text-foreground">
                  {Math.min(indexOfLastItem, filteredRouters.length)}
                </span>{" "}
                of <span className="font-bold text-foreground">{filteredRouters.length}</span> entries
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {/* Page Numbers */}
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
                  className="p-2 rounded-lg border border-border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Portal Modal */}
      <EditRouterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        router={selectedRouter} 
        onSave={handleSaveChanges}
      />
    </DashboardLayout>
  );
}