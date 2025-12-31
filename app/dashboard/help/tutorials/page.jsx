"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  Search, 
  Play, 
  Clock, 
  X, 
  Youtube, 
  ExternalLink,
  MonitorPlay,
  ChevronRight
} from "lucide-react";

// --- Configuration ---

// 1. Add your YouTube Video IDs here
const TUTORIALS = [
  {
    id: 1,
    youtubeId: "ulR0-v8E4go", // Mikrotik Basic Configuration
    title: "MikroTik Router - First Time Setup",
    description: "A complete guide to configuring your MikroTik router from scratch, including WAN, LAN, and DHCP.",
    duration: "12:45",
    category: "Getting Started",
    views: "45k"
  },
  {
    id: 2,
    youtubeId: "9_sZc9a2iXs", // VLANs explained
    title: "Understanding VLANs on Mikrotik",
    description: "Learn how to segment your network using Virtual LANs for better security and management.",
    duration: "18:20",
    category: "Network Setup",
    views: "12k"
  },
  {
    id: 3,
    youtubeId: "3hvlFw_6Nl4", // CAPsMAN
    title: "CAPsMAN Wireless Controller Setup",
    description: "Centralized management of all your Access Points using Mikrotik CAPsMAN.",
    duration: "15:10",
    category: "Advanced",
    views: "8.5k"
  },
  {
    id: 4,
    youtubeId: "5jX9H5X5_5c", // Firewall Basics
    title: "Securing your Router: Firewall Basics",
    description: "Essential firewall rules every WISP administrator should implement immediately.",
    duration: "09:30",
    category: "Security",
    views: "22k"
  },
  {
    id: 5,
    youtubeId: "e_wL-hHj0e4", // Queues/Bandwidth
    title: "Bandwidth Management & Queues",
    description: "How to limit speeds for specific customers or plans using Simple Queues.",
    duration: "08:15",
    category: "Billing",
    views: "5k"
  },
  {
    id: 6,
    youtubeId: "L6rK3e0v5M4", // Hotspot
    title: "Hotspot Setup for Guest WiFi",
    description: "Creating a captive portal for hotels, cafes, or public wifi zones.",
    duration: "14:00",
    category: "Network Setup",
    views: "31k"
  }
];

const CATEGORIES = ["All", "Getting Started", "Network Setup", "Security", "Billing", "Advanced"];

// --- Components ---

/**
 * YouTube Card
 * Automatically fetches thumbnail from: img.youtube.com/vi/{ID}/maxresdefault.jpg
 */
const VideoCard = ({ video, onClick }) => (
  <div 
    onClick={() => onClick(video)}
    className="group bg-white rounded-2xl border border-border overflow-hidden cursor-pointer hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col h-full"
  >
    {/* Thumbnail Container */}
    <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
      {/* YouTube Thumbnail Image */}
      <img 
        src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`} 
        alt={video.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 group-hover:bg-red-600">
          <Play className="h-6 w-6 text-gray-900 ml-1 fill-gray-900 group-hover:text-white group-hover:fill-white transition-colors" />
        </div>
      </div>

      {/* Duration Badge */}
      <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 backdrop-blur-md">
        <Clock className="h-3 w-3" /> {video.duration}
      </div>
    </div>

    {/* Content */}
    <div className="p-5 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
          {video.category}
        </span>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Youtube className="h-3 w-3" /> {video.views}
        </div>
      </div>
      
      <h3 className="font-bold text-foreground text-base leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {video.title}
      </h3>
      
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
        {video.description}
      </p>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs font-bold text-foreground flex items-center group-hover:underline">
          Watch Now
        </span>
        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors" />
      </div>
    </div>
  </div>
);

/**
 * YouTube Player Modal
 * Renders an Iframe
 */
const YouTubeModal = ({ isOpen, onClose, video }) => {
  if (!isOpen || !video) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1a1a1a] border-b border-white/10">
          <h2 className="text-white font-bold text-sm md:text-lg truncate pr-4">{video.title}</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Player Wrapper (16:9 Aspect Ratio) */}
        <div className="relative aspect-video bg-black">
          <iframe 
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`} 
            title={video.title}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-[#1a1a1a] text-gray-300 text-sm flex justify-between items-center gap-4">
          <p className="line-clamp-1">{video.description}</p>
          <a 
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`} 
            target="_blank" 
            rel="noreferrer"
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors"
          >
            <ExternalLink className="h-3 w-3" /> Open in YouTube
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- Main Page ---

export default function TutorialsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Filter Logic
  const filteredVideos = TUTORIALS.filter(video => {
    const matchesCategory = activeCategory === "All" || video.category === activeCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background font-sans">
        
        {/* Header */}
        <div className="mb-8 max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2 flex items-center gap-3">
             <MonitorPlay className="h-8 w-8 text-primary" /> Video Tutorials
          </h1>
          <p className="text-muted-foreground">
            Master your network with these step-by-step video guides.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-6 mb-8">
           {/* Search */}
           <div className="relative max-w-lg">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <input 
               type="text" 
               placeholder="Search videos..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all text-sm"
             />
           </div>

           {/* Category Chips */}
           <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
             {CATEGORIES.map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`
                   px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border
                   ${activeCategory === cat 
                     ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                     : "bg-white text-muted-foreground border-border hover:border-primary/30 hover:bg-gray-50"
                   }
                 `}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map(video => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onClick={setSelectedVideo}
              />
            ))
          ) : (
            <div className="col-span-full py-24 text-center text-muted-foreground border-2 border-dashed border-border rounded-3xl bg-gray-50/50">
              <Youtube className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No tutorials found for "{searchTerm}"</p>
            </div>
          )}
        </div>

      </div>

      {/* Cinema Mode Portal */}
      <YouTubeModal 
        isOpen={!!selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
        video={selectedVideo} 
      />

    </DashboardLayout>
  );
}