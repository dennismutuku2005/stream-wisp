"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  Search, 
  Bell, 
  ShieldAlert, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Info,
  Lock,
  Zap,
  Mail,
  MessageCircle,
  Smartphone,
  Activity,
  WifiOff,
  Server
} from "lucide-react";

// --- Mock Data ---

const ALERT_RULES = [
  {
    id: 1,
    name: "Core Router Offline",
    category: "Availability",
    condition: "ICMP Echo Fail",
    threshold: "3 missed polls (3 min)",
    severity: "critical",
    channels: ["whatsapp", "email", "sms"],
    description: "Triggers when the core gateway stops responding to pings from the cloud controller.",
    icon: Server
  },
  {
    id: 2,
    name: "Access Point Down",
    category: "Availability",
    condition: "ARP/SNMP Timeout",
    threshold: "10 mins continuous",
    severity: "high",
    channels: ["email", "app"],
    description: "Triggers when an AP is unreachable but the parent router is still online.",
    icon: WifiOff
  },
  {
    id: 3,
    name: "Rogue DHCP Server",
    category: "Security",
    condition: "Unidentified Offer",
    threshold: "Immediate (1 packet)",
    severity: "critical",
    channels: ["whatsapp", "email"],
    description: "Detects unauthorized DHCP offer packets on access ports to prevent IP conflicts.",
    icon: ShieldAlert
  },
  {
    id: 4,
    name: "High Latency Warning",
    category: "Performance",
    condition: "RTT > 200ms",
    threshold: "Avg over 15 mins",
    severity: "medium",
    channels: ["email"],
    description: "Alerts when round-trip time to the gateway exceeds acceptable voice/video standards.",
    icon: Activity
  },
  {
    id: 5,
    name: "Bridge Loop Detected",
    category: "Security",
    condition: "BPDU Guard Trip",
    threshold: "Immediate",
    severity: "critical",
    channels: ["whatsapp", "sms"],
    description: "Triggers if a network loop is detected. The port is usually auto-disabled by the switch.",
    icon: Zap
  },
  {
    id: 6,
    name: "AP Reboot Detected",
    category: "Stability",
    condition: "Uptime Reset",
    threshold: "> 3 times in 1 hour",
    severity: "medium",
    channels: ["email"],
    description: "Identifies devices that are power cycling frequently (potential power/cable issue).",
    icon: Clock
  }
];

// --- Components ---

/**
 * Severity Badge
 */
const SeverityBadge = ({ level }) => {
  const styles = {
    critical: "bg-red-50 text-red-700 border-red-200",
    high: "bg-orange-50 text-orange-700 border-orange-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    low: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[level] || styles.low}`}>
      {level}
    </span>
  );
};

/**
 * Channel Icons
 */
const ChannelIcons = ({ channels }) => (
  <div className="flex items-center gap-2">
    {channels.includes("whatsapp") && (
      <div className="p-1.5 bg-green-50 rounded-md text-green-600 border border-green-100" title="WhatsApp">
        <MessageCircle className="h-3.5 w-3.5" />
      </div>
    )}
    {channels.includes("email") && (
      <div className="p-1.5 bg-blue-50 rounded-md text-blue-600 border border-blue-100" title="Email">
        <Mail className="h-3.5 w-3.5" />
      </div>
    )}
    {channels.includes("sms") && (
      <div className="p-1.5 bg-purple-50 rounded-md text-purple-600 border border-purple-100" title="SMS">
        <Smartphone className="h-3.5 w-3.5" />
      </div>
    )}
  </div>
);

/**
 * Table Loading Skeleton
 */
const TableSkeleton = () => (
  <div className="w-full animate-pulse">
    {Array.from({length: 5}).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-4 w-1/3">
           <div className="h-10 w-10 bg-gray-100 rounded-lg"></div>
           <div className="space-y-2 w-full">
              <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
              <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
           </div>
        </div>
        <div className="h-4 w-24 bg-gray-100 rounded"></div>
        <div className="h-4 w-20 bg-gray-100 rounded"></div>
        <div className="h-4 w-16 bg-gray-100 rounded"></div>
      </div>
    ))}
  </div>
);

// --- Main Page ---

export default function AlertRulesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [rules, setRules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setRules(ALERT_RULES);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter
  const filteredRules = rules.filter(rule => 
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    rule.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRules.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRules.length / itemsPerPage);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background  font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
              Alert Rules
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Reference guide for system automated triggers and thresholds.
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
             <Lock className="h-4 w-4 text-gray-400" />
             <span className="text-xs font-bold text-gray-500">System Managed (Read Only)</span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-8 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-4">
           <div className="p-2 bg-white rounded-full text-primary shrink-0">
             <Info className="h-5 w-5" />
           </div>
           <div>
             <h3 className="text-sm font-bold text-foreground">How alerts work</h3>
             <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
               These rules are pre-configured by the Stream Engine to ensure optimal network monitoring. 
               When a condition is met, the system waits for the <strong>Threshold</strong> duration before dispatching notifications to the listed channels.
             </p>
           </div>
        </div>

        {/* Toolbar */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search rules..."
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
                  <th className="p-4 pl-6">Rule Name</th>
                  <th className="p-4">Condition</th>
                  <th className="p-4">Trigger Threshold</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Channels</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr><td colSpan={6} className="p-0"><TableSkeleton /></td></tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((rule) => {
                    const Icon = rule.icon || Bell;
                    return (
                      <tr key={rule.id} className="group hover:bg-primary/[0.02] transition-colors">
                        
                        {/* Name & Desc */}
                        <td className="p-4 pl-6">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500 mt-1">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-foreground">{rule.name}</div>
                              <div className="text-xs text-muted-foreground mt-0.5 max-w-xs leading-snug">
                                {rule.description}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Condition */}
                        <td className="p-4">
                          <span className="font-mono text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                            {rule.condition}
                          </span>
                        </td>

                        {/* Threshold */}
                        <td className="p-4">
                           <div className="flex items-center gap-2 text-sm text-foreground">
                              <Clock className="h-3.5 w-3.5 text-gray-400" />
                              {rule.threshold}
                           </div>
                        </td>

                        {/* Severity */}
                        <td className="p-4">
                          <SeverityBadge level={rule.severity} />
                        </td>

                        {/* Channels */}
                        <td className="p-4">
                          <ChannelIcons channels={rule.channels} />
                        </td>

                        {/* Status (View Only) */}
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                             <div className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded border border-gray-200 flex items-center gap-1">
                               <Lock className="h-3 w-3" /> Default
                             </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-muted-foreground">
                       No rules found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-border bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
            <span className="text-sm text-muted-foreground">
              Showing <span className="font-bold text-foreground">{indexOfFirstItem + 1}</span> - <span className="font-bold text-foreground">{Math.min(indexOfLastItem, filteredRules.length)}</span> of <span className="font-bold text-foreground">{filteredRules.length}</span>
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
    </DashboardLayout>
  );
}