"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  ThumbsUp, 
  ThumbsDown, 
  BookOpen, 
  Zap, 
  Wifi, 
  ShieldAlert,
  MessageCircle,
  Check,
  CircleUserIcon,
  AlertCircle
} from "lucide-react";

// --- Mock Data ---
const FAQ_DATA = [
  {
    id: 1,
    question: "How do I register a new Access Point?",
    answer: "To register a new AP, navigate to the 'Access Points' page and click the 'Add New AP' button in the top right. You will need the MAC address and physical location. Select the connected Mikrotik router from the dropdown list.",
    category: "Onboarding",
    popular: true
  },
  {
    id: 2,
    question: "Why is my Router showing as 'Offline'?",
    answer: "A router may appear offline if the SNMP agent is unreachable or the VPN tunnel is down. Check your internet connection at the site. If the issue persists, try rebooting the Mikrotik device or verifying the firewall rules for port 8291.",
    category: "Troubleshooting",
    popular: true
  },
  {
    id: 3,
    question: "How does the 'Unregistered AP' scan work?",
    answer: "The scan feature queries the ARP table and Neighbor Discovery list of the selected Mikrotik router. It compares found MAC addresses against your known inventory. Devices not in your database appear as 'Unregistered'.",
    category: "Features",
    popular: false
  },
  {
    id: 4,
    question: "Can I change the location of an AP after creation?",
    answer: "Yes. Go to the Access Points table, click the 'Edit' (pencil) icon on the specific AP row. You can update the Location field and the Linked Router. The MAC address, however, is locked and cannot be changed.",
    category: "Management",
    popular: false
  },
  {
    id: 5,
    question: "What do the signal strength colors mean?",
    answer: "Green indicates Excellent signal (>-60dBm), Blue is Good (>-75dBm), Orange is Fair (>-85dBm), and Red indicates Poor signal (<-85dBm). Poor signal may result in packet loss or low throughput for clients.",
    category: "Monitoring",
    popular: true
  }
];

// --- Components ---

/**
 * Category Badge
 */
const CategoryBadge = ({ category }) => {
  const styles = {
    Onboarding: "bg-blue-50 text-blue-700 border-blue-200",
    Troubleshooting: "bg-red-50 text-red-700 border-red-200",
    Features: "bg-purple-50 text-purple-700 border-purple-200",
    Management: "bg-green-50 text-green-700 border-green-200",
    Monitoring: "bg-amber-50 text-amber-700 border-amber-200",
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${styles[category] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {category}
    </span>
  );
};

/**
 * Interactive Feedback Component
 */
const FeedbackToggle = () => {
  const [status, setStatus] = useState(null); // 'yes' | 'no' | null

  if (status) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 font-medium animate-in fade-in slide-in-from-left-2">
        <div className="bg-green-100 p-1 rounded-full"><Check className="h-3 w-3" /></div>
        Thank you for your feedback!
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 pt-4 mt-4 border-t border-gray-100">
      <span className="text-sm text-muted-foreground font-medium">Does this seem helpful?</span>
      <div className="flex gap-2">
        <button 
          onClick={() => setStatus('yes')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all"
        >
          <ThumbsUp className="h-3.5 w-3.5" /> Yes
        </button>
        <button 
          onClick={() => setStatus('no')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all"
        >
          <ThumbsDown className="h-3.5 w-3.5" /> No
        </button>
      </div>
    </div>
  );
};

// --- Main Page ---

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openId, setOpenId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFAQs = FAQ_DATA.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background font-sans">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
              Help Center
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Find answers to common questions about the WaaS Dashboard.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-foreground font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
            <MessageCircle className="h-4 w-4 text-primary" />
            Contact Support
          </button>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for questions, errors, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-white border border-border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-base transition-all"
          />
        </div>

        {/* FAQ "Table" Container */}
        <div className="max-w-4xl mx-auto bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-8 md:col-span-9">Question</div>
            <div className="col-span-3 md:col-span-2 hidden md:block">Category</div>
            <div className="col-span-4 md:col-span-1 text-right">Action</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {isLoading ? (
               // Shimmer Skeleton
               Array.from({ length: 5 }).map((_, i) => (
                 <div key={i} className="p-6 animate-pulse flex justify-between">
                   <div className="h-6 bg-gray-100 rounded w-2/3"></div>
                   <div className="h-6 bg-gray-100 rounded w-16"></div>
                 </div>
               ))
            ) : filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <div key={faq.id} className="group transition-colors">
                  
                  {/* The Row (Toggle Trigger) */}
                  <div 
                    onClick={() => toggleFAQ(faq.id)}
                    className={`grid grid-cols-12 gap-4 px-6 py-5 cursor-pointer hover:bg-primary/[0.02] transition-colors items-center ${openId === faq.id ? 'bg-primary/[0.03]' : ''}`}
                  >
                    
                    {/* Question Column */}
                    <div className="col-span-8 md:col-span-9 flex items-center gap-3">
                      <div className={`p-2 rounded-full shrink-0 ${openId === faq.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <HelpCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm md:text-base ${openId === faq.id ? 'text-primary' : 'text-foreground'}`}>
                          {faq.question}
                        </h3>
                        {faq.popular && (
                          <span className="inline-block mt-1 md:hidden text-[10px] bg-secondary/10 text-secondary-foreground px-1.5 rounded font-bold">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Category Column (Hidden on small mobile) */}
                    <div className="col-span-3 md:col-span-2 hidden md:flex items-center">
                      <CategoryBadge category={faq.category} />
                    </div>

                    {/* Action Column */}
                    <div className="col-span-4 md:col-span-1 flex justify-end">
                      <div className={`p-2 rounded-lg transition-transform duration-300 ${openId === faq.id ? 'rotate-180 bg-white shadow-sm' : ''}`}>
                         <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* The Answer (Expanded Section) */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-50/30 ${
                      openId === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 py-6 md:pl-20 md:pr-10 border-t border-dashed border-gray-100">
                      <div className="text-sm leading-relaxed text-gray-600">
                        {faq.answer}
                      </div>
                      
                      {/* Helpful Toggle */}
                      <FeedbackToggle />
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
                <BookOpen className="h-10 w-10 opacity-20" />
                <p>No questions found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Help Card */}
        <div className="max-w-4xl mx-auto mt-8 grid md:grid-cols-2 gap-4">
           <div className="bg-primary text-primary-foreground p-6 rounded-2xl flex items-center gap-4 shadow-lg shadow-primary/20">
              <div className="p-3 bg-white/20 rounded-xl">
                 <CircleUserIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Quick Start Guide</h3>
                <p className="text-sm opacity-90">New to Terra? Download the PDF guide.</p>
              </div>
           </div>
           
           <div className="bg-white border border-border p-6 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                 <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Report a Bug</h3>
                <p className="text-sm text-muted-foreground">Found something broken? Let us know.</p>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}