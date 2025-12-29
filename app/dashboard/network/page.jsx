"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Wifi,
  WifiOff,
  Router,
  Users,
  Eye,
  X,
  RotateCw,
  Filter,
  Search,
  CheckCircle,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  AlertCircle,
  Plus,
  Settings,
  Activity,
  MapPin,
  Loader,
} from "lucide-react";
import Cookies from "js-cookie";

// Portal Modal Component
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

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      ></div>
      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-6 ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}
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

// Skeleton Components
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

const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100">
    {[...Array(7)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
      </td>
    ))}
  </tr>
);

export default function RouterPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(null);
  const [selectedRouter, setSelectedRouter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkingRouter, setCheckingRouter] = useState(null);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalRouters: 0,
    activeRouters: 0,
    totalCustomers: 0,
    offlineRouters: 0,
  });
  const [routers, setRouters] = useState([]);
  const [formData, setFormData] = useState({
    router_name: "",
    ip_address: "",
    api_port: 8728
  });

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const userCookie = Cookies.get("user_data");
    if (userCookie) {
      try {
        const parsedUserData = JSON.parse(userCookie);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchRouterData = async () => {
    if (!userData?.user_id) return;

    try {
      setIsLoading(true);

      // Fetch stats
      const statsResponse = await fetch(`${API_ENDPOINT}/routers.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          action: 'get_router_stats'
        })
      });

      const statsResult = await statsResponse.json();
      if (statsResult.success) {
        setStats(statsResult.data);
      }

      // Fetch routers
      const routersResponse = await fetch(`${API_ENDPOINT}/routers.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          action: 'get_routers',
          search: searchTerm
        })
      });

      const routersResult = await routersResponse.json();
      if (routersResult.success) {
        setRouters(routersResult.data);
      }

    } catch (error) {
      console.error('Error fetching router data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckRouter = async (routerId) => {
    if (!userData?.user_id) return;

    setCheckingRouter(routerId);

    try {
      const numericId = parseInt(routerId.replace('RTR', ''));

      const response = await fetch(`${API_ENDPOINT}/routers.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          action: 'check_router_status',
          router_id: numericId
        })
      });

      const result = await response.json();
      if (result.success) {
        // Refresh router data
        fetchRouterData();
      }
    } catch (error) {
      console.error('Error checking router:', error);
    } finally {
      setCheckingRouter(null);
    }
  };

  const handleAddRouter = async (e) => {
    e.preventDefault();
    if (!userData?.user_id) return;

    try {
      const response = await fetch(`${API_ENDPOINT}/routers.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          action: 'add_router',
          router_name: formData.router_name,
          ip_address: formData.ip_address,
          api_port: formData.api_port
        })
      });

      const result = await response.json();
      if (result.success) {
        setShowModal(null);
        setFormData({ router_name: "", ip_address: "", api_port: 8728 });
        fetchRouterData();
      } else {
        alert('Error adding router: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding router:', error);
      alert('Error adding router');
    }
  };

  useEffect(() => {
    if (userData?.user_id) {
      fetchRouterData();
    }
  }, [userData, searchTerm]);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-100 rounded animate-pulse mt-1"></div>
          ) : (
            <div className={`text-xl font-semibold text-gray-900 mt-1`}>
              {value}
            </div>
          )}
          {subtitle && !isLoading && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-2 rounded-full bg-${color}-100`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: CheckCircle,
        label: "Online",
      },
      inactive: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: WifiOff,
        label: "Offline",
      },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const filteredRouters = routers.filter(
    (router) =>
      router.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      router.ipAddress.includes(searchTerm)
  );

  const QuickActionButton = ({ icon: Icon, title, onClick, color }) => (
    <button
      onClick={onClick}
      className={`flex items-center p-3 bg-${color}-50 hover:bg-${color}-100 rounded-lg transition-colors w-full text-left`}
    >
      <Icon className={`h-5 w-5 text-${color}-600 mr-2`} />
      <span className="font-medium text-gray-900">{title}</span>
    </button>
  );

  return (
    <>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Router Management</h1>
              <p className="text-sm text-gray-500">
                Monitor and manage your network routers
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button
                onClick={() => setShowModal("addRouter")}
                className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Router
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <StatCard
                  title="Total Routers"
                  value={stats.totalRouters}
                  icon={Router}
                  color="blue"
                  subtitle="Network devices"
                />
                <StatCard
                  title="Active Routers"
                  value={stats.activeRouters}
                  icon={Wifi}
                  color="green"
                  subtitle="Currently online"
                />
                <StatCard
                  title="Total Customers"
                  value={stats.totalCustomers}
                  icon={Users}
                  color="purple"
                  subtitle="Connected users"
                />
                <StatCard
                  title="Offline Routers"
                  value={stats.offlineRouters}
                  icon={WifiOff}
                  color="red"
                  subtitle="Need attention"
                />
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <QuickActionButton
                icon={RotateCw}
                title="Refresh All"
                onClick={fetchRouterData}
                color="blue"
              />
              <QuickActionButton
                icon={Settings}
                title="Network Settings"
                onClick={() => setShowModal("networkSettings")}
                color="gray"
              />
              <QuickActionButton
                icon={Plus}
                title="Add New Router"
                onClick={() => setShowModal("addRouter")}
                color="green"
              />
            </div>
          </div>

          {/* Search and Router Table */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Router List</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search routers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Router Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        API Port
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customers
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Seen
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading
                      ? [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
                      : filteredRouters.map((router) => (
                        <tr
                          key={router.id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedRouter(router);
                            setShowModal("routerDetails");
                          }}
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">
                              {router.name}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-mono text-gray-900">
                              {router.ipAddress}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">
                              {router.apiPort}
                            </div>
                          </td>
                          <td className="px-4 py-3">{getStatusBadge(router.status)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center text-sm text-gray-900">
                              <Users className="h-3 w-3 mr-1 text-gray-400" />
                              {router.customers}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{router.lastSeen}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCheckRouter(router.id);
                                }}
                                disabled={checkingRouter === router.id}
                                className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                              >
                                {checkingRouter === router.id ? (
                                  <RotateCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Activity className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRouter(router);
                                  setShowModal("routerDetails");
                                }}
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {!isLoading && filteredRouters.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                          No routers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Router Details Modal */}
      <Modal
        isOpen={showModal === "routerDetails"}
        onClose={() => setShowModal(null)}
        title="Router Details"
        size="lg"
      >
        {selectedRouter && (
          <div className="space-y-6">
            {/* Status and Basic Info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {selectedRouter.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedRouter.ipAddress}:{selectedRouter.apiPort}
                </p>
              </div>
              {getStatusBadge(selectedRouter.status)}
            </div>

            {/* Router Information */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IP Address
                </label>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                  {selectedRouter.ipAddress}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Port
                </label>
                <p className="text-sm bg-gray-100 p-2 rounded">
                  {selectedRouter.apiPort}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Connected Customers
                </label>
                <p className="text-sm bg-gray-100 p-2 rounded">
                  {selectedRouter.customers} users
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Status Check
                </label>
                <p className="text-sm bg-gray-100 p-2 rounded">
                  {selectedRouter.lastSeen}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => handleCheckRouter(selectedRouter.id)}
                disabled={checkingRouter === selectedRouter.id}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {checkingRouter === selectedRouter.id ? (
                  <>
                    <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    Check Status
                  </>
                )}
              </button>
              <button
                onClick={() => setShowModal(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Router Modal */}
      <Modal
        isOpen={showModal === "addRouter"}
        onClose={() => setShowModal(null)}
        title="Add New Router"
      >
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Router Configuration Required
          </h3>

          <p className="text-gray-600 mb-6">
            Since you cannot assign remote IP addresses and configure router ports directly,
            please contact our customer care team to configure and add a new router for your network.
          </p>

          {/* Contact Information */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-medium text-blue-900 mb-3">Contact Customer Care</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-blue-800">+254 700 000 000</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-blue-800">support@onenetwork.com</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-blue-800">WhatsApp: +254 700 000 000</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowModal(null)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            I Understand
          </button>
        </div>
      </Modal>
    </>
  );
}