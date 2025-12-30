"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  Search, 
  MapPin, 
  Wifi, 
  Router, 
  MoreHorizontal, 
  X, 
  Plus, 
  Filter,
  CheckCircle2,
  XCircle,
  Tag,
  ChevronDown,
  Loader2,
  Trash2,
  Save,
  Pencil,
  EyeOff,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Lock
} from "lucide-react";

// --- Mock Data ---
const MOCK_ROUTERS = [
  { id: 1, name: "HQ Core Gateway" },
  { id: 2, name: "Westlands Branch" },
  { id: 3, name: "Mombasa Uplink" },
];

const generateAPs = () => {
  return Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    mac: `00:1A:2B:3C:4D:${(10 + i).toString(16).toUpperCase()}`,
    location: i % 3 === 0 ? "Lobby Area" : `Floor ${Math.floor(i / 2) + 1} Corridor`,
    routerId: (i % 3) + 1,
    status: i === 3 ? "untracked" : (Math.random() > 0.2 ? "online" : "offline"),
    tags: i % 2 === 0 ? ["VIP", "5GHz"] : ["Staff"],
    lastSeen: "2 mins ago"
  }));
};

// --- Components ---

const StatusBadge = ({ status }) => {
  const styles = {
    online: "bg-green-50 text-green-700 border-green-200",
    offline: "bg-red-50 text-red-700 border-red-200",
    untracked: "bg-gray-100 text-gray-500 border-gray-200 dashed-border",
  };

  const icons = {
    online: <CheckCircle2 className="h-3 w-3" />,
    offline: <XCircle className="h-3 w-3" />,
    untracked: <EyeOff className="h-3 w-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize border ${styles[status] || styles.offline}`}>
      {icons[status] || icons.offline}
      {status}
    </span>
  );
};

// --- MODALS ---

/**
 * Add / Edit Modal (Reused for both to keep code clean)
 */
