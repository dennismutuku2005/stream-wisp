"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  Search, 
  Download, 
  Filter, 
  MapPin, 
  Globe, 
  Server, 
  Hash,
  ChevronDown,
  MoreHorizontal,
  X,
  Save,
  Lock,
  Loader2
} from "lucide-react";

// Mock Data
const initialRouters = [
  { id: 1, alias: "HQ Core Gateway", ip: "192.168.88.1", port: 8291, location: "Nairobi HQ - Server Room A" },
  { id: 2, alias: "Westlands Branch", ip: "10.20.1.1", port: 8728, location: "Westlands, 4th Floor" },
  { id: 3, alias: "Mombasa Uplink", ip: "172.16.0.254", port: 8291, location: "Mombasa Distribution Center" },
  { id: 4, alias: "Kisumu Failover", ip: "10.30.5.1", port: 8291, location: "Kisumu CBD" },
];

// --- Components ---

/** 
 * Skeleton Loader for the Modal 
 * Simulates the shape of the form inputs 
 */
const ModalSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    {/* Alias Skeleton */}
    <div>
      <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
      <div className="h-11 w-full bg-gray-100 rounded-xl"></div>
    </div>
    
    {/* IP & Port Grid Skeleton */}
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

    {/* Location Skeleton */}
    <div>
      <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
      <div className="h-11 w-full bg-gray-100 rounded-xl"></div>
    </div>

    {/* Button Skeleton */}
    <div className="flex justify-end pt-4 gap-3">
      <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
    </div>
  </div>
);

/**
 * Edit Modal Component
 */
const EditRouterModal = ({ isOpen, onClose, router, onSave }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ alias: "", location: "" });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && router) {
      setIsLoading(true);
      // Simulate API fetch delay for the skeleton effect
      const timer = setTimeout(() => {
        setFormData({ alias: router.alias, location: router.location });
        setIsLoading(false);
      }, 1500); // 1.5s delay to show off the skeleton
      return () => clearTimeout(timer);
    }
  }, [isOpen, router]);

  if (!isOpen || !router) return null;

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save delay
    setTimeout(() => {
      onSave({ ...router, ...formData });
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-foreground">Edit Router Details</h2>
            <p className="text-xs text-muted-foreground">Update configuration for ID #{router.id}</p>
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
            <div className="space-y-5">
              
              {/* Editable: Name/Alias */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Router Name (Alias)</label>
                <div className="relative">
                  <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <input 
                    type="text" 
                    value={formData.alias}
                    onChange={(e) => setFormData({...formData, alias: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* LOCKED: IP Address */}
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
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed font-mono select-none"
                    />
                  </div>
                  
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-10">
                    This IP field cannot be edited.
                    <div className="absolute bottom-[-4px] left-4 w-2 h-2 bg-black rotate-45"></div>
                  </div>
                </div>

                {/* LOCKED: Port */}
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
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed font-mono select-none"
                    />
                  </div>

                   {/* Tooltip on Hover */}
                   <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-10">
                    System port is locked.
                    <div className="absolute bottom-[-4px] left-4 w-2 h-2 bg-black rotate-45"></div>
                  </div>
                </div>
              </div>

              {/* Editable: Location */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Physical Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground"
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
            className="px-4 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-white hover:text-foreground border border-transparent hover:border-gray-200 transition-all"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
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
};

// --- Main Page Component ---

export default function RouterInventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [routers, setRouters] = useState(initialRouters);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRouter, setSelectedRouter] = useState(null);

  const filteredRouters = routers.filter((router) =>
    router.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
    router.ip.includes(searchTerm) ||
    router.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Router Inventory
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Manage your network endpoints.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-md shadow-primary/20">
            <span>Add Router</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search routers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  <th className="p-4 pl-6">Alias / Name</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Port</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRouters.map((router) => (
                  <tr key={router.id} className="group hover:bg-primary/[0.02] transition-colors">
                    <td className="p-4 pl-6 font-bold text-foreground text-sm">{router.alias}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-xs font-mono font-medium">
                        {router.ip}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-mono">{router.port}</td>
                    <td className="p-4 text-sm text-foreground">{router.location}</td>
                    
                    {/* Action Button Trigger */}
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleEditClick(router)}
                        className="p-2 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
                        title="Edit Router"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Render the Modal */}
      <EditRouterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        router={selectedRouter} 
        onSave={handleSaveChanges}
      />

    </DashboardLayout>
  );
}