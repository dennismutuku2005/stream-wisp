"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  Menu, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Hash,
  X
} from "lucide-react";

// --- 1. SIMPLIFIED CONTENT (WRITE MARKDOWN HERE) ---
// Just edit the 'content' string using standard symbols:
// # for H1, ## for H2, - for Lists, > for Info/Alerts, ` for code
const DOCS_DATA = [
  {
    slug: "introduction",
    category: "Overview",
    title: "Introduction",
    content: `
# Introduction to Stream

Stream is a utility network software for Mikrotik Hotspot Systems. It acts as a bridge between your physical routers and your management team.

## Core Philosophy
Stream operates on a **Registration-Only** policy. 
- Devices are blocked by default.
- You must register a MAC address to allow traffic.
- It uses the Mikrotik API (port 8728) to sync data.

> Stream requires RouterOS v6.48+ or v7.x to function correctly. Ensure your API service is enabled.
    `
  },
  {
    slug: "architecture",
    category: "Overview",
    title: "Architecture",
    content: `
# System Architecture

Stream connects to your Core Routers via a persistent API connection. It does not replace Winbox but automates tasks you usually do manually.

## Data Flow
1. **User Device** connects to the Access Point.
2. **Access Point** bridges traffic to the Core Router.
3. **Core Router** checks the Hotspot IP Binding list.
4. **Stream Engine** updates this list based on your dashboard actions.

## Ports Used
- **API (8728):** For pushing configurations.
- **SSH (22):** For backups and shell commands.
- **ICMP:** For status monitoring (Up/Down).
    `
  },
  {
    slug: "registering",
    category: "Guides",
    title: "Registering APs",
    content: `
# Registering Access Points

An AP cannot pass traffic until it is registered. This prevents unauthorized routers from plugging into your network.

## Step-by-Step
1. Plug the AP into the switch and ensure it has power.
2. Locate the **MAC Address** on the back sticker.
3. Go to **Access Points > Add New**.
4. Select the **Connected Router** and enter the MAC.

> **Latency Warning:** After saving, allow 5-10 seconds for Stream to push the IP Binding rule to the Mikrotik. The AP may briefly disconnect.
    `
  },
  {
    slug: "shifting",
    category: "Guides",
    title: "Shifting APs",
    content: `
# Shifting APs (Migration)

Shifting is the process of moving an active AP from one Core Router to another without deleting the record.

## How it works
When you change the "Router" dropdown in the Edit screen:
- Stream **DELETES** the IP Binding from the OLD Router.
- Stream **UPDATES** the database record.
- Stream **ADDS** the IP Binding to the NEW Router.

This ensures zero "ghost entries" are left on your old routers.
    `
  },
  {
    slug: "untracking",
    category: "Guides",
    title: "Untrack vs Delete",
    content: `
# Untracking vs Deleting

## Untrack
- Stops "Offline" alerts.
- Keeps data in the database.
- **MAC remains allowed** in Mikrotik.
- Use for seasonal sites or maintenance.

## Delete
- Permanently removes record.
- **Blocks MAC** in Mikrotik immediately.
- Irreversible.
- Use for decommissioned hardware.
    `
  },
  {
    slug: "cli",
    category: "Reference",
    title: "CLI Commands",
    content: `
# Terminal Reference

Useful commands for troubleshooting connection issues directly on the Mikrotik terminal.

## Check API Service
\`ip service print where name="api"\`

## Check Whitelist
\`ip hotspot ip-binding print\`

## Check Logs
\`log print follow where topics~"hotspot"\`
    `
  }
];