const APFormModal = ({ isOpen, onClose, onSave, initialData, mode = "add" }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    mac: "",
    location: "",
    routerId: MOCK_ROUTERS[0].id,
    tags: ""
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setFormData({
          mac: initialData.mac,
          location: initialData.location,
          routerId: initialData.routerId,
          tags: initialData.tags ? initialData.tags.join(", ") : ""
        });
      } else {
        setFormData({ mac: "", location: "", routerId: MOCK_ROUTERS[0].id, tags: "" });
      }
    }
  }, [isOpen, initialData, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      const payload = {
        ...initialData, // keep ID if editing
        mac: formData.mac.toUpperCase(),
        location: formData.location,
        routerId: Number(formData.routerId),
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
        status: mode === 'add' ? 'offline' : initialData.status
      };
      
      onSave(payload);
      setIsSaving(false);
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative z-10 bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 mx-4">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-foreground">{mode === "add" ? "Add New AP" : "Edit Access Point"}</h2>
            <p className="text-xs text-muted-foreground">{mode === "add" ? "Register new device" : `Updating ${formData.mac}`}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <div className="space-y-1.5 group">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                MAC Address {mode === 'edit' && <Lock className="h-3 w-3 text-muted-foreground" />}
              </label>
              <div className="relative">
                <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  required
                  disabled={mode === 'edit'}
                  placeholder="00:00:00:00:00:00"
                  value={formData.mac}
                  onChange={(e) => setFormData({...formData, mac: e.target.value})}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono uppercase ${mode === 'edit' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Physical Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Connected Router</label>
              <div className="relative">
                <Router className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={formData.routerId}
                  onChange={(e) => setFormData({...formData, routerId: e.target.value})}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  {MOCK_ROUTERS.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Tags</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="VIP, Mesh..."
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-white hover:text-foreground border border-transparent hover:border-gray-200 transition-all">Cancel</button>
            <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {mode === "add" ? "Create AP" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

/**
 * Delete Confirmation Modal
 */
const DeleteModal = ({ isOpen, onClose, onConfirm, apName }) => {
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative z-10 bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-border p-6 animate-in fade-in zoom-in-95 duration-200 mx-4">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-red-100 text-red-600 rounded-full mb-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Delete Access Point?</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Permanently remove <span className="font-mono font-bold text-foreground">{apName}</span>?
          </p>
          <div className="flex gap-3 w-full">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50">Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 shadow-lg shadow-red-200">Delete</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- Main Page ---

export default function AccessPointsPage() {
  const [aps, setAPs] = useState(generateAPs());
  const [activeMenuId, setActiveMenuId] = useState(null); // Which dropdown is open?
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRouter, setFilterRouter] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Modals
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAP, setSelectedAP] = useState(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Filter Logic
  const filteredAPs = aps.filter(ap => {
    const matchesSearch = ap.mac.toLowerCase().includes(searchTerm.toLowerCase()) || ap.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRouter = filterRouter === "all" || ap.routerId === Number(filterRouter);
    const matchesStatus = filterStatus === "all" || ap.status === filterStatus;
    return matchesSearch && matchesRouter && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAPs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAPs.length / itemsPerPage);

  // --- Handlers ---

  const handleOpenAdd = () => {
    setModalMode("add");
    setSelectedAP(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (ap, e) => {
    e.stopPropagation();
    setModalMode("edit");
    setSelectedAP(ap);
    setFormModalOpen(true);
    setActiveMenuId(null);
  };

  const handleOpenDelete = (ap, e) => {
    e.stopPropagation();
    setSelectedAP(ap);
    setDeleteModalOpen(true);
    setActiveMenuId(null);
  };

  const handleUntrack = (apId, e) => {
    e.stopPropagation();
    setAPs(prev => prev.map(p => p.id === apId ? { ...p, status: "untracked" } : p));
    setActiveMenuId(null);
  };

  const handleSaveForm = (data) => {
    if (modalMode === "add") {
      setAPs([{ ...data, id: Math.random() }, ...aps]);
    } else {
      setAPs(prev => prev.map(p => p.id === data.id ? data : p));
    }
  };

  const handleConfirmDelete = () => {
    setAPs(prev => prev.filter(p => p.id !== selectedAP.id));
    setDeleteModalOpen(false);
  };

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const getRouterName = (id) => MOCK_ROUTERS.find(r => r.id === id)?.name || "Unknown";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Access Points</h1>
            <p className="text-muted-foreground text-sm">Manage physical AP locations and settings.</p>
          </div>
          <button onClick={handleOpenAdd} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-md shadow-primary/20 self-start md:self-auto">
            <Plus className="h-4 w-4" /> <span>Add New AP</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search Location or MAC..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm" />
          </div>
          <div className="md:col-span-3 relative">
            <Router className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-70" />
            <select value={filterRouter} onChange={(e) => setFilterRouter(e.target.value)} className="w-full pl-10 pr-8 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm appearance-none cursor-pointer">
              <option value="all">All Routers</option>
              {MOCK_ROUTERS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-3 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-70" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full pl-10 pr-8 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm appearance-none cursor-pointer">
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="untracked">Untracked</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  <th className="p-4 pl-6">AP Details</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Router</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentItems.length > 0 ? (
                  currentItems.map((ap) => (
                    <tr key={ap.id} className={`group transition-colors ${ap.status === 'untracked' ? 'bg-gray-50 opacity-60' : 'hover:bg-primary/[0.02]'}`}>
                      <td className="p-4 pl-6">
                        <div className="flex flex-col">
                           <span className="font-mono text-sm font-semibold text-foreground">{ap.mac}</span>
                           <span className="text-[10px] text-muted-foreground">ID: {ap.id}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary shrink-0" /> {ap.location}
                      </td>
                      <td className="p-4">
                         <div className="flex items-center gap-2 text-xs font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100 w-fit text-gray-600">
                           <Router className="h-3 w-3" /> {getRouterName(ap.routerId)}
                         </div>
                      </td>
                      <td className="p-4"><StatusBadge status={ap.status} /></td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {ap.tags.map((tag, i) => (
                            <span key={i} className="text-[10px] bg-secondary/10 text-secondary-foreground px-1.5 py-0.5 rounded font-semibold">{tag}</span>
                          ))}
                        </div>
                      </td>
                      
                      {/* ACTIONS COLUMN */}
                      <td className="p-4 text-right relative">
                        <button 
                          onClick={(e) => toggleMenu(ap.id, e)}
                          className={`p-2 rounded-lg transition-colors ${activeMenuId === ap.id ? 'bg-gray-100 text-foreground' : 'text-muted-foreground hover:bg-gray-50'}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === ap.id && (
                          <div className="absolute right-8 top-8 z-50 w-40 bg-white rounded-xl shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                            <div className="py-1">
                              <button onClick={(e) => handleOpenEdit(ap, e)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary flex items-center gap-2">
                                <Pencil className="h-4 w-4" /> Edit
                              </button>
                              <button onClick={(e) => handleUntrack(ap.id, e)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-foreground flex items-center gap-2">
                                <EyeOff className="h-4 w-4" /> Untrack
                              </button>
                              <div className="h-px bg-gray-100 my-1"></div>
                              <button onClick={(e) => handleOpenDelete(ap, e)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2">
                                <Trash2 className="h-4 w-4" /> Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                   <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">No APs found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredAPs.length > 0 && (
            <div className="p-4 border-t border-border bg-gray-50/30 flex justify-between items-center mt-auto">
              <span className="text-sm text-muted-foreground">Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAPs.length)} of {filteredAPs.length}</span>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border rounded-lg hover:bg-white disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border rounded-lg hover:bg-white disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      <APFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} onSave={handleSaveForm} initialData={selectedAP} mode={modalMode} />
      <DeleteModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleConfirmDelete} apName={selectedAP?.mac} />
    </DashboardLayout>
  );
}