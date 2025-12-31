"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  Search, 
  MessageCircle, 
  Router, 
  ShieldAlert, 
  CheckCheck, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Filter,
  Eye,
  X,
  Calendar,
  Smartphone
} from "lucide-react";

// --- Mock Data ---

const generateAlerts = () => {
  return Array.from({ length: 20 }).map((_, i) => {
    const isRouterOff = i % 2 === 0;
    return {
      id: i + 1,
      type: isRouterOff ? "Router Offline" : "DHCP Conflict",
      // Longer messages to justify the "View" modal
      message: isRouterOff 
        ? `CRITICAL ALERT: The Core Gateway at HQ (192.168.88.1) has ceased responding to SNMP polls. Last heartbeat was detected at 10:45 AM. Immediate investigation required.` 
        : `SECURITY WARNING: A Rogue DHCP server has been detected on VLAN 20 (Sales Dept). Offending MAC: 00:1B:44:11:3A:B7. The port has been automatically tagged for review.`,
      channel: "WhatsApp",
      recipient: isRouterOff ? "Admin Group" : "+254 712 345 678",
      timestamp: `${i * 12 + 2} mins ago`,
      fullTimestamp: new Date().toLocaleString(),
      status: i === 0 ? "failed" : "delivered",
      severity: isRouterOff ? "critical" : "high"
    };
  });
};

// --- Components ---

const AlertTypeBadge = ({ type }) => {
  const isRouter = type === "Router Offline";
  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg shrink-0 ${isRouter ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
        {isRouter ? <Router className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
      </div>
      <div>
        <p className="font-bold text-sm text-foreground">{type}</p>
        <p className={`text-[10px] font-bold uppercase tracking-wider ${isRouter ? 'text-red-600' : 'text-orange-600'}`}>
          {isRouter ? "Critical System" : "Security Event"}
        </p>
      </div>
    </div>
  );
};

const ChannelBadge = () => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
    <MessageCircle className="h-3.5 w-3.5" />
    WhatsApp
  </span>
);

const DeliveryStatus = ({ status }) => {
  if (status === "failed") {
    return (
      <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 w-fit">
        <AlertTriangle className="h-3 w-3" /> Failed
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 w-fit">
      <CheckCheck className="h-3.5 w-3.5" /> Delivered
    </span>
  );
};

/**
 * View Alert Details Modal
 */
const AlertDetailsModal = ({ isOpen, onClose, alert }) => {
  if (!isOpen || !alert) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative z-10 bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Alert Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400">Type</span>
                <div className="font-bold text-sm text-foreground mt-1">{alert.type}</div>
             </div>
             <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400">Status</span>
                <div className="mt-1"><DeliveryStatus status={alert.status} /></div>
             </div>
             <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400">Sent Via</span>
                <div className="mt-1"><ChannelBadge /></div>
             </div>
             <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400">Time</span>
                <div className="font-mono text-xs text-foreground mt-1 flex items-center gap-1">
                   <Clock className="h-3 w-3" /> {alert.timestamp}
                </div>
             </div>
          </div>

          {/* Full Message Box */}
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">Full Message Content</label>
            <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-sm text-green-900 leading-relaxed font-medium">
              "{alert.message}"
            </div>
          </div>

          {/* Hidden Recipient Info (Visible here only) */}
          <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-100 pt-4">
             <Smartphone className="h-4 w-4" />
             <span>Sent to: <span className="font-mono font-bold text-gray-700">{alert.recipient}</span></span>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};

// --- Main Page ---

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(generateAlerts());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter
  const filteredAlerts = alerts.filter(alert => 
    alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAlerts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);

  const handleView = (alert) => {
    setSelectedAlert(alert);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
              Alert Logs
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              History of automated notifications sent via WhatsApp.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-white border border-border rounded-xl shadow-sm text-xs font-bold flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               WhatsApp Service Online
             </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search message content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>
          
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <select className="pl-10 pr-8 py-3 bg-white border border-border rounded-xl text-sm font-medium focus:outline-none appearance-none cursor-pointer hover:border-primary/50 transition-colors">
               <option>All Alerts</option>
               <option>Router Offline</option>
               <option>DHCP Conflicts</option>
             </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  <th className="p-4 pl-6">Alert Type</th>
                  <th className="p-4">Message Preview</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4">Time Sent</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-border">
                {currentItems.length > 0 ? (
                  currentItems.map((alert) => (
                    <tr key={alert.id} className="group hover:bg-primary/[0.02] transition-colors">
                      
                      {/* Type */}
                      <td className="p-4 pl-6">
                        <AlertTypeBadge type={alert.type} />
                      </td>

                      {/* Message Preview */}
                      <td className="p-4">
                        <p className="text-sm text-gray-600 font-medium max-w-xs truncate opacity-80" title={alert.message}>
                          {alert.message}
                        </p>
                      </td>

                      {/* Channel */}
                      <td className="p-4">
                        <ChannelBadge />
                      </td>

                      {/* Time */}
                      <td className="p-4">
                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {alert.timestamp}
                         </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <DeliveryStatus status={alert.status} />
                      </td>

                      {/* Action */}
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleView(alert)}
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
                       No alerts found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-border bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
            <span className="text-sm text-muted-foreground">
              Showing <span className="font-bold text-foreground">{indexOfFirstItem + 1}</span> - <span className="font-bold text-foreground">{Math.min(indexOfLastItem, filteredAlerts.length)}</span> of <span className="font-bold text-foreground">{filteredAlerts.length}</span>
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
        </div>

      </div>

      {/* View Modal Portal */}
      <AlertDetailsModal 
        isOpen={!!selectedAlert} 
        onClose={() => setSelectedAlert(null)} 
        alert={selectedAlert} 
      />

    </DashboardLayout>
  );
}