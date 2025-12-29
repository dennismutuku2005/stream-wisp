"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Search,
  X,
  Copy,
  Check,
  Calendar,
  Percent,
  DollarSign,
  RefreshCw,
  ArrowUpDown,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Tag,
  Users,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CustomToast from "@/components/customtoast";

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
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

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      ></div>
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-xl shadow-lg transform transition-all duration-300 p-6 w-full max-h-[90vh] overflow-y-auto ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Discount Form Component
const DiscountForm = ({ 
  mode = "create", 
  discount = null, 
  onSubmit, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    type: "percentage",
    value: "",
    minOrder: "",
    maxDiscount: "",
    usageLimit: "",
    perUserLimit: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (discount) {
      setFormData({
        name: discount.name || "",
        code: discount.code || "",
        description: discount.description || "",
        type: discount.type || "percentage",
        value: discount.value || "",
        minOrder: discount.minOrder || "",
        maxDiscount: discount.maxDiscount || "",
        usageLimit: discount.usageLimit || "",
        perUserLimit: discount.perUserLimit || "",
        startDate: discount.startDate || "",
        endDate: discount.endDate || "",
        isActive: discount.isActive !== false,
      });
    }
  }, [discount]);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onSubmit({
        ...formData,
        value: parseFloat(formData.value) || 0,
        minOrder: parseFloat(formData.minOrder) || 0,
        maxDiscount: parseFloat(formData.maxDiscount) || 0,
        usageLimit: parseInt(formData.usageLimit) || 0,
        perUserLimit: parseInt(formData.perUserLimit) || 0,
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Discount Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="e.g., Summer Sale"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Coupon Code *
              </label>
              <button
                type="button"
                onClick={generateCode}
                className="text-sm text-primary hover:text-primary/80"
              >
                Generate
              </button>
            </div>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
              placeholder="SUMMER25"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Discount Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
                formData.type === "percentage" 
                  ? "border-primary bg-primary/10" 
                  : "border-gray-300 dark:border-gray-700"
              }`}>
                <input
                  type="radio"
                  value="percentage"
                  checked={formData.type === "percentage"}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="sr-only"
                />
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  <span className="text-sm">Percentage</span>
                </div>
              </label>
              <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
                formData.type === "fixed" 
                  ? "border-primary bg-primary/10" 
                  : "border-gray-300 dark:border-gray-700"
              }`}>
                <input
                  type="radio"
                  value="fixed"
                  checked={formData.type === "fixed"}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="sr-only"
                />
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Fixed Amount</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Discount Value *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder={formData.type === "percentage" ? "25" : "500"}
                required
                min="0"
                max={formData.type === "percentage" ? "100" : undefined}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {formData.type === "percentage" ? "%" : "KES"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Order
              </label>
              <input
                type="number"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="0"
                min="0"
              />
            </div>
            {formData.type === "percentage" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Discount
                </label>
                <input
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="No limit"
                  min="0"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Usage Limit
              </label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Unlimited"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Per User Limit
              </label>
              <input
                type="number"
                value={formData.perUserLimit}
                onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Unlimited"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Updating..."}
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              {mode === "create" ? "Create Discount" : "Update Discount"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// Table Skeleton Loader
const TableSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        {/* Header row skeleton */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-800">
          {[...Array(7)].map((_, i) => (
            <div key={i} className={`h-4 bg-gray-300 dark:bg-gray-700 rounded ${
              i === 0 ? "col-span-3" : 
              i === 6 ? "col-span-1" : 
              "col-span-2"
            }`}></div>
          ))}
        </div>
        
        {/* Data rows skeleton */}
        {[...Array(6)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="col-span-3 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="col-span-2">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
            </div>
            <div className="col-span-2">
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
            </div>
            <div className="col-span-2">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
            </div>
            <div className="col-span-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
            </div>
            <div className="col-span-1 flex space-x-2">
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stats Skeleton Loader
const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
            </div>
            <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function DiscountsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [discounts, setDiscounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });

  // Generate sample discounts
  const generateDiscounts = () => {
    const now = new Date();
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return [
      {
        id: "1",
        name: "Summer Sale",
        code: "SUMMER25",
        description: "Summer season discount",
        type: "percentage",
        value: 25,
        minOrder: 5000,
        maxDiscount: 10000,
        usageLimit: 1000,
        perUserLimit: 1,
        usedCount: 542,
        startDate: now.toISOString().split('T')[0],
        endDate: oneMonthFromNow.toISOString().split('T')[0],
        isActive: true,
        createdAt: oneMonthAgo.toISOString(),
      },
      {
        id: "2",
        name: "Welcome Discount",
        code: "WELCOME10",
        description: "First purchase discount",
        type: "percentage",
        value: 10,
        minOrder: 0,
        maxDiscount: 2000,
        usageLimit: 0,
        perUserLimit: 1,
        usedCount: 328,
        startDate: now.toISOString().split('T')[0],
        endDate: oneMonthFromNow.toISOString().split('T')[0],
        isActive: true,
        createdAt: oneMonthAgo.toISOString(),
      },
      {
        id: "3",
        name: "Free Shipping",
        code: "FREESHIP",
        description: "Free shipping on orders",
        type: "fixed",
        value: 1500,
        minOrder: 10000,
        maxDiscount: 0,
        usageLimit: 500,
        perUserLimit: 1,
        usedCount: 189,
        startDate: now.toISOString().split('T')[0],
        endDate: oneMonthFromNow.toISOString().split('T')[0],
        isActive: true,
        createdAt: oneMonthAgo.toISOString(),
      },
      {
        id: "4",
        name: "Black Friday",
        code: "BLACK50",
        description: "Black Friday special",
        type: "percentage",
        value: 50,
        minOrder: 10000,
        maxDiscount: 20000,
        usageLimit: 200,
        perUserLimit: 1,
        usedCount: 200,
        startDate: oneMonthAgo.toISOString().split('T')[0],
        endDate: oneMonthAgo.toISOString().split('T')[0],
        isActive: false,
        createdAt: oneMonthAgo.toISOString(),
      },
      {
        id: "5",
        name: "Flash Sale",
        code: "FLASH30",
        description: "24-hour flash sale",
        type: "percentage",
        value: 30,
        minOrder: 0,
        maxDiscount: 5000,
        usageLimit: 300,
        perUserLimit: 1,
        usedCount: 267,
        startDate: now.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0],
        isActive: true,
        createdAt: oneMonthAgo.toISOString(),
      },
      {
        id: "6",
        name: "Bulk Order",
        code: "BULK20",
        description: "Discount for bulk orders",
        type: "percentage",
        value: 20,
        minOrder: 50000,
        maxDiscount: 0,
        usageLimit: 0,
        perUserLimit: 0,
        usedCount: 45,
        startDate: now.toISOString().split('T')[0],
        endDate: oneMonthFromNow.toISOString().split('T')[0],
        isActive: true,
        createdAt: oneMonthAgo.toISOString(),
      },
      {
        id: "7",
        name: "New Year Sale",
        code: "NEWYEAR15",
        description: "New Year celebration",
        type: "percentage",
        value: 15,
        minOrder: 3000,
        maxDiscount: 7500,
        usageLimit: 1000,
        perUserLimit: 2,
        usedCount: 423,
        startDate: now.toISOString().split('T')[0],
        endDate: oneMonthFromNow.toISOString().split('T')[0],
        isActive: true,
        createdAt: oneMonthAgo.toISOString(),
      },
      {
        id: "8",
        name: "Student Discount",
        code: "STUDENT10",
        description: "Special discount for students",
        type: "percentage",
        value: 10,
        minOrder: 2000,
        maxDiscount: 3000,
        usageLimit: 0,
        perUserLimit: 2,
        usedCount: 156,
        startDate: now.toISOString().split('T')[0],
        endDate: oneMonthFromNow.toISOString().split('T')[0],
        isActive: true,
        createdAt: oneMonthAgo.toISOString(),
      },
    ];
  };

  useEffect(() => {
    const fetchDiscounts = () => {
      setIsLoading(true);
      setTimeout(() => {
        const data = generateDiscounts();
        setDiscounts(data);
        setIsLoading(false);
      }, 1500);
    };

    fetchDiscounts();
  }, []);

  // Filter discounts
  const filteredDiscounts = discounts.filter((discount) => {
    const matchesSearch = discount.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        discount.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const now = new Date();
    const isExpired = new Date(discount.endDate) < now;
    const isActive = discount.isActive && !isExpired;

    if (statusFilter === "active") return matchesSearch && isActive;
    if (statusFilter === "inactive") return matchesSearch && !discount.isActive;
    if (statusFilter === "expired") return matchesSearch && isExpired;
    if (statusFilter === "upcoming") return matchesSearch && new Date(discount.startDate) > now;
    if (typeFilter === "percentage") return matchesSearch && discount.type === "percentage";
    if (typeFilter === "fixed") return matchesSearch && discount.type === "fixed";
    
    return matchesSearch;
  });

  // Sort discounts
  const sortedDiscounts = [...filteredDiscounts].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === "value") {
      aValue = a.value;
      bValue = b.value;
    } else if (sortBy === "usedCount") {
      aValue = a.usedCount || 0;
      bValue = b.usedCount || 0;
    } else if (sortBy === "createdAt") {
      aValue = new Date(a.createdAt);
      bValue = new Date(b.createdAt);
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Stats
  const totalDiscounts = discounts.length;
  const activeDiscounts = discounts.filter(d => d.isActive && new Date(d.endDate) > new Date()).length;
  const totalUses = discounts.reduce((sum, d) => sum + (d.usedCount || 0), 0);
  const expiredDiscounts = discounts.filter(d => new Date(d.endDate) < new Date()).length;

  // Handle create discount
  const handleCreateDiscount = (formData) => {
    const newDiscount = {
      id: `disc_${Date.now()}`,
      ...formData,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    setDiscounts([newDiscount, ...discounts]);
    setShowCreateModal(false);
    showToast("Discount created successfully", "success");
  };

  // Handle edit discount
  const handleEditDiscount = (formData) => {
    setDiscounts(discounts.map(disc => 
      disc.id === selectedDiscount.id ? { ...disc, ...formData } : disc
    ));
    setShowEditModal(false);
    setSelectedDiscount(null);
    showToast("Discount updated successfully", "success");
  };

  // Handle delete discount
  const handleDeleteDiscount = (discount) => {
    if (confirm(`Are you sure you want to delete "${discount.name}"?`)) {
      setDiscounts(discounts.filter(disc => disc.id !== discount.id));
      showToast("Discount deleted successfully", "success");
    }
  };

  // Handle copy code
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast("Coupon code copied", "success");
  };

  // Handle sort
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Handle bulk actions
  const handleBulkDelete = () => {
    if (selectedDiscounts.length === 0) {
      showToast("Please select discounts", "error");
      return;
    }

    if (confirm(`Delete ${selectedDiscounts.length} discount(s)?`)) {
      setDiscounts(discounts.filter(d => !selectedDiscounts.includes(d.id)));
      setSelectedDiscounts([]);
      showToast(`${selectedDiscounts.length} discounts deleted`, "success");
    }
  };

  const handleSelectAll = () => {
    if (selectedDiscounts.length === filteredDiscounts.length) {
      setSelectedDiscounts([]);
    } else {
      setSelectedDiscounts(filteredDiscounts.map(d => d.id));
    }
  };

  const handleSelectDiscount = (discountId) => {
    if (selectedDiscounts.includes(discountId)) {
      setSelectedDiscounts(selectedDiscounts.filter(id => id !== discountId));
    } else {
      setSelectedDiscounts([...selectedDiscounts, discountId]);
    }
  };

  // Show toast
  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
      isVisible: true,
    });

    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 5000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Get status color
  const getStatusColor = (discount) => {
    const now = new Date();
    if (!discount.isActive) return "gray";
    if (new Date(discount.endDate) < now) return "red";
    return "green";
  };

  const getStatusText = (discount) => {
    const now = new Date();
    if (!discount.isActive) return "Inactive";
    if (new Date(discount.endDate) < now) return "Expired";
    return "Active";
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
        <div className="max-w-7xl mx-auto py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link
                  href="/dashboard"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Home className="h-4 w-4" />
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Discounts
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Manage discount codes and promotions
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Discount
            </button>
          </div>

          {/* Stats */}
          {isLoading ? (
            <StatsSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {totalDiscounts}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {activeDiscounts}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Uses</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {totalUses}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expired</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      {expiredDiscounts}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            {/* Header Controls */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search discounts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedDiscounts.length > 0 && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedDiscounts.length} discount(s) selected
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <TableSkeleton />
              ) : sortedDiscounts.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left p-4 w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedDiscounts.length === filteredDiscounts.length &&
                            filteredDiscounts.length > 0
                          }
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                        />
                      </th>
                      <th
                        className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center gap-1">
                          Name
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Code
                      </th>
                      <th
                        className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer"
                        onClick={() => handleSort("value")}
                      >
                        <div className="flex items-center gap-1">
                          Value
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Status
                      </th>
                      <th
                        className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer"
                        onClick={() => handleSort("usedCount")}
                      >
                        <div className="flex items-center gap-1">
                          Uses
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Valid Until
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDiscounts.map((discount) => {
                      const statusColor = getStatusColor(discount);
                      const statusText = getStatusText(discount);
                      const isPercentage = discount.type === "percentage";

                      return (
                        <tr
                          key={discount.id}
                          className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedDiscounts.includes(discount.id)}
                              onChange={() => handleSelectDiscount(discount.id)}
                              className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                            />
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {discount.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {discount.description || "No description"}
                            </div>
                          </td>
                          <td className="p-4">
                            <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm font-mono">
                              {discount.code}
                            </code>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {isPercentage ? `${discount.value}%` : `KES ${discount.value}`}
                            </div>
                            {discount.minOrder > 0 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Min: KES {discount.minOrder}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                statusColor === "green"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : statusColor === "red"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                            >
                              {statusText}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {discount.usedCount}
                            </div>
                            {discount.usageLimit > 0 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                of {discount.usageLimit}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {new Date(discount.endDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyCode(discount.code)}
                                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                title="Copy Code"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedDiscount(discount);
                                  setShowEditModal(true);
                                }}
                                className="p-1.5 text-primary hover:text-primary/80"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDiscount(discount)}
                                className="p-1.5 text-red-500 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center">
                  <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 dark:text-white font-medium">No discounts found</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {searchQuery
                      ? "Try adjusting your search"
                      : "Create your first discount to get started"}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      Create Discount
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Create Discount Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Discount"
        size="lg"
      >
        <DiscountForm
          mode="create"
          onSubmit={handleCreateDiscount}
          onClose={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Discount Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDiscount(null);
        }}
        title="Edit Discount"
        size="lg"
      >
        {selectedDiscount && (
          <DiscountForm
            mode="edit"
            discount={selectedDiscount}
            onSubmit={handleEditDiscount}
            onClose={() => {
              setShowEditModal(false);
              setSelectedDiscount(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}