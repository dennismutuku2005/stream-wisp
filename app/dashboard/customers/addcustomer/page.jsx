"use client";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Users, Plus, X, CheckCircle, Eye, EyeOff, Loader, ArrowLeft, UserCheck, Calendar } from "lucide-react";
import Cookies from "js-cookie";
import CustomToast from "@/components/customtoast";
import { useRouter } from "next/navigation";

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

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div
        className="relative bg-white rounded-2xl shadow-2xl transform transition-transform duration-300 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
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

export default function AddCustomerPage() {
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [routers, setRouters] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const [showPassword, setShowPassword] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    message: "",
    type: "error",
    isVisible: false,
  });

  // Custom toast function
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

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;

  // Fetch packages and routers data from API
  const fetchData = async () => {
    if (!userData?.user_id) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/customers.php?isp_id=${userData.user_id}`, {
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

      console.log("Fetched packages:", data.packages);
      console.log("Fetched routers:", data.routers);

      setPackages(data.packages || []);
      setRouters(data.routers || []);

      // Set default values
      if (data.routers && data.routers.length > 0) {
        const defaultRouterId = data.routers[0].id;
        setNewCustomer(prev => ({
          ...prev,
          routerId: defaultRouterId
        }));

        // Filter packages for the default router
        filterPackagesForRouter(defaultRouterId, data.packages || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      showToast("Failed to load packages and routers. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filter packages based on selected router
  const filterPackagesForRouter = (routerId, packagesList = packages) => {


    // For now, show all packages since we don't have router-specific packages in the API
    // In a real implementation, you would filter packages that belong to the selected router
    const filtered = packagesList.filter(pkg => {

      // Add your filtering logic here based on your database structure
      //convert routerId to string for comparison
      routerId = parseInt(routerId);
      return pkg.routerid === routerId;
    });

  
    setFilteredPackages(filtered);
    console.log(newCustomer);

    // Reset package selection if current package is not in filtered list
    if (newCustomer.packageId && !filtered.some(pkg => pkg.id === newCustomer.packageId)) {
      if (filtered.length > 0) {
        setNewCustomer(prev => ({ ...prev, packageId: filtered[0].id }));
      } else {
        setNewCustomer(prev => ({ ...prev, packageId: "" }));
      }
    }
  };

  // Handle router change
  const handleRouterChange = (routerId) => {
    console.log("Router changed to:", routerId);
    const parsedId = parseInt(routerId, 10);
    setNewCustomer(prev => ({ ...prev, routerId: parsedId }));
    filterPackagesForRouter(parsedId);
    console.log(newCustomer);
  };

  useEffect(() => {
    if (userData?.user_id) {
      fetchData();
    }
  }, [userData]);

  const handleAddCustomer = async () => {
    if (
      !newCustomer.firstName ||
      !newCustomer.lastName ||
      !newCustomer.phone ||
      !newCustomer.username ||
      !newCustomer.password ||
      !newCustomer.packageId ||
      !newCustomer.routerId
    ) {
      showToast("Please fill in all the required customer information.", "error");
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/customers.php?isp_id=${userData.user_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      showToast("Customer account created successfully!", "success");

      // Reset form
      setNewCustomer({
        firstName: "",
        lastName: "",
        phone: "",
        username: "",
        password: "",
        packageId: filteredPackages[0]?.id || "",
        routerId: routers[0]?.id || "",
        status: "active",
        next_payment_date: "",
      });
      setShowConfirmation(false);

      // Redirect to customers page after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/customers");
      }, 2000);
    } catch (err) {
      console.error("Error creating customer:", err);
      showToast(err.message || "Failed to create customer. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const getPackageName = (packageId) => {
    packageId = parseInt(packageId, 10);
    const pkg = packages.find((p) => p.id === packageId);
    return pkg ? pkg.name : "Unknown Package";
  };

  const getPackageAmount = (packageId) => {
    packageId = parseInt(packageId, 10);
    const pkg = packages.find((p) => p.id === packageId);
    console.log("Getting amount for package:", packageId, "Found:", pkg);
    return pkg ? pkg.amount : 0;
  };

  const getRouterName = (routerId) => {
    const router = routers.find((r) => r.id === routerId);
    return router ? `${router.name} (${router.ip_address})` : "Unknown Router";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const isFormValid = () => {
    return (
      newCustomer.firstName &&
      newCustomer.lastName &&
      newCustomer.phone &&
      newCustomer.username &&
      newCustomer.password &&
      newCustomer.packageId &&
      newCustomer.routerId
    );
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard/customers")}
                className="flex items-center px-3 py-1.5 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Customer</h1>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Form Section - Takes 2/3 width on large screens */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information - Horizontal Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={newCustomer.firstName}
                            onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter first name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={newCustomer.lastName}
                            onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter last name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={newCustomer.phone}
                            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter phone number"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* PPPoE Credentials */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">PPPoE Credentials</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username *
                          </label>
                          <input
                            type="text"
                            value={newCustomer.username}
                            onChange={(e) => setNewCustomer({ ...newCustomer, username: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter username"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">For PPPoE authentication</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={newCustomer.password}
                              onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                              className="w-full p-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter password"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">For PPPoE authentication</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Configuration - Horizontal Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Configuration</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Router *
                          </label>
                          <select
                            value={newCustomer.routerId}
                            onChange={(e) => handleRouterChange(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select a router</option>
                            {routers.map((router) => (
                              <option key={router.id} value={router.id}>
                                {router.name} ({router.ip_address})
                              </option>
                            ))}
                          </select>
                          {routers.length === 0 && !loading && (
                            <p className="text-xs text-red-500 mt-1">No routers available. Please create routers first.</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Package *
                          </label>
                          <select
                            value={newCustomer.packageId}
                            onChange={(e) => setNewCustomer({ ...newCustomer, packageId: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select a package</option>
                            {filteredPackages.map((pkg) => (
                              <option key={pkg.id} value={pkg.id}>
                                {pkg.name} - KES {pkg.amount?.toLocaleString() || '0'}
                              </option>
                            ))}
                          </select>
                          {filteredPackages.length === 0 && !loading && (
                            <p className="text-xs text-red-500 mt-1">
                              {newCustomer.routerId
                                ? "No packages available for the selected router."
                                : "Please select a router first to see available packages."
                              }
                            </p>
                          )}
                          {newCustomer.packageId && (
                            <p className="text-xs text-green-600 mt-1">
                              Selected: {getPackageName(newCustomer.packageId )} - KES {getPackageAmount(newCustomer.packageId)?.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Next Payment Date
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                              type="date"
                              value={newCustomer.next_payment_date}
                              onChange={(e) => setNewCustomer({ ...newCustomer, next_payment_date: e.target.value })}
                              className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Leave empty to use default (30 days from now)
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <select
                            value={newCustomer.status}
                            onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                          disabled={!isFormValid() || loading}
                        >
                
                          Create Customer Account
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar - Takes 1/3 width on large screens */}
            <div className="xl:col-span-1">
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Available Packages</span>
                      <span className="text-lg font-semibold text-blue-600">{filteredPackages.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Available Routers</span>
                      <span className="text-lg font-semibold text-green-600">{routers.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Form Progress</span>
                      <span className="text-lg font-semibold text-purple-600">
                        {isFormValid() ? '100%' : 'Incomplete'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selected Package Info */}
                {newCustomer.packageId && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Package</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900">
                          {getPackageName(newCustomer.packageId)}
                        </h4>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                          KES {getPackageAmount(newCustomer.packageId)?.toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Monthly subscription
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Help Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>All fields marked with * are required</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>Packages are filtered based on the selected router</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>PPPoE credentials will be used for customer authentication</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>Next payment date can be set manually or left empty for default</p>
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-center py-4">
                      <Loader className="h-5 w-5 text-blue-600 animate-spin mr-2" />
                      <p className="text-gray-600 text-sm">Loading packages and routers...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirmation} onClose={() => !actionLoading && setShowConfirmation(false)} title="Confirm Customer Details">
        <div className="space-y-6">
          <div className="text-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Customer Details</h3>
            <p className="text-gray-600">Please review the customer information before creating the account.</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-500">Full Name:</span>
                  <p className="text-gray-900 font-medium">{newCustomer.firstName} {newCustomer.lastName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Phone:</span>
                  <p className="text-gray-900">{newCustomer.phone}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Username:</span>
                  <p className="text-gray-900">{newCustomer.username}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-500">Status:</span>
                  <p className="text-gray-900 capitalize">{newCustomer.status}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Router:</span>
                  <p className="text-gray-900 text-xs">{getRouterName(newCustomer.routerId)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Package:</span>
                  <p className="text-gray-900">{getPackageName(newCustomer.packageId)}</p>
                  <p className="text-green-600 font-medium">KES {getPackageAmount(newCustomer.packageId)?.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Next Payment:</span>
                  <p className="text-gray-900">
                    {newCustomer.next_payment_date
                      ? new Date(newCustomer.next_payment_date).toLocaleDateString()
                      : new Date(Date.now() + 86400000 * 30).toLocaleDateString()
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> {newCustomer.next_payment_date
                ? `Next payment date is set to ${new Date(newCustomer.next_payment_date).toLocaleDateString()}`
                : 'Billing cycle starts from tomorrow. Next payment date will be set to 30 days from now.'
              } You can change it later in the edit Panel.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddCustomer}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={actionLoading}
            >
              {actionLoading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
              Yes, Create Customer
            </button>
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={actionLoading}
            >
              No, Go Back
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}