"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Cookies from "js-cookie";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Send,
  MessageSquare,
  Users,
  CheckCircle,
  AlertCircle,
  X,
  User,
  Loader,
  RotateCw,
  MessageCircle,
  Clock,
} from "lucide-react";

// Custom Toast Component
const CustomToast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";
  const iconColor = type === "success" ? "text-green-600" : "text-red-600";
  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return createPortal(
    <div className="fixed top-4 right-4 z-[10000] animate-in slide-in-from-right-full duration-300">
      <div className={`flex items-center p-4 rounded-lg border shadow-lg ${bgColor} max-w-sm`}>
        <Icon className={`h-5 w-5 mr-2 ${iconColor}`} />
        <span className={`flex-1 text-sm font-medium ${textColor}`}>{message}</span>
        <button
          onClick={onClose}
          className={`ml-4 ${textColor} hover:opacity-70 transition-opacity`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>,
    document.body
  );
};

// Portal Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      ></div>
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default function SmsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [customers, setCustomers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [routers, setRouters] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCannotDeleteModal, setShowCannotDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [stats, setStats] = useState({
    smsCredits: 0,
    whatsappCredits: 0,
    deliveryRate: 97.5,
  });

  const [smsData, setSmsData] = useState({
    message: "",
    channel: "",
    recipientType: "all",
    specificUsername: "",
  });

  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    username: "",
    password: "",
    packageId: "",
    routerId: "",
    status: "active"
  });

  // Toast state
  const [toast, setToast] = useState({
    message: "",
    type: "error",
    isVisible: false
  });

  // Custom toast function
  const showToast = (message, type = "error") => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  const hideToast = () => {          
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Enhanced error message mapping
  const getFriendlyErrorMessage = (error) => {
    const errorMessage = error.toLowerCase();

    // Authentication errors
    if (errorMessage.includes('isp id') || errorMessage.includes('isp account')) {
      return "Your ISP account is not active or does not exist. Please contact support.";
    }

    // Validation errors
    if (errorMessage.includes('required') || errorMessage.includes('missing')) {
      if (errorMessage.includes('firstname') || errorMessage.includes('lastname') || errorMessage.includes('phone') ||
        errorMessage.includes('username') || errorMessage.includes('password') || errorMessage.includes('package') || errorMessage.includes('router')) {
        return "Please fill in all the required customer information.";
      }
      return "Please provide all the required information.";
    }

    // Duplicate errors
    if (errorMessage.includes('username') && errorMessage.includes('already') || errorMessage.includes('taken')) {
      return "This username is already taken. Please choose a different username.";
    }

    if (errorMessage.includes('phone') && errorMessage.includes('already')) {
      return "This phone number is already registered. Please use a different phone number.";
    }

    // Package/router errors
    if (errorMessage.includes('package') && errorMessage.includes('invalid')) {
      return "The selected internet package is not available. Please choose a valid package.";
    }

    if (errorMessage.includes('router') && errorMessage.includes('invalid')) {
      return "The selected router is not available. Please choose a valid router.";
    }

    // Customer not found
    if (errorMessage.includes('customer') && errorMessage.includes('not found')) {
      return "The customer you are trying to update was not found in your account.";
    }

    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
      return "Network error. Please check your internet connection and try again.";
    }

    // Session errors
    if (errorMessage.includes('session') || errorMessage.includes('expired') || errorMessage.includes('401') || errorMessage.includes('403')) {
      return "Your session has expired. Please log in again.";
    }

    // Default friendly message
    if (errorMessage.includes('failed') || errorMessage.includes('error')) {
      return "We encountered an issue while processing your request. Please try again.";
    }

    // Return the original error if no mapping found, but make it more user-friendly
    return error.replace(/error|failed|unable/i, 'We encountered an issue').replace(/please try again/i, 'Please try again');
  };

  // API Base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.onenetwork-system.com/pppoe/user/v1';

  // Get user data from cookie
  useEffect(() => {
    const userCookie = Cookies.get("user_data");
    if (userCookie) {
      try {
        const parsedUserData = JSON.parse(userCookie);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        showToast("Invalid user session. Please login again.", "error");
        setLoading(false);
      }
    } else {
      showToast("No user session found. Please login.", "error");
      setLoading(false);
    }
  }, []);

  // Fetch initial data
  const fetchData = async () => {
    if (!userData?.user_id) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch credits - Using query parameters
      const creditsResponse = await fetch(`${API_BASE}/sms.php?action=get-credits&isp_id=${userData.user_id}`);
      const creditsData = await creditsResponse.json();
      
      if (creditsData.success) {
        setStats(prev => ({
          ...prev,
          smsCredits: creditsData.data.sms_credits || 0,
          whatsappCredits: creditsData.data.whatsapp_credits || 0,
        }));
      }

      // Fetch customers - Using query parameters
      const customersResponse = await fetch(`${API_BASE}/sms.php?action=get-customers&isp_id=${userData.user_id}`);
      const customersData = await customersResponse.json();
      
      if (customersData.success) {
        setCustomers(customersData.data || []);
      }

      // Fetch packages and routers for customer management
      const customerMgmtResponse = await fetch(`${API_BASE}/customers.php?isp_id=${userData.user_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (customerMgmtResponse.ok) {
        const customerData = await customerMgmtResponse.json();
        if (!customerData.error) {
          setPackages(customerData.packages || []);
          setRouters(customerData.routers || []);
          
          // Set default package and router if available
          if (customerData.packages && customerData.packages.length > 0 && !newCustomer.packageId) {
            setNewCustomer(prev => ({ ...prev, packageId: customerData.packages[0].id }));
          }
          if (customerData.routers && customerData.routers.length > 0 && !newCustomer.routerId) {
            setNewCustomer(prev => ({ ...prev, routerId: customerData.routers[0].id }));
          }
        }
      }

    } catch (err) {
      console.error("Error fetching data:", err);
      const friendlyMessage = getFriendlyErrorMessage(err.message);
      showToast(friendlyMessage, "error");
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // Fetch username suggestions
  const fetchUsernameSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setUsernameSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/sms.php?action=search-usernames&isp_id=${userData.user_id}&query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setUsernameSuggestions(data.data || []);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setUsernameSuggestions([]);
    }
  };

  useEffect(() => {
    if (userData?.user_id) {
      fetchData();
    }
  }, [userData]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!smsData.channel) {
      showToast("Please select a channel (SMS or WhatsApp)", "error");
      return;
    }

    if (!smsData.message.trim()) {
      showToast("Please enter a message", "error");
      return;
    }

    if (smsData.recipientType === "specific" && !smsData.specificUsername.trim()) {
      showToast("Please enter a username", "error");
      return;
    }

    const currentCredits = stats[smsData.channel === 'sms' ? 'smsCredits' : 'whatsappCredits'];
    if (currentCredits <= 0) {
      showToast(`Not enough ${smsData.channel.toUpperCase()} credits. Please top up first.`, "error");
      return;
    }

    setSending(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/sms.php?action=send-message&isp_id=${userData.user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: smsData.message,
          channel: smsData.channel,
          recipientType: smsData.recipientType,
          specificUsername: smsData.specificUsername
        })
      });

      const result = await response.json();

      if (result.success) {
        setStats(prev => ({
          ...prev,
          [smsData.channel === 'sms' ? 'smsCredits' : 'whatsappCredits']: 
            Math.max(0, prev[smsData.channel === 'sms' ? 'smsCredits' : 'whatsappCredits'] - result.sent)
        }));

        setShowModal(null);
        setSmsData({
          message: "",
          channel: "",
          recipientType: "all",
          specificUsername: "",
        });

        showToast(`Message sent successfully! Sent: ${result.sent}, Failed: ${result.failed}`, "success");
        
      } else {
        showToast(result.message || "Failed to send message", "error");
      }

    } catch (err) {
      console.error("Send message error:", err);
      showToast("Failed to send message. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.firstName || !newCustomer.lastName || !newCustomer.phone ||
      !newCustomer.username || !newCustomer.password || !newCustomer.packageId || !newCustomer.routerId) {
      showToast("Please fill in all the required customer information.", "error");
      return;
    }

    setActionLoading(true);

    try {
      const response = await fetch(`${API_BASE}/customers.php?isp_id=${userData.user_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        showToast(data.error, "error");
        return;
      }

      // Show success message
      showToast("Customer account created successfully!", "success");

      // Refresh customers list silently
      await fetchData();

      // Reset form and close modal
      setNewCustomer({
        firstName: "",
        lastName: "",
        phone: "",
        username: "",
        password: "",
        packageId: packages[0]?.id || "",
        routerId: routers[0]?.id || "",
        status: "active"
      });
      setShowAddModal(false);

    } catch (err) {
      console.error("Error creating customer:", err);
      const friendlyMessage = getFriendlyErrorMessage(err.message);
      showToast(friendlyMessage, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-2 rounded-full ${
          color === 'blue' ? 'bg-blue-100' :
          color === 'green' ? 'bg-green-100' :
          color === 'purple' ? 'bg-purple-100' :
          'bg-gray-100'
        }`}>
          <Icon className={`h-5 w-5 ${
            color === 'blue' ? 'text-blue-600' :
            color === 'green' ? 'text-green-600' :
            color === 'purple' ? 'text-purple-600' :
            'text-gray-600'
          }`} />
        </div>
      </div>
    </div>
  );

  const StatCardSkeleton = () => (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );

  const QuickActionButton = ({ icon: Icon, title, onClick, color }) => (
    <button
      onClick={onClick}
      className={`flex items-center p-3 rounded-lg transition-colors w-full text-left ${
        color === 'blue' ? 'bg-blue-50 hover:bg-blue-100' :
        color === 'green' ? 'bg-green-50 hover:bg-green-100' :
        'bg-gray-50 hover:bg-gray-100'
      }`}
    >
      <Icon className={`h-5 w-5 mr-2 ${
        color === 'blue' ? 'text-blue-600' :
        color === 'green' ? 'text-green-600' :
        'text-gray-600'
      }`} />
      <span className="font-medium text-gray-900">{title}</span>
    </button>
  );

  const ChannelSelector = ({ selected, onSelect }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Channel *
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onSelect("sms")}
          className={`p-3 rounded-lg border-2 text-left transition-all ${
            selected === "sms"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-blue-600 mr-2" />
              <span className="font-semibold text-gray-900 text-sm">SMS</span>
            </div>
            {selected === "sms" && (
              <CheckCircle className="h-4 w-4 text-blue-600" />
            )}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            KES 0.5/message • {stats.smsCredits?.toLocaleString()} credits
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelect("whatsapp")}
          className={`p-3 rounded-lg border-2 text-left transition-all ${
            selected === "whatsapp"
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 text-green-600 mr-2" />
              <span className="font-semibold text-gray-900 text-sm">WhatsApp</span>
            </div>
            {selected === "whatsapp" && (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            KES 0.2/message • {stats.whatsappCredits?.toLocaleString()} credits
          </div>
        </button>
      </div>
    </div>
  );

  const SuggestionItem = ({ username, fullName, phone, onSelect }) => (
    <button
      type="button"
      onClick={() => onSelect(username)}
      className="w-full text-left p-2 hover:bg-gray-100 rounded-md transition-colors"
    >
      <div className="font-medium text-sm text-gray-900">{username}</div>
      <div className="text-xs text-gray-500">
        {fullName} • {phone}
      </div>
    </button>
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "suspended":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "suspended":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusDisplay = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getPackageName = (packageId) => {
    const pkg = packages.find(p => p.id === packageId);
    return pkg ? pkg.name : 'Unknown Package';
  };

  return (
    <>
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Message Management</h1>
              <p className="text-sm text-gray-500">Manage customer communication</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowModal("sendMessage")}
                className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                New Message
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {isLoading ? (
              [...Array(2)].map((_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <StatCard
                  title="SMS Credits"
                  value={stats.smsCredits}
                  icon={MessageSquare}
                  color="purple"
                  subtitle="KES 0.5/credit"
                />
                <StatCard
                  title="WhatsApp Credits"
                  value={stats.whatsappCredits}
                  icon={MessageCircle}
                  color="green"
                  subtitle="KES 0.2/credit"
                />
              </>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              <QuickActionButton
                icon={Send}
                title="Send Message"
                onClick={() => setShowModal("sendMessage")}
                color="blue"
              />
              <QuickActionButton
                icon={Users}
                title="Customer Groups"
                onClick={() => setShowModal("groups")}
                color="green"
              />
            </div>
          </div>

          {(stats.smsCredits < 10 || stats.whatsappCredits < 10) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800 font-medium">Low Credits Warning</span>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                {stats.smsCredits < 10 && `SMS credits are low (${stats.smsCredits}). `}
                {stats.whatsappCredits < 10 && `WhatsApp credits are low (${stats.whatsappCredits}). `}
                Consider topping up to avoid service interruption.
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>

      <Modal
        isOpen={showModal === "sendMessage"}
        onClose={() => {
          setShowModal(null);
          setSmsData({
            message: "",
            channel: "",
            recipientType: "all",
            specificUsername: "",
          });
          setError(null);
          setUsernameSuggestions([]);
          setShowSuggestions(false);
        }}
        title="Send Message"
      >
        <form onSubmit={handleSendMessage} className="space-y-4">
          <ChannelSelector
            selected={smsData.channel}
            onSelect={(channel) => setSmsData(prev => ({ ...prev, channel }))}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send To
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recipientType"
                  value="all"
                  checked={smsData.recipientType === "all"}
                  onChange={(e) => setSmsData(prev => ({ 
                    ...prev, 
                    recipientType: e.target.value,
                    specificUsername: "" 
                  }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">All Customers ({customers.length})</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recipientType"
                  value="specific"
                  checked={smsData.recipientType === "specific"}
                  onChange={(e) => setSmsData(prev => ({ 
                    ...prev, 
                    recipientType: e.target.value 
                  }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Specific Username</span>
              </label>
            </div>
          </div>

          {smsData.recipientType === "specific" && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={smsData.specificUsername}
                  onChange={(e) => {
                    setSmsData(prev => ({ 
                      ...prev, 
                      specificUsername: e.target.value 
                    }));
                    fetchUsernameSuggestions(e.target.value);
                  }}
                  onFocus={() => {
                    if (smsData.specificUsername.length >= 2) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  placeholder="Enter customer username"
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 pl-9"
                  required
                />
                <User className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              {showSuggestions && usernameSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    {usernameSuggestions.slice(0, 3).map((customer, index) => (
                      <SuggestionItem
                        key={index}
                        username={customer.username}
                        fullName={customer.full_name}
                        phone={customer.phone}
                        onSelect={(username) => {
                          setSmsData(prev => ({ ...prev, specificUsername: username }));
                          setShowSuggestions(false);
                          setUsernameSuggestions([]);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              rows={4}
              value={smsData.message}
              onChange={(e) => setSmsData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              {smsData.message.length} characters
            </div>
          </div>

          {smsData.channel && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-center text-sm text-blue-700">
                Cost: 1 {smsData.channel.toUpperCase()} credit per message • 
                Balance: {stats[`${smsData.channel}Credits`]?.toLocaleString()} credits •
                Estimated cost: {smsData.recipientType === 'all' ? customers.length : 1} credits
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={sending || !smsData.channel || !smsData.message.trim() || 
                (smsData.recipientType === "specific" && !smsData.specificUsername.trim())}
              className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center ${
                sending || !smsData.channel || !smsData.message.trim() || 
                (smsData.recipientType === "specific" && !smsData.specificUsername.trim())
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {sending ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send via {smsData.channel ? smsData.channel.toUpperCase() : '...'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(null)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={sending}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}