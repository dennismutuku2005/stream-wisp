"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  Loader2, 
  CheckCircle2, 
  BellRing, 
  Smartphone, 
  AlertCircle, 
  KeyRound, 
  Check,
  Fingerprint, // Replaced Shield with Fingerprint
  Globe
} from "lucide-react";

// --- Components ---

/**
 * Premium Input Field
 */
const InputGroup = ({ label, icon: Icon, type = "text", value, onChange, placeholder, disabled = false }) => (
  <div className="space-y-2 group">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider group-focus-within:text-primary transition-colors duration-200">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-gray-400 group-focus-within:text-primary transition-colors duration-200">
        <Icon className="h-4 w-4" />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 placeholder-gray-400 
        focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:ring-offset-1
        disabled:bg-gray-100 disabled:text-gray-400 transition-all duration-200 shadow-sm"
      />
    </div>
  </div>
);

/**
 * Modern Toggle Switch
 */
const ToggleSwitch = ({ checked, onChange }) => (
  <button 
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative w-12 h-7 rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 ${
      checked ? 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'bg-gray-200 shadow-inner'
    }`}
  >
    <span 
      className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-all duration-300 cubic-bezier(0.4, 0.0, 0.2, 1) ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

/**
 * Section Card
 */
const SettingsCard = ({ title, description, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-lg hover:shadow-gray-200/50 hover:border-primary/20 transition-all duration-500 overflow-hidden group">
    <div className="p-6 md:p-8">
      <div className="flex items-start gap-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 group-hover:from-primary/10 group-hover:to-indigo-50/30 group-hover:border-primary/20 transition-all duration-500 shrink-0 shadow-sm">
          <Icon className="h-6 w-6 text-gray-500 group-hover:text-primary transition-colors duration-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">{description}</p>
        </div>
      </div>
      {children}
    </div>
  </div>
);

// --- Main Page ---

export default function GeneralSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [profile, setProfile] = useState({ fullName: "Administrator", email: "admin@terra.co.ke", phone: "+254 712 345 678" });
  const [security, setSecurity] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [prefs, setPrefs] = useState({ emailNotifs: true, whatsappNotifs: false });

  const handleUpdate = (e, msg) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg("");
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 1500);
  };

  return (
    <DashboardLayout>
      {/* Background Pattern */}
      <div className="min-h-screen bg-gray-50/50 font-sans pb-10 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className=" max-w-5xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Account Settings</h1>
              <p className="text-gray-500 font-medium">Manage your personal details and system preferences.</p>
            </div>
            
            {/* Success Toast */}
            {successMsg && (
              <div className="animate-in fade-in slide-in-from-right-10 duration-300 px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 text-sm font-bold border border-green-200 shadow-sm">
                <CheckCircle2 className="h-4 w-4" /> {successMsg}
              </div>
            )}
          </div>

          <div className="grid gap-8">
            
            {/* 1. CONTACT INFO */}
            <SettingsCard 
              title="Personal Information" 
              description="Used for account recovery and official system communications."
              icon={User}
            >
              <form onSubmit={(e) => handleUpdate(e, "Profile updated")} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <InputGroup 
                    label="Full Name" icon={User} value={profile.fullName} 
                    onChange={(e) => setProfile({...profile, fullName: e.target.value})} 
                  />
                  <div className="hidden md:block"></div> 
                  
                  <InputGroup 
                    label="Email Address" icon={Mail} type="email" value={profile.email} 
                    onChange={(e) => setProfile({...profile, email: e.target.value})} 
                  />
                  
                  <InputGroup 
                    label="Mobile (WhatsApp)" icon={Smartphone} type="tel" value={profile.phone} 
                    onChange={(e) => setProfile({...profile, phone: e.target.value})} placeholder="+254..."
                  />
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button type="submit" disabled={isLoading} className="relative group overflow-hidden px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-70">
                    <span className="relative z-10 flex items-center gap-2">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Changes
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-10 group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                </div>
              </form>
            </SettingsCard>

            {/* 2. SECURITY */}
            <SettingsCard 
              title="Login & Security" 
              description="Ensure your account is secure with a strong password."
              icon={Fingerprint} 
            >
              <form onSubmit={(e) => handleUpdate(e, "Password updated")} className="space-y-6">
                <div className="max-w-md space-y-5">
                  <InputGroup 
                    label="Current Password" icon={KeyRound} type="password" value={security.currentPassword} 
                    onChange={(e) => setSecurity({...security, currentPassword: e.target.value})} 
                  />
                  <div className="h-px bg-gray-100 w-full my-2"></div>
                  <InputGroup 
                    label="New Password" icon={Lock} type="password" value={security.newPassword} 
                    onChange={(e) => setSecurity({...security, newPassword: e.target.value})} 
                  />
                  <InputGroup 
                    label="Confirm New Password" icon={Check} type="password" value={security.confirmPassword} 
                    onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})} 
                  />
                </div>

                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Must include symbol & number</span>
                  </div>
                  <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:text-primary hover:border-primary/50 hover:bg-gray-50 rounded-xl text-sm font-bold transition-all shadow-sm">
                    Update Password
                  </button>
                </div>
              </form>
            </SettingsCard>

            {/* 3. PREFERENCES */}
            <SettingsCard 
              title="Alert Preferences" 
              description="Control how and when you receive system notifications."
              icon={BellRing}
            >
               <div className="space-y-4">
                  {/* Option 1 */}
                  <div 
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary/40 bg-white hover:bg-gray-50/50 transition-all cursor-pointer group"
                    onClick={() => setPrefs({...prefs, emailNotifs: !prefs.emailNotifs})}
                  >
                     <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                           <Mail className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="font-bold text-sm text-gray-900">Email Reports</p>
                           <p className="text-xs text-gray-500">Weekly summaries of network health.</p>
                        </div>
                     </div>
                     <ToggleSwitch checked={prefs.emailNotifs} onChange={(v) => setPrefs({...prefs, emailNotifs: v})} />
                  </div>

                  {/* Option 2 */}
                  <div 
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary/40 bg-white hover:bg-gray-50/50 transition-all cursor-pointer group"
                    onClick={() => setPrefs({...prefs, whatsappNotifs: !prefs.whatsappNotifs})}
                  >
                     <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
                           <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="font-bold text-sm text-gray-900">WhatsApp Alerts</p>
                           <p className="text-xs text-gray-500">Critical downtime notifications (Real-time).</p>
                        </div>
                     </div>
                     <ToggleSwitch checked={prefs.whatsappNotifs} onChange={(v) => setPrefs({...prefs, whatsappNotifs: v})} />
                  </div>
               </div>
            </SettingsCard>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}