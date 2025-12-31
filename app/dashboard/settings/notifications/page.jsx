"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  Mail, 
  MessageCircle, 
  Save, 
  Loader2, 
  Router, 
  ShieldAlert, 
  CheckCircle2, 
  Smartphone,
  AlertTriangle,
  Info
} from "lucide-react";

// --- Configuration ---

const INITIAL_RULES = [
  { 
    id: 1, 
    event: "Router Offline", 
    description: "Triggers when a Core Router stops responding to heartbeats.", 
    severity: "critical", 
    email: true, 
    whatsapp: true, 
    icon: Router 
  },
  { 
    id: 2, 
    event: "DHCP Conflict on AP", 
    description: "Triggers when a rogue DHCP server is detected on an Access Point.", 
    severity: "high", 
    email: true, 
    whatsapp: false, 
    icon: ShieldAlert 
  }
];

// --- Components ---

const Toggle = ({ checked, onChange }) => (
  <button 
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
      checked ? 'bg-primary' : 'bg-gray-200'
    }`}
  >
    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${
      checked ? 'translate-x-5' : 'translate-x-0'
    }`} />
  </button>
);

const SeverityBadge = ({ level }) => {
  const styles = {
    critical: "bg-red-50 text-red-700 border-red-200",
    high: "bg-orange-50 text-orange-700 border-orange-200",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[level]}`}>
      {level}
    </span>
  );
};

const InputGroup = ({ label, icon: Icon, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Icon className="h-4 w-4" />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
      />
    </div>
  </div>
);

// --- Main Page ---

export default function NotificationSettingsPage() {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [isSaving, setIsSaving] = useState(false);
  const [testingId, setTestingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Single Contact State
  const [contact, setContact] = useState({
    phone: "+254712345678",
    email: "admin@terra.co.ke"
  });

  const handleToggle = (id, field) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, [field]: !rule[field] } : rule
    ));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSuccessMsg("Settings saved successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 1200);
  };

  const handleTest = (id) => {
    setTestingId(id);
    setTimeout(() => setTestingId(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50/50 font-sans pb-20">
        
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              Alert Configuration
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              Define where critical system alerts are sent.
            </p>
          </div>
          
          {successMsg && (
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 text-sm font-bold border border-green-200 animate-in fade-in slide-in-from-right-5">
              <CheckCircle2 className="h-4 w-4" /> {successMsg}
            </div>
          )}
        </div>

        <div className="max-w-5xl mx-auto space-y-8">

          {/* 1. GLOBAL CONTACT SETTINGS */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                   <Smartphone className="h-5 w-5" />
                </div>
                <div>
                   <h2 className="text-lg font-bold text-gray-900">Alert Destination</h2>
                   <p className="text-xs text-gray-500">All alerts will be routed to these single points of contact.</p>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                <InputGroup 
                  label="WhatsApp Number" 
                  icon={MessageCircle} 
                  value={contact.phone} 
                  onChange={(val) => setContact({...contact, phone: val})} 
                  placeholder="+254..." 
                />
                <InputGroup 
                  label="Alert Email Address" 
                  icon={Mail} 
                  value={contact.email} 
                  onChange={(val) => setContact({...contact, email: val})} 
                  placeholder="alerts@company.com" 
                  type="email"
                />
             </div>
          </div>

          {/* 2. TRIGGER RULES TABLE */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
               <div>
                 <h2 className="text-lg font-bold text-gray-900">Trigger Logic</h2>
                 <p className="text-xs text-gray-500">Toggle channels for specific events.</p>
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/30">
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Severity</th>
                    <th className="px-6 py-4 text-center w-32">
                      <div className="flex items-center justify-center gap-1.5 text-blue-600">
                        <Mail className="h-4 w-4" /> Email
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center w-32">
                      <div className="flex items-center justify-center gap-1.5 text-green-600">
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-4">
                          <div className={`p-2.5 rounded-xl shrink-0 ${rule.severity === 'critical' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                            <rule.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-gray-900 block">{rule.event}</span>
                            <span className="text-xs text-gray-500 mt-0.5 block max-w-sm">{rule.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <SeverityBadge level={rule.severity} />
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center">
                           <Toggle checked={rule.email} onChange={() => handleToggle(rule.id, 'email')} />
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center">
                           <Toggle checked={rule.whatsapp} onChange={() => handleToggle(rule.id, 'whatsapp')} />
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => handleTest(rule.id)}
                          disabled={testingId === rule.id}
                          className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-primary transition-all disabled:text-green-600 disabled:border-green-200 disabled:bg-green-50 shadow-sm"
                        >
                          {testingId === rule.id ? "Sent!" : "Send Test"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-primary/90 transition-all disabled:opacity-70 transform hover:-translate-y-0.5"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Configuration
            </button>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
             <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
             <p className="text-xs text-blue-800 leading-relaxed">
               <strong>Note:</strong> Alerts are triggered based on the "Alert Rules" definitions. 
               WhatsApp messages are sent using the official business API and may incur standard carrier charges.
             </p>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}