// --- 2. MARKDOWN RENDERER (The Magic) ---
const MarkdownRenderer = ({ content }) => {
  const lines = content.trim().split('\n');
  
  return (
    <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
      {lines.map((line, index) => {
        const text = line.trim();
        if (!text) return <div key={index} className="h-2"></div>;

        // H1
        if (text.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2">{text.replace('# ', '')}</h1>;
        }
        // H2
        if (text.startsWith('## ')) {
          return <h2 key={index} className="text-lg font-bold text-gray-800 mt-6 mb-3">{text.replace('## ', '')}</h2>;
        }
        // List Item
        if (text.startsWith('- ')) {
          return (
            <div key={index} className="flex gap-3 ml-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span>{parseInline(text.replace('- ', ''))}</span>
            </div>
          );
        }
        // Ordered List (Simple detection)
        if (/^\d+\./.test(text)) {
           return (
             <div key={index} className="flex gap-3 ml-2">
               <span className="text-gray-500 font-mono text-xs pt-1">{text.split('.')[0]}.</span>
               <span>{parseInline(text.replace(/^\d+\.\s/, ''))}</span>
             </div>
           );
        }
        // Callout/Blockquote
        if (text.startsWith('> ')) {
          return (
            <div key={index} className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg text-indigo-900 my-4 text-xs font-medium">
              {parseInline(text.replace('> ', ''))}
            </div>
          );
        }
        // Code Block (Simple one-liner detection for this demo)
        if (text.startsWith('`') && text.endsWith('`')) {
           return <div key={index} className="bg-gray-900 text-gray-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">{text.replace(/`/g, '')}</div>
        }

        // Paragraph
        return <p key={index}>{parseInline(text)}</p>;
      })}
    </div>
  );
};

// Helper to make **bold** work
const parseInline = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// --- 3. LAYOUT COMPONENTS ---

const Sidebar = ({ activeSlug, setActiveSlug, mobileOpen, setMobileOpen }) => {
  const categories = [...new Set(DOCS_DATA.map(d => d.category))];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-gray-50/50 border-r border-gray-200 transform transition-transform duration-200 ease-in-out
      lg:translate-x-0 lg:static flex flex-col h-full
      ${mobileOpen ? 'translate-x-0 bg-white shadow-2xl' : '-translate-x-full'}
    `}>
      {/* Search Header */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between lg:hidden mb-4">
           <span className="font-bold text-sm">Menu</span>
           <button onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-8 pr-3 py-2 bg-gray-100 border-transparent rounded-lg text-xs focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Scrollable Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
              {cat}
            </h3>
            <ul className="space-y-0.5">
              {DOCS_DATA.filter(doc => doc.category === cat).map(doc => (
                <li key={doc.slug}>
                  <button
                    onClick={() => {
                      setActiveSlug(doc.slug);
                      setMobileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs transition-all flex items-center justify-between group
                      ${activeSlug === doc.slug 
                        ? "bg-white text-indigo-700 font-semibold shadow-sm border border-gray-100" 
                        : "text-gray-600 hover:bg-gray-100"
                      }
                    `}
                  >
                    {doc.title}
                    {activeSlug === doc.slug && <ChevronRight className="h-3 w-3 opacity-50" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-[10px] text-gray-400 text-center">
        v2.4.0 • Updated Weekly
      </div>
    </aside>
  );
};

// --- MAIN PAGE ---

export default function DocsPage() {
  const [activeSlug, setActiveSlug] = useState("introduction");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentDocIndex = DOCS_DATA.findIndex(d => d.slug === activeSlug);
  const currentDoc = DOCS_DATA[currentDocIndex];
  const prevDoc = DOCS_DATA[currentDocIndex - 1];
  const nextDoc = DOCS_DATA[currentDocIndex + 1];

  return (
    <DashboardLayout>
      {/* Fixed Height Container to prevent full page scroll */}
      <div className="h-[calc(100vh-theme(spacing.16))] bg-white font-sans flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar 
          activeSlug={activeSlug} 
          setActiveSlug={setActiveSlug} 
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
        />

        {/* Main Content Area (Scrollable independently) */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
          
          {/* Mobile Toggle */}
          <div className="lg:hidden p-4 border-b border-gray-100 flex items-center gap-2">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 bg-gray-50 rounded">
              <Menu className="h-4 w-4 text-gray-600" />
            </button>
            <span className="font-bold text-sm text-gray-700">{currentDoc.title}</span>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-12 py-8 custom-scrollbar">
            <div className="max-w-3xl mx-auto">
              
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6">
                 <span className="text-indigo-600">Docs</span>
                 <ChevronRight className="h-3 w-3" />
                 <span>{currentDoc.category}</span>
              </div>

              {/* RENDER CONTENT HERE */}
              <article className="min-h-[200px]">
                <MarkdownRenderer content={currentDoc.content} />
              </article>

              {/* Pagination */}
              <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                 {prevDoc ? (
                   <button 
                     onClick={() => setActiveSlug(prevDoc.slug)}
                     className="text-left group"
                   >
                     <div className="text-[10px] font-bold text-gray-400 mb-1 flex items-center gap-1 group-hover:text-indigo-600">
                       <ChevronLeft className="h-3 w-3" /> Previous
                     </div>
                     <div className="text-sm font-bold text-gray-900 group-hover:underline">{prevDoc.title}</div>
                   </button>
                 ) : <div />}

                 {nextDoc ? (
                   <button 
                     onClick={() => setActiveSlug(nextDoc.slug)}
                     className="text-right group"
                   >
                     <div className="text-[10px] font-bold text-gray-400 mb-1 flex items-center justify-end gap-1 group-hover:text-indigo-600">
                       Next <ChevronRight className="h-3 w-3" />
                     </div>
                     <div className="text-sm font-bold text-gray-900 group-hover:underline">{nextDoc.title}</div>
                   </button>
                 ) : <div />}
              </div>

            </div>
            
            {/* Bottom spacer */}
            <div className="h-20"></div>
          </div>
        </main>

        {/* Right "On This Page" (Optional - Minimal) */}
        <aside className="hidden xl:block w-48 border-l border-gray-100 p-6 overflow-y-auto">
           <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-4">
             <Hash className="h-3 w-3" /> On this page
           </div>
           <div className="text-[11px] text-gray-500 space-y-2">
             <p className="hover:text-indigo-600 cursor-pointer">Overview</p>
             <p className="hover:text-indigo-600 cursor-pointer">Steps</p>
             <p className="hover:text-indigo-600 cursor-pointer">Troubleshooting</p>
           </div>
        </aside>

      </div>
    </DashboardLayout>
  );
}