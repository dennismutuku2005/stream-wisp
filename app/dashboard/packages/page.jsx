"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  X,
  Wifi,
  Users,
  TrendingUp,
  Package,
  Loader,
  AlertTriangle,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import Cookies from "js-cookie";

// Skeleton Components
const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`}></div>
);

const SkeletonStatsCard = () => (
  <div className="bg-white rounded-lg p-4 shadow-sm border">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);

const SkeletonChart = () => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    <Skeleton className="h-6 w-48 mb-4" />
    <Skeleton className="h-64 w-full" />
  </div>
);

const SkeletonTableRow = () => (
  <tr className="border-t border-gray-100">
    <td className="py-4 px-6">
      <div className="flex items-center">
        <Skeleton className="h-10 w-10 rounded-lg mr-3" />
        <Skeleton className="h-4 w-32" />
      </div>
    </td>
    <td className="py-4 px-6">
      <Skeleton className="h-4 w-20" />
    </td>
    <td className="py-4 px-6">
      <Skeleton className="h-4 w-24" />
    </td>
    <td className="py-4 px-6">
      <Skeleton className="h-6 w-16 rounded-full" />
    </td>
    <td className="py-4 px-6">
      <Skeleton className="h-4 w-28" />
    </td>
    <td className="py-4 px-6">
      <Skeleton className="h-6 w-20 rounded-full" />
    </td>
    <td className="py-4 px-6">
      <div className="flex items-center gap-2 justify-end">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </td>
  </tr>
);

// Custom Toast Component
const CustomToast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200"
  };

  const textColor = {
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-yellow-800",
    info: "text-blue-800"
  };

  const iconColor = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400"
  };

  return createPortal(
    <div className="fixed top-4 right-4 z-[10000] animate-in slide-in-from-right-full duration-300">
      <div className={`rounded-lg border p-4 shadow-lg ${bgColor[type]} ${textColor[type]}`}>
        <div className="flex items-center gap-3">
          <AlertTriangle className={`h-5 w-5 ${iconColor[type]}`} />
          <div className="flex-1">
            <p className="font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className={`rounded p-1 hover:bg-black/10 ${textColor[type]}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
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
        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
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

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  packageName, 
  isLoading 
}) => {
  const [confirmationText, setConfirmationText] = useState("");

  const handleClose = () => {
    setConfirmationText("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    setConfirmationText("");
  };

  const isConfirmed = confirmationText === packageName;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Delete Package">
      <div className="text-center py-2">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Delete Package
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          This action cannot be undone. This will permanently delete the package
          <span className="font-semibold text-gray-900"> "{packageName}"</span>.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left">
          <p className="text-sm font-medium text-red-800 mb-2">Warning:</p>
          <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
            <li>Package data will be permanently removed</li>
            <li>This action cannot be reversed</li>
            <li>Any associated MikroTik profiles will remain and need manual removal</li>
          </ul>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
            Type <span className="font-mono text-red-600">"{packageName}"</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            placeholder={`Type "${packageName}" to confirm`}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isConfirmed || isLoading}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center disabled:bg-red-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              'Delete Package'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Package Card Component for Mobile View
const PackageCard = ({ pkg, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center">
        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <Wifi className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
          <p className="text-sm text-gray-500">{pkg.speed}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onEdit(pkg)}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(pkg)}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-500">Price</p>
        <p className="font-semibold text-gray-900">KES {pkg.price.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-gray-500">Customers</p>
        <p className="font-semibold text-gray-900">{pkg.customerCount}</p>
      </div>
      <div>
        <p className="text-gray-500">Revenue</p>
        <p className="font-semibold text-green-600">KES {pkg.monthlyRevenue.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-gray-500">Status</p>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pkg.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
            }`}
        >
          {pkg.isActive ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  </div>
);

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [stats, setStats] = useState({});
  const [distribution, setDistribution] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    mbps: ''
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

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const userCookie = Cookies.get("user_data");
    if (userCookie) {
      try {
        const parsedUserData = JSON.parse(userCookie);
        setUserData(parsedUserData);
      } catch (error) {
        showToast("Invalid user session. Please login again.", "error");
        setLoading(false);
      }
    } else {
      showToast("No user session found. Please login.", "error");
      setLoading(false);
    }
  }, []);

  const fetchPackages = async () => {
    if (!userData?.user_id) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINT}/packages.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_id
        })
      });

      const result = await response.json();

      if (result.success) {
        setPackages(result.data.packages);
        setStats(result.data.stats);
        setDistribution(result.data.distribution);
        setRevenueData(result.data.revenueData);
      } else {
        showToast("Failed to load packages: " + result.message, "error");
      }
    } catch (error) {
      showToast("Network error loading packages", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.user_id) {
      fetchPackages();
    }
  }, [userData]);

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const requestBody = {
        action: 'create_package',
        user_id: userData.user_id,
        name: formData.name,
        price: parseFloat(formData.price),
        mbps: parseInt(formData.mbps)
      };

      const response = await fetch(`${API_ENDPOINT}/packages.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (result.success) {
        showToast("Package created successfully!", "success");
        setShowModal(null);
        setFormData({ name: '', price: '', mbps: '' });
        fetchPackages();
      } else {
        showToast('Error creating package: ' + result.message, "error");
      }
    } catch (error) {
      showToast('Network error creating package: ' + error.message, "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdatePackage = async (e) => {
    e.preventDefault();
    // Show restriction modal instead of actually updating
    setShowModal("restriction_edit");
  };

  const handleDeletePackage = async () => {
    if (!packageToDelete || !userData?.user_id) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/deletepackage.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          package_id: packageToDelete.id
        })
      });

      const result = await response.json();

      if (result.success) {
        showToast(`Package "${packageToDelete.name}" deleted successfully!`, "success");
        setPackageToDelete(null);
        setShowModal(null);
        fetchPackages();
      } else {
        showToast('Error deleting package: ' + result.message, "error");
      }
    } catch (error) {
      showToast('Network error deleting package: ' + error.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (pkg) => {
    setPackageToDelete(pkg);
    setShowModal("delete");
  };

  const openEditModal = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({
      name: pkg.name,
      price: pkg.price.toString(),
      mbps: pkg.mbps.toString()
    });
    setShowModal("package");
  };

  const openCreateModal = () => {
    setSelectedPackage(null);
    setFormData({ name: '', price: '', mbps: '' });
    setShowModal("package");
  };

  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className={`p-2 rounded-full ${colorMap[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );

  if (loading) {
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
            {/* Header Skeleton */}
            <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Stats Skeleton */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array(4).fill().map((_, index) => (
                <SkeletonStatsCard key={index} />
              ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid gap-6 md:grid-cols-2">
              <SkeletonChart />
              <SkeletonChart />
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-600">
                      <th className="px-6 py-4 font-semibold">Package</th>
                      <th className="px-6 py-4 font-semibold">Speed</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Customers</th>
                      <th className="px-6 py-4 font-semibold">Revenue</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Array(5).fill().map((_, index) => (
                      <SkeletonTableRow key={index} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      {/* Custom Toast */}
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Package Management
              </h1>
              <p className="text-sm text-gray-500">
                Manage your internet packages and pricing
              </p>
            </div>
            <Link href="/dashboard/packages/add-package" className="text-sm text-gray-500 hover:underline mb-2">
              <button
                className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Packages"
              value={stats.totalPackages || 0}
              subtitle={`${stats.activePackages || 0} active`}
              icon={Package}
              color="blue"
            />
            <StatCard
              title="Subscribers"
              value={stats.totalCustomers || 0}
              subtitle="Across all packages"
              icon={Users}
              color="green"
            />
            <StatCard
              title="Monthly Revenue"
              value={`KES ${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}`}
              subtitle="Total monthly income"
              icon={TrendingUp}
              color="orange"
            />
            <StatCard
              title="ARPU"
              value={`KES ${stats.arpu || 0}`}
              subtitle="Average revenue per user"
              icon={TrendingUp}
              color="orange"
            />
          </div>

          {/* Charts */}
          {packages.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">
                  Customer Distribution
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={distribution}
                      dataKey="customers"
                      innerRadius={50}
                      outerRadius={90}
                    >
                      {distribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Customers']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Revenue by Package (K)</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="package" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`KES ${(value * 1000).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Packages Table - Desktop */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Package</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Speed</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customers</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Monthly Revenue</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src="/logo.png" alt="Package" className="h-10 w-10 bg-blue-100 rounded-lg p-2 mr-3" />
                          <div>
                            <div className="font-semibold text-gray-900">{pkg.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{pkg.speed}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          KES {pkg.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-gray-900">{pkg.customerCount}</span>
                          <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            customers
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-green-600">
                          KES {pkg.monthlyRevenue.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${pkg.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {pkg.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(pkg)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                            title="Edit package"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(pkg)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                            title="Delete package"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {packages.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Package className="h-12 w-12 mb-3 text-gray-300" />
                          <p className="text-lg font-medium mb-1">No packages found</p>
                          <p className="text-sm">Create your first package to get started</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Packages Cards - Mobile */}
          <div className="lg:hidden space-y-4">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
            {packages.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium text-gray-900 mb-1">No packages found</p>
                <p className="text-gray-500 mb-4">Create your first package to get started</p>
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Package
                </button>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>

      {/* Add/Edit Package Modal */}
      <Modal
        isOpen={showModal === "package"}
        onClose={() => setShowModal(null)}
        title={selectedPackage ? "Edit Package" : "Add Package"}
      >
        <form onSubmit={selectedPackage ? handleUpdatePackage : handleCreatePackage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="e.g., Basic Plan"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speed (Mbps)
              </label>
              <input
                type="number"
                value={formData.mbps}
                onChange={(e) => setFormData({ ...formData, mbps: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                min="1"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (KES)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                min="0"
                step="0.01"
                placeholder="1000.00"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(null)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              disabled={formLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              disabled={formLoading}
            >
              {formLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : selectedPackage ? (
                'Update Package'
              ) : (
                'Create Package'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showModal === "delete"}
        onClose={() => {
          setShowModal(null);
          setPackageToDelete(null);
        }}
        onConfirm={handleDeletePackage}
        packageName={packageToDelete?.name || ""}
        isLoading={deleteLoading}
      />
    </>
  );
}