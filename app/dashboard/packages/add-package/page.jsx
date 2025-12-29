"use client";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Package,
  Plus,
  X,
  CheckCircle,
  Wifi,
  ArrowLeft,
  Loader,
  UserCheck,
  DollarSign,
  Gauge,
  Settings,
  Server
} from "lucide-react";
import Cookies from "js-cookie";
import CustomToast from "@/components/customtoast";
import { useRouter } from "next/navigation";

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

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
    </div>
  );
};

export default function AddPackagePage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [routersLoading, setRoutersLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [routers, setRouters] = useState([]);

  const [newPackage, setNewPackage] = useState({
    name: "",
    price: "",
    mbps: "",
    router_id: null,
  });

  const [toast, setToast] = useState({
    message: "",
    type: "error",
    isVisible: false,
  });

  const showToast = (message, type = "error") => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 5000);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    const userCookie = Cookies.get("user_data");
    if (userCookie) {
      try {
        const parsedUserData = JSON.parse(userCookie);
        setUserData(parsedUserData);
        fetchRouters(parsedUserData.user_id);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        showToast("Invalid user session. Please login again.", "error");
      }
    } else {
      showToast("No user session found. Please login.", "error");
    }
  }, []);

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;

  const fetchRouters = async (userId) => {
    setRoutersLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/packages.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_routers',
          user_id: userId
        })
      });

      const result = await response.json();
      if (result.success) {
        setRouters(result.data.routers);
      } else {
        showToast("Failed to load routers", "error");
      }
    } catch (error) {
      console.error("Error fetching routers:", error);
      showToast("Failed to load routers", "error");
    } finally {
      setRoutersLoading(false);
    }
  };

  const handleAddPackage = async () => {
    if (!newPackage.name || !newPackage.price || !newPackage.mbps) {
      showToast("Please fill in all required package information.", "error");
      return;
    }

    setLoading(true);
    try {
      const requestBody = {
        action: 'create_package',
        user_id: userData.user_id,
        name: newPackage.name,
        price: parseFloat(newPackage.price),
        mbps: parseInt(newPackage.mbps),
        router_id: newPackage.router_id || null
      };

      const response = await fetch(`${API_ENDPOINT}/packages.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (result.success) {
        showToast("Package created successfully!", "success");
        setNewPackage({ name: "", price: "", mbps: "", router_id: null });
        setShowConfirmation(false);
        setTimeout(() => router.push("/dashboard/packages"), 2000);
      } else {
        throw new Error(result.message || 'Failed to create package');
      }
    } catch (error) {
      console.error("Error creating package:", error);
      showToast(error.message || "Failed to create package.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const isFormValid = () => {
    return newPackage.name && newPackage.price && newPackage.mbps;
  };

  const PackageFeature = ({ icon: Icon, title, value, color = "blue" }) => (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-xl p-4`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-${color}-100 rounded-lg`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const selectedRouter = routers.find(r => r.id === newPackage.router_id);

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
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard/packages")}
                className="flex items-center px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Package</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                System Online
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Package Name *
                          </label>
                          <input
                            type="text"
                            value={newPackage.name}
                            onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Basic Plan, Premium Plus"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">Descriptive name for customers</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Internet Speed (Mbps) *
                          </label>
                          <input
                            type="number"
                            value={newPackage.mbps}
                            onChange={(e) => setNewPackage({ ...newPackage, mbps: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 10, 25, 50, 100"
                            min="1"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">Download speed in Mbps</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Monthly Price (KES) *
                          </label>
                          <input
                            type="number"
                            value={newPackage.price}
                            onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 1000, 2500, 5000"
                            min="0"
                            step="0.01"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">Monthly subscription fee</p>
                        </div>

                        {/* Router Selection */}
                        <div>
                          <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Server className="h-4 w-4 text-gray-400" />
                            Target Router
                          </label>
                          <select
                            value={newPackage.router_id || ""}
                            onChange={(e) => setNewPackage({ ...newPackage, router_id: e.target.value ? parseInt(e.target.value) : null })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select a router (optional)</option>
                            {routersLoading ? (
                              <option disabled>Loading routers...</option>
                            ) : (
                              routers.map((router) => (
                                <option key={router.id} value={router.id}>
                                  {router.name} ({router.ip_address}:{router.api_port}) - {router.status_label}
                                </option>
                              ))
                            )}
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            Select the router where this package will be applied. Leave empty for general packages.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Preview</h3>
                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <img src="/logo.png" alt="Package" className="h-12 w-12 bg-blue-100 rounded-lg p-2" />
                            <div>
                              <h4 className="text-xl font-bold text-gray-900">
                                {newPackage.name || "Package Name"}
                              </h4>
                              <p className="text-blue-600 font-medium">
                                {newPackage.mbps ? `${newPackage.mbps} Mbps` : "Speed"}
                              </p>
                              {selectedRouter && (
                                <p className="text-sm text-gray-500">
                                  Router: {selectedRouter.name}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-blue-100">
                              <span className="text-gray-600">Monthly Price</span>
                              <span className="text-lg font-bold text-green-600">
                                {newPackage.price ? `KES ${parseFloat(newPackage.price).toLocaleString()}` : "KES 0"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-blue-100">
                              <span className="text-gray-600">Internet Speed</span>
                              <span className="font-semibold text-gray-900">
                                {newPackage.mbps ? `${newPackage.mbps} Mbps` : "Not set"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-gray-600">Target Router</span>
                              <span className="font-semibold text-gray-900">
                                {selectedRouter ? selectedRouter.name : "All Routers"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-gray-600">Billing Cycle</span>
                              <span className="font-semibold text-gray-900">Monthly</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <PackageFeature
                            icon={Gauge}
                            title="Speed"
                            value={newPackage.mbps ? `${newPackage.mbps} Mbps` : "Not set"}
                            color="blue"
                          />
                          <PackageFeature
                            icon={DollarSign}
                            title="Price"
                            value={newPackage.price ? `KES ${parseFloat(newPackage.price).toLocaleString()}` : "Not set"}
                            color="green"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                      disabled={!isFormValid() || loading || routersLoading}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Create Package
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/dashboard/packages")}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="xl:col-span-1">
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-400" />
                    Router Selection
                  </h3>
                  <div className="space-y-3">
                    {routersLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader className="h-5 w-5 animate-spin text-blue-600 mr-2" />
                        Loading routers...
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600">
                          Select the specific router where this package will be applied.
                          This helps in router-specific rate limiting and queue management.
                        </p>
                        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                          {routers.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">No routers found</p>
                          ) : (
                            routers.map((router) => (
                              <div
                                key={router.id}
                                className={`p-3 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 ${newPackage.router_id === router.id
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'border-gray-200'
                                  }`}
                                onClick={() => setNewPackage({ ...newPackage, router_id: router.id })}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">{router.name}</p>
                                    <p className="text-xs text-gray-500">{router.ip_address}:{router.api_port}</p>
                                  </div>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${router.active_status
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                      }`}
                                  >
                                    {router.status_label}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewPackage({ ...newPackage, router_id: null })}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-2"
                        >
                          Use for all routers
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Package Name</span>
                      <span className={`text-sm font-medium ${newPackage.name ? 'text-green-600' : 'text-red-600'}`}>
                        {newPackage.name ? '✓ Complete' : '✗ Required'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Internet Speed</span>
                      <span className={`text-sm font-medium ${newPackage.mbps ? 'text-green-600' : 'text-red-600'}`}>
                        {newPackage.mbps ? '✓ Complete' : '✗ Required'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Price</span>
                      <span className={`text-sm font-medium ${newPackage.price ? 'text-green-600' : 'text-red-600'}`}>
                        {newPackage.price ? '✓ Complete' : '✗ Required'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Router Selection</span>
                      <span className="text-sm font-medium text-gray-600">
                        {newPackage.router_id ? '✓ Selected' : 'Optional'}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">Overall Status</span>
                        <span className={`text-sm font-bold ${isFormValid() ? 'text-green-600' : 'text-red-600'}`}>
                          {isFormValid() ? 'Ready to Create' : 'Incomplete'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      <Modal isOpen={showConfirmation} onClose={() => !loading && setShowConfirmation(false)} title="Confirm Package Details">
        <div className="space-y-6">
          <div className="text-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Package Creation</h3>
            <p className="text-gray-600">Review the package details before creating.</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500 block">Package Name:</span>
                  <p className="text-gray-900 font-semibold">{newPackage.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500 block">Internet Speed:</span>
                  <p className="text-gray-900">{newPackage.mbps} Mbps</p>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-500 block">Monthly Price:</span>
                <p className="text-green-600 font-bold text-lg">KES {parseFloat(newPackage.price).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500 block">Target Router:</span>
                <p className="text-gray-900 font-medium">
                  {selectedRouter ? `${selectedRouter.name} (${selectedRouter.ip_address})` : "All Routers"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> This package will be available for new subscriptions.
              Router-specific packages will only apply rate limits on the selected router.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddPackage}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
              Yes, Create Package
            </button>
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              disabled={loading}
            >
              No, Go Back
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}