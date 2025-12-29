"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Users, Plus, X, CheckCircle, Clock, AlertCircle, Edit, Trash2, Loader, Eye, EyeOff, Info, RotateCw, Search, Filter, Calendar } from "lucide-react";
import Cookies from "js-cookie";
import CustomToast from "@/components/customtoast";

// Skeleton components for loading states
const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const SkeletonStatsCard = () => (
  <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);

const SkeletonTableRow = () => (
  <tr className="border-t">
    <td className="py-3 px-4">
      <div className="flex items-center">
        <Skeleton className="h-8 w-8 rounded-full mr-3" />
        <Skeleton className="h-4 w-32" />
      </div>
    </td>
    <td className="py-3 px-4">
      <Skeleton className="h-4 w-24" />
    </td>
    <td className="py-3 px-4">
      <Skeleton className="h-4 w-24" />
    </td>
    <td className="py-3 px-4">
      <Skeleton className="h-6 w-16 rounded-full" />
    </td>
    <td className="py-3 px-4">
      <Skeleton className="h-4 w-20" />
    </td>
    <td className="py-3 px-4">
      <Skeleton className="h-4 w-20" />
    </td>
    <td className="py-3 px-4">
      <Skeleton className="h-6 w-24 rounded-full" />
    </td>
    <td className="py-3 px-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-6 w-6 rounded" />
      </div>
    </td>
  </tr>
);

// Modal Component
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

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: "0 25px 50px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [summary, setSummary] = useState([]);
  const [packages, setPackages] = useState([]);
  const [routers, setRouters] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [userData, setUserData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Separate loading states
  const [listLoading, setListLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  
  const observer = useRef(null);

  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    username: "",
    password: "",
    packageId: "",
    routerId: "",
    status: "active",
    next_payment_date: "",
  });

  // Toast state
  const [toast, setToast] = useState({
    message: "",
    type: "error",
    isVisible: false,
  });

  const showToast = (message, type = "error") => {
    setToast({
      message,
      type,
      isVisible: true,
    });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 5000);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;

  // Enhanced error message mapping
  const getFriendlyErrorMessage = (error) => {
    const errorMessage = error.toLowerCase();
    if (errorMessage.includes("isp id") || errorMessage.includes("isp account")) {
      return "Your ISP account is not active or does not exist. Please contact support.";
    }
    if (errorMessage.includes("required") || errorMessage.includes("missing")) {
      if (
        errorMessage.includes("firstname") ||
        errorMessage.includes("lastname") ||
        errorMessage.includes("phone") ||
        errorMessage.includes("username") ||
        errorMessage.includes("password") ||
        errorMessage.includes("package") ||
        errorMessage.includes("router")
      ) {
        return "Please fill in all the required customer information.";
      }
      return "Please provide all the required information.";
    }
    if (errorMessage.includes("username") && (errorMessage.includes("already") || errorMessage.includes("taken"))) {
      return "This username is already taken. Please choose a different username.";
    }
    if (errorMessage.includes("phone") && errorMessage.includes("already")) {
      return "This phone number is already registered. Please use a different phone number.";
    }
    if (errorMessage.includes("package") && errorMessage.includes("invalid")) {
      return "The selected internet package is not available. Please choose a valid package.";
    }
    if (errorMessage.includes("router") && errorMessage.includes("invalid")) {
      return "The selected router is not available. Please choose a valid router.";
    }
    if (errorMessage.includes("customer") && errorMessage.includes("not found")) {
      return "The customer you are trying to update was not found in your account.";
    }
    if (errorMessage.includes("network") || errorMessage.includes("fetch") || errorMessage.includes("connection")) {
      return "Network error. Please check your internet connection and try again.";
    }
    if (errorMessage.includes("400")) {
      return "Invalid request. Please check the data you entered.";
    }
    if (errorMessage.includes("401")) {
      return "Unauthorized. Please log in again.";
    }
    if (errorMessage.includes("403")) {
      return "Access denied. You do not have permission.";
    }
    if (errorMessage.includes("404")) {
      return "The requested resource was not found.";
    }
    if (errorMessage.includes("409")) {
      return "This username already exists.";
    }
    if (errorMessage.includes("500")) {
      return "We apologize, but something went wrong on our end. Our team has been notified and is working to fix the issue.";
    }
    if (errorMessage.includes("session") || errorMessage.includes("expired") || errorMessage.includes("401") || errorMessage.includes("403")) {
      return "Your session has expired. Please log in again.";
    }
    if (errorMessage.includes("failed") || errorMessage.includes("error")) {
      return "We encountered an issue while processing your request. Please try again.";
    }
    return error.replace(/error|failed|unable/i, "We encountered an issue").replace(/please try again/i, "Please try again");
  };

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
        setInitialLoading(false);
        setListLoading(false);
        setStatsLoading(false);
      }
    } else {
      showToast("No user session found. Please login.", "error");
      setInitialLoading(false);
      setListLoading(false);
      setStatsLoading(false);
    }
  }, []);

  // Search customers using the search API
  const searchCustomers = useCallback(
    async () => {
      if (!userData?.user_id) return;

      setIsSearching(true);
      setListLoading(true);
      try {
        const params = new URLSearchParams({
          isp_id: userData.user_id,
          page: 1,
          limit: '50',
          search: searchTerm.trim(),
          status: statusFilter === "All" ? "" : statusFilter.toLowerCase()
        });

        const response = await fetch(`${API_ENDPOINT}/searchcustomer.php?${params}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Search response data:", data);
        if (data.error) {
          throw new Error(data.error);
        }

        setCustomers(data.customers || []);
        setPackages(data.packages || []);
        setRouters(data.routers || []);
        setSummary(data.summary || []);
        
        setHasMore(false);
        setPage(1);
        setTotalPages(1);

      } catch (err) {
        console.error("Error searching customers:", err);
        const friendlyMessage = getFriendlyErrorMessage(err.message);
        showToast(friendlyMessage, "error");
        setSearchTerm("");
        setStatusFilter("All");
      } finally {
        setIsSearching(false);
        setListLoading(false);
      }
    },
    [userData, searchTerm, statusFilter, API_ENDPOINT]
  );

  // Fetch regular customers data
  const fetchData = useCallback(
    async (pageNum = 1, reset = false) => {
      if (!userData?.user_id) return;

      if (reset) {
        setListLoading(true);
        setLoadingMore(false);
      } else {
        setLoadingMore(true);
      }
      
      try {
        const response = await fetch(`${API_ENDPOINT}/customers.php?isp_id=${userData.user_id}&page=${pageNum}&limit=7`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setCustomers((prev) => (reset ? data.customers || [] : [...prev, ...(data.customers || [])]));
        setPackages(data.packages || []);
        setRouters(data.routers || []);
        setSummary(data.summary || []);
        
        if (searchTerm.trim() === "" && statusFilter === "All") {
          setTotalPages(data.pagination?.totalPages || 1);
          setHasMore(pageNum < data.pagination?.totalPages);
          setPage(pageNum);
        }

        if (data.packages?.length > 0 && !newCustomer.packageId) {
          setNewCustomer((prev) => ({ ...prev, packageId: data.packages[0].id }));
        }
        if (data.routers?.length > 0 && !newCustomer.routerId) {
          setNewCustomer((prev) => ({ ...prev, routerId: data.routers[0].id }));
        }

        if (reset && statsLoading) {
          setStatsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        const friendlyMessage = getFriendlyErrorMessage(err.message);
        showToast(friendlyMessage, "error");
      } finally {
        if (reset) {
          setListLoading(false);
        }
        setLoadingMore(false);
        if (initialLoading) {
          setInitialLoading(false);
        }
      }
    },
    [userData, newCustomer.packageId, newCustomer.routerId, searchTerm, statusFilter, API_ENDPOINT, statsLoading, initialLoading]
  );

  // Initial data load
  useEffect(() => {
    if (userData?.user_id && initialLoading) {
      fetchData(1, true);
    }
  }, [userData, fetchData, initialLoading]);

  // Search and filter handling
  useEffect(() => {
    if (!userData?.user_id) return;

    const loadData = async () => {
      if (searchTerm.trim() !== "" || statusFilter !== "All") {
        await searchCustomers();
      } else {
        await fetchData(1, true);
      }
    };

    const debounceTimer = setTimeout(() => {
      loadData();
    }, searchTerm.trim() ? 500 : 0);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter, userData, searchCustomers, fetchData]);

  // Infinite scroll observer - only for normal browsing
  const lastCustomerRef = useCallback(
    (node) => {
      const isSearchActive = searchTerm.trim() !== "" || statusFilter !== "All";
      if (listLoading || !hasMore || isSearchActive || loadingMore) return;
      
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !listLoading && !loadingMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [listLoading, hasMore, searchTerm, statusFilter, loadingMore]
  );

  // Load more data on page change
  useEffect(() => {
    if (page > 1 && searchTerm.trim() === "" && statusFilter === "All") {
      fetchData(page, false);
    }
  }, [page, fetchData, searchTerm, statusFilter]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      setCustomers([]);
      setListLoading(true);
      setHasMore(false);
    }
  };

  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) return;
    setActionLoading(true);
    try {
      const updateData = {
        customerId: selectedCustomer.id,
        customerData: {
          firstName: selectedCustomer.firstName,
          lastName: selectedCustomer.lastName,
          phone: selectedCustomer.phone,
          username: selectedCustomer.username,
          password: selectedCustomer.password,
          packageId: selectedCustomer.packageId,
          routerId: selectedCustomer.routerId,
          status: selectedCustomer.status,
          amount: selectedCustomer.amount,
          next_payment_date: selectedCustomer.next_payment_date,
        },
      };
      const response = await fetch(`${API_ENDPOINT}/customers.php?isp_id=${userData.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      showToast("Customer information updated successfully!", "success");
      setSelectedCustomer(null);
      
      if (searchTerm.trim() || statusFilter !== "All") {
        searchCustomers();
      } else {
        fetchData(1, true);
      }
    } catch (err) {
      console.error("Error updating customer:", err);
      const friendlyMessage = getFriendlyErrorMessage(err.message);
      showToast(friendlyMessage, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete customer
  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    
    setActionLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/deletecustomer.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isp_id: userData.user_id,
          customer_id: customerToDelete.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      showToast("Customer has been successfully Deleted", "success");
      setShowDeleteConfirmModal(false);
      setCustomerToDelete(null);
      setDeleteConfirmationText("");
      
      if (searchTerm.trim() || statusFilter !== "All") {
        searchCustomers();
      } else {
        fetchData(1, true);
      }
    } catch (err) {
      console.error("Error deleting customer:", err);
      const friendlyMessage = getFriendlyErrorMessage(err.message);
      showToast(friendlyMessage, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("All");
    setPage(1);
    setHasMore(true);
    fetchData(1, true);
  }, [fetchData]);

  const handleShowDeleteConfirm = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteConfirmModal(true);
    setDeleteConfirmationText("");
  };

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
    const pkg = packages.find((p) => p.id === packageId);
    return pkg ? pkg.name : "Unknown Package";
  };

  const getPackageAmount = (packageId) => {
    const pkg = packages.find((p) => p.id === packageId);
    return pkg ? pkg.amount : 0;
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className={`text-xl font-semibold text-${color}-600 mt-1`}>
            {typeof value === "number" && value > 1000 ? value.toLocaleString() : value}
          </div>
        </div>
        <div className={`p-2 rounded-full bg-${color}-100`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const displayedCustomers = customers;
  const isSearchActive = searchTerm.trim() !== "" || statusFilter !== "All";
  const isDeleteConfirmed = deleteConfirmationText === customerToDelete?.name;

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
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
              <p className="text-sm text-gray-500">
                {isSearchActive && (
                  <span className="mr-2">
                    {isSearching ? '🔍 Searching...' : `Showing results for "${searchTerm}"${statusFilter !== "All" ? `, ${statusFilter}` : ''}`}
                  </span>
                )}
                {userData && <span>• User ID: {userData.user_id}</span>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                System Online
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={actionLoading || listLoading}
              >
                <RotateCw className={`h-4 w-4 mr-1 ${listLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {statsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array(4)
                .fill()
                .map((_, index) => (
                  <SkeletonStatsCard key={index} />
                ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Customers"
                value={summary.totalCustomers || 0}
                icon={Users}
                color="blue"
              />
              <StatCard
                title="Active"
                value={summary.active || 0}
                icon={CheckCircle}
                color="green"
              />
              <StatCard
                title="Suspended"
                value={summary.suspended || 0}
                icon={Clock}
                color="yellow"
              />
              <StatCard
                title="Inactive"
                value={summary.inactive || 0}
                icon={AlertCircle}
                color="gray"
              />
            </div>
          )}

          {/* Search and Filter - Always visible */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={
                    isSearching 
                      ? "Searching..." 
                      : "Search customers by name, phone, username, or account number..."
                  }
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    actionLoading 
                      ? 'bg-gray-50 cursor-not-allowed border-gray-200' 
                      : 'border-gray-200'
                  } ${isSearching ? 'bg-blue-50 border-blue-200' : ''}`}
                  disabled={actionLoading}
                />
              </div>
              <div className="sm:w-48 relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  disabled={actionLoading}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600">
                    <th className="py-3 px-4 font-medium">Customer</th>
                    <th className="py-3 px-4 font-medium">Phone</th>
                    <th className="py-3 px-4 font-medium">Account Number</th>
                    <th className="py-3 px-4 font-medium">Router</th>
                    <th className="py-3 px-4 font-medium">Package</th>
                    <th className="py-3 px-4 font-medium">Amount (KES)</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Next Payment</th>
                    <th className="py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {listLoading ? (
                    Array(5)
                      .fill()
                      .map((_, index) => <SkeletonTableRow key={index} />)
                  ) : displayedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">
                          {isSearchActive ? "No customers match your criteria" : "No customers found"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    displayedCustomers.map((customer, index) => (
                      <tr
                        key={customer.id}
                        ref={
                          !isSearchActive && index === displayedCustomers.length - 1 
                            ? lastCustomerRef 
                            : null
                        }
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-medium text-sm">
                                {customer.name?.charAt(0) || "C"}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 block">
                                {customer.name}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {customer.username}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{customer.phone}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {customer.accountNumber}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{customer.routerName}</td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {customer.package || getPackageName(customer.packageId)}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {customer.amount?.toLocaleString() || "0"}
                        </td>
                        <td className="py-3 px-4">
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              customer.status
                            )}`}
                          >
                            {getStatusIcon(customer.status)}
                            {getStatusDisplay(customer.status)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {customer.nextPaymentDate || "Not set"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewCustomer(customer)}
                              className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                              title="View customer details"
                              disabled={actionLoading}
                            >
                              <Info className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setSelectedCustomer(customer)}
                              className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                              title="Edit customer"
                              disabled={actionLoading}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleShowDeleteConfirm(customer)}
                              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                              title="Delete customer"
                              disabled={actionLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Loading More Skeleton */}
              {loadingMore && (
                <>
                  {Array(3)
                    .fill()
                    .map((_, index) => (
                      <SkeletonTableRow key={`loading-${index}`} />
                    ))}
                </>
              )}

              {/* Table Footer */}
              {!listLoading && (
                <>
                  {isSearchActive && (
                    <div className="py-4 text-center text-sm text-gray-500">
                      {isSearching ? (
                        <Loader className="h-4 w-4 text-blue-600 animate-spin inline mr-2" />
                      ) : null}
                      Showing {displayedCustomers.length} {isSearching ? 'searching' : 'search'} results
                    </div>
                  )}
                  {page > 1 && !isSearchActive && loadingMore && (
                    <div className="py-4 text-center">
                      <Loader className="h-6 w-6 text-blue-600 animate-spin mx-auto" />
                      <p className="text-gray-500 text-sm mt-2">Loading more customers...</p>
                    </div>
                  )}
                  {!hasMore && displayedCustomers.length > 0 && !isSearchActive && (
                    <div className="py-4 text-center text-sm text-gray-500">
                      All customers loaded
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* View Customer Modal */}
      <Modal isOpen={!!viewCustomer} onClose={() => setViewCustomer(null)} title="Customer Details">
        {viewCustomer && <ViewModalContent customer={viewCustomer} />}
      </Modal>

      {/* Edit Customer Modal */}
      <Modal isOpen={!!selectedCustomer} onClose={() => setSelectedCustomer(null)} title="Edit Customer Details">
        {selectedCustomer && (
          <EditModalContent
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            packages={packages}
            routers={routers}
            actionLoading={actionLoading}
            handleUpdateCustomer={handleUpdateCustomer}
            getPackageAmount={getPackageAmount}
          />
        )}
      </Modal>


      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirmModal} onClose={() => !actionLoading && setShowDeleteConfirmModal(false)} title="Confirm Deletion">
        <DeleteConfirmModalContent
          customerToDelete={customerToDelete}
          deleteConfirmationText={deleteConfirmationText}
          setDeleteConfirmationText={setDeleteConfirmationText}
          isDeleteConfirmed={isDeleteConfirmed}
          actionLoading={actionLoading}
          handleDeleteCustomer={handleDeleteCustomer}
          setShowDeleteConfirmModal={setShowDeleteConfirmModal}
        />
      </Modal>
    </>
  );
}

// Modal Content Components
const ViewModalContent = ({ customer }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="text-center pb-4 border-b">
        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-blue-600 font-bold text-xl">{customer.name?.charAt(0) || "C"}</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{customer.name}</h2>
        <p className="text-gray-500">{customer.username}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard label="Account Number" value={customer.accountNumber} />
        <InfoCard label="Phone Number" value={customer.phone} />
        <InfoCard label="First Name" value={customer.firstName} />
        <InfoCard label="Last Name" value={customer.lastName} />
        <InfoCard label="Package" value={customer.package || "Unknown"} />
        <InfoCard label="Amount" value={`KES ${customer.amount?.toLocaleString() || "0"}`} />
        <InfoCard label="Router" value={customer.routerName || "Unknown"} />
        <InfoCard label="Status" value={customer.status?.charAt(0).toUpperCase() + customer.status?.slice(1) || "Unknown"} />
        <div className="bg-white p-3 rounded-lg border md:col-span-2">
          <p className="text-sm font-medium text-gray-500">Password</p>
          <div className="flex items-center gap-2 mt-1">
            <input
              type={showPassword ? "text" : "password"}
              value={customer.password || ""}
              readOnly
              className="flex-1 p-2 border border-gray-200 rounded bg-gray-50 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Important Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard label="Created Date" value={customer.createdAt || "Unknown"} />
          <InfoCard label="Next Payment" value={customer.nextPaymentDate || "Not set"} />
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="bg-white p-3 rounded-lg border">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-sm text-gray-900 mt-1">{value}</p>
  </div>
);

const EditModalContent = ({
  selectedCustomer,
  setSelectedCustomer,
  packages,
  routers,
  actionLoading,
  handleUpdateCustomer,
  getPackageAmount,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  // Format the nextPaymentDate to YYYY-MM-DD for the date input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              value={selectedCustomer.firstName || ""}
              onChange={(e) => setSelectedCustomer({ ...selectedCustomer, firstName: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Enter first name"
              disabled={actionLoading}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              value={selectedCustomer.lastName || ""}
              onChange={(e) => setSelectedCustomer({ ...selectedCustomer, lastName: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Enter last name"
              disabled={actionLoading}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={selectedCustomer.phone || ""}
            onChange={(e) => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            placeholder="Enter phone number"
            disabled={actionLoading}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
          <input
            type="text"
            value={selectedCustomer.accountNumber || ""}
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">Account number cannot be edited</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
            <input
              type="text"
              value={selectedCustomer.username || ""}
              onChange={(e) => setSelectedCustomer({ ...selectedCustomer, username: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Enter username"
              disabled={actionLoading}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={selectedCustomer.password || ""}
                onChange={(e) => setSelectedCustomer({ ...selectedCustomer, password: e.target.value })}
                className="w-full p-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="Enter password"
                disabled={actionLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                disabled={actionLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Router *</label>
          <select
            value={selectedCustomer.routerId || ""}
            onChange={(e) => setSelectedCustomer({ ...selectedCustomer, routerId: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            disabled={actionLoading || routers.length === 0}
            required
          >
            <option value="">Select a router</option>
            {routers.map((router) => (
              <option key={router.id} value={router.id}>
                {router.name} ({router.ip_address})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Package *</label>
          <select
            value={selectedCustomer.packageId || ""}
            onChange={(e) =>
              setSelectedCustomer({
                ...selectedCustomer,
                packageId: e.target.value,
                amount: getPackageAmount(e.target.value),
              })
            }
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            disabled={actionLoading || packages.length === 0}
            required
          >
            <option value="">Select a package</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} - KES {pkg.amount.toLocaleString()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Next Payment Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="date"
              value={selectedCustomer.next_payment_date || formatDateForInput(selectedCustomer.nextPaymentDate) || ""}
              onChange={(e) => setSelectedCustomer({ ...selectedCustomer, next_payment_date: e.target.value })}
              className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              disabled={actionLoading}
            />
          </div>
          {selectedCustomer.nextPaymentDate && !selectedCustomer.next_payment_date && (
            <p className="text-xs text-gray-500 mt-1">
              Current next payment date: {selectedCustomer.nextPaymentDate}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={selectedCustomer.status || "active"}
            onChange={(e) => setSelectedCustomer({ ...selectedCustomer, status: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            disabled={actionLoading}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-6">
        <button
          onClick={handleUpdateCustomer}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={
            actionLoading ||
            !selectedCustomer.firstName ||
            !selectedCustomer.lastName ||
            !selectedCustomer.phone ||
            !selectedCustomer.username ||
            !selectedCustomer.password ||
            !selectedCustomer.packageId ||
            !selectedCustomer.routerId
          }
        >
          {actionLoading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
          Save Changes
        </button>
        <button
          onClick={() => setSelectedCustomer(null)}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={actionLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};



// Delete Confirmation Modal Content
const DeleteConfirmModalContent = ({
  customerToDelete,
  deleteConfirmationText,
  setDeleteConfirmationText,
  isDeleteConfirmed,
  actionLoading,
  handleDeleteCustomer,
  setShowDeleteConfirmModal
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Customer</h3>
        <p className="text-gray-600 mb-4">
          This action cannot be undone. This will permanently deactivate the customer account and remove their access.
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm font-medium mb-2">Customer to be deleted:</p>
        <div className="bg-white rounded p-3 border border-red-200">
          <p className="font-medium text-gray-900">{customerToDelete?.name}</p>
          <p className="text-sm text-gray-600">Phone: {customerToDelete?.phone}</p>
          <p className="text-sm text-gray-600">Account: {customerToDelete?.accountNumber}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type <span className="font-bold">"{customerToDelete?.name}"</span> to confirm:
        </label>
        <input
          type="text"
          value={deleteConfirmationText}
          onChange={(e) => setDeleteConfirmationText(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
          placeholder={`Type "${customerToDelete?.name}" here`}
          disabled={actionLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          This extra step ensures you really want to delete this customer.
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleDeleteCustomer}
          className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={!isDeleteConfirmed || actionLoading}
        >
          {actionLoading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
          {actionLoading ? "Deleting..." : "Yes, Delete Customer"}
        </button>
        <button
          onClick={() => setShowDeleteConfirmModal(false)}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={actionLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};