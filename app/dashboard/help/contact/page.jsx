"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Send, 
  LifeBuoy, 
  CheckCircle2, 
  Loader2,
  FileText,
  Clock,
  X,
  User,
  Bot
} from "lucide-react";

// --- Components ---

/**
 * Contact Method Card
 * Adjusted for Mobile Carousel: Added min-width and snap alignment
 */
const ContactCard = ({ icon: Icon, title, value, subtext, actionLabel, onClick, colorClass }) => (
  <div 
    onClick={onClick}
    className="min-w-[85vw] sm:min-w-[300px] lg:min-w-0 snap-center bg-white p-5 rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group cursor-pointer flex-shrink-0"
  >
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-xl ${colorClass} group-hover:scale-110 transition-transform shrink-0`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="font-bold text-foreground text-sm mb-1">{title}</h3>
        <p className="text-lg font-bold text-foreground mb-1">{value}</p>
        <p className="text-xs text-muted-foreground mb-3">{subtext}</p>
        <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:underline">
          {actionLabel}
        </span>
      </div>
    </div>
  </div>
);

/**
 * Floating Chat Widget
 */
const ChatWidget = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hello! Welcome to Terra Support. How can we help you today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add User Message
    const userMsg = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate Bot Response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev, 
        { id: Date.now() + 1, sender: "bot", text: "Thanks for reaching out. An agent will join this chat shortly." }
      ]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-[90vw] md:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-border flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300 overflow-hidden">
      
      {/* Header */}
      <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-sm">Stream Support</h3>
            <p className="text-xs text-white/80">Online Now</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-600'}`}>
                 {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
          autoFocus
        />
        <button 
          type="submit" 
          className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default function ContactSupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "technical",
    priority: "normal",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background  font-sans">
        
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-6 lg:mb-10">
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
            Contact Support
          </h1>
          <p className="text-muted-foreground">
            Having trouble with your network? Our engineering team is here to help.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Contact Channels (Carousel on Mobile) */}
          <div className="lg:col-span-1">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 hidden lg:block">Direct Channels</h2>
            
            {/* CAROUSEL CONTAINER: Flex Row on Mobile, Flex Col on Desktop */}
            <div className="
              flex flex-row gap-4 overflow-x-auto snap-x py-2 px-1 -mx-4 md:mx-0
              lg:flex-col lg:overflow-visible lg:snap-none lg:p-0 lg:m-0
              no-scrollbar
            ">
              {/* Spacer for left margin on mobile carousel */}
              <div className="w-1 shrink-0 lg:hidden"></div>

              <ContactCard 
                icon={Mail}
                title="Email Support"
                value="support@terra.co.ke"
                subtext="Response within 2 hours"
                actionLabel="Send an email"
                colorClass="bg-blue-50 text-blue-600"
                onClick={() => window.location.href = 'mailto:support@terra.co.ke'}
              />

              <ContactCard 
                icon={Phone}
                title="Phone Line"
                value="+254 700 123 456"
                subtext="Mon-Fri from 8am to 5pm"
                actionLabel="Call now"
                colorClass="bg-green-50 text-green-600"
                onClick={() => window.location.href = 'tel:+254700123456'}
              />

              <ContactCard 
                icon={MessageSquare}
                title="Live Chat"
                value="Start a chat"
                subtext="Available for Enterprise plans"
                actionLabel="Open widget"
                colorClass="bg-purple-50 text-purple-600"
                onClick={() => setIsChatOpen(true)}
              />

              {/* Spacer for right margin on mobile carousel */}
              <div className="w-1 shrink-0 lg:hidden"></div>
            </div>
          </div>

          {/* RIGHT COLUMN: Ticket Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
              
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Ticket Submitted!</h2>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    We have received your request. A support engineer will review it and get back to you shortly via email.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-foreground font-bold rounded-xl transition-colors text-sm"
                  >
                    Submit Another Ticket
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Open a Ticket</h2>
                      <p className="text-sm text-muted-foreground mt-1">Fill out the form below for detailed assistance.</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
                       <LifeBuoy className="h-4 w-4" />
                       <span>Ticket System Online</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">Your Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">Work Email <span className="text-red-500">*</span></label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="john@company.com"
                          className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">Topic</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <select 
                            value={formData.topic}
                            onChange={(e) => setFormData({...formData, topic: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                          >
                            <option value="technical">Technical Issue</option>
                            <option value="billing">Billing & Account</option>
                            <option value="feature">Feature Request</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">Priority</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <select 
                            value={formData.priority}
                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                          >
                            <option value="low">Low (General Inquiry)</option>
                            <option value="normal">Normal (Standard Issue)</option>
                            <option value="high">High (System Down)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-foreground">How can we help? <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={6}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Please describe the issue..."
                        className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-4">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" /> Submit Ticket
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* Render Chat Widget */}
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

    </DashboardLayout>
  );
}