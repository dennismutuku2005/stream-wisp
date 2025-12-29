"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  Eye,
  X,
  Download,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
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
    xl: "max-w-4xl",
  };

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close modal"
      ></div>
      <div
        className={`relative bg-white rounded-2xl shadow-xl p-6 ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto ring-1 ring-gray-200`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 id="modal-title" className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
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
  <div className="bg-white rounded-xl p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mt-2"></div>
      </div>
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
    </div>
  </div>
);

const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
      </td>
    ))}
  </tr>
);

export default function PaymentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("received");
  const [showModal, setShowModal] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalReceived: 0,
    totalDisbursed: 0,
    todayReceived: 0,
    pendingPayments: 0,
    totalFees: 0,
    netBalance: 0,
  });
  const [receivedPayments, setReceivedPayments] = useState([]);
  const [disbursedPayments, setDisbursedPayments] = useState([]);

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

  const fetchPaymentData = async () => {
    if (!userData?.user_id) return;

    try {
      setIsLoading(true);
      
      // Fetch stats
      const statsResponse = await fetch(`${API_ENDPOINT}/payments.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          action: 'get_payment_stats'
        })
      });

      const statsResult = await statsResponse.json();
      if (statsResult.success) {
        setStats(statsResult.data);
      }

      // Fetch received payments
      const receivedResponse = await fetch(`${API_ENDPOINT}/payments.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          action: 'get_received_payments',
          search: searchTerm
        })
      });

      const receivedResult = await receivedResponse.json();
      if (receivedResult.success) {
        setReceivedPayments(receivedResult.data);
      }

      // Fetch disbursed payments
      const disbursedResponse = await fetch(`${API_ENDPOINT}/payments.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          action: 'get_disbursed_payments',
          search: searchTerm
        })
      });

      const disbursedResult = await disbursedResponse.json();
      if (disbursedResult.success) {
        setDisbursedPayments(disbursedResult.data);
      }

    } catch (error) {
      console.error('Error fetching payment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentDetails = async (paymentId, paymentType) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/payments.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          action: 'get_payment_details',
          payment_id: paymentId,
          payment_type: paymentType
        })
      });

      const result = await response.json();
      if (result.success) {
        setSelectedPayment(result.data);
        setShowModal("paymentDetails");
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    }
  };

  useEffect(() => {
    if (userData?.user_id) {
      fetchPaymentData();
    }
  }, [userData, searchTerm]);

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, subtitle }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600">{title}</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-100 rounded animate-pulse mt-2"></div>
          ) : (
            <div className={`text-2xl font-bold ${colorClass} mt-2`}>
              {typeof value === "number" && value > 1000
                ? `KES ${value.toLocaleString()}`
                : value}
            </div>
          )}
          {subtitle && !isLoading && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${bgClass}`}>
          <Icon className={`h-6 w-6 ${colorClass}`} />
        </div>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: CheckCircle,
        label: "Completed",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: Clock,
        label: "Pending",
      },
      failed: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: AlertCircle,
        label: "Failed",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="h-4 w-4 mr-1" />
        {config.label}
      </span>
    );
  };

  const PaymentTable = ({ payments, type }) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                {type === "received" ? "Customer" : "Recipient"}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Transaction Code
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading
              ? [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
              : payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => fetchPaymentDetails(payment.id, type)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {payment.customerName || payment.recipientName}
                      </div>
                      <div className="text-sm text-gray-500">{payment.method}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono text-gray-900">
                        {payment.transactionCode}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        KES {payment.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{payment.date}</div>
                      <div className="text-sm text-gray-500">{payment.time}</div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchPaymentDetails(payment.id, type);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label="View details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
            {!isLoading && payments.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      <DashboardLayout>
        <div className="max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-base text-gray-500 mt-1">
                Monitor and manage your payment transactions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <StatCard
                  title="Total Received"
                  value={stats.totalReceived}
                  icon={ArrowDownLeft}
                  colorClass="text-green-600"
                  bgClass="bg-green-50"
                  subtitle="All time"
                />
                <StatCard
                  title="Total Disbursed"
                  value={stats.totalDisbursed}
                  icon={ArrowUpRight}
                  colorClass="text-red-600"
                  bgClass="bg-red-50"
                  subtitle="All time"
                />
                <StatCard
                  title="Net Balance"
                  value={stats.netBalance}
                  icon={DollarSign}
                  colorClass="text-blue-600"
                  bgClass="bg-blue-50"
                  subtitle="Current balance"
                />
                <StatCard
                  title="Today's Received"
                  value={stats.todayReceived}
                  icon={TrendingUp}
                  colorClass="text-purple-600"
                  bgClass="bg-purple-50"
                  subtitle="Last 24 hours"
                />
              </>
            )}
          </div>

          {/* Search and Tabs */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab("received")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    activeTab === "received"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Payments Received
                </button>
                <button
                  onClick={() => setActiveTab("disbursed")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    activeTab === "disbursed"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Payments Disbursed
                </button>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
                />
              </div>
            </div>

            {/* Payment Table */}
            <PaymentTable
              payments={activeTab === "received" ? receivedPayments : disbursedPayments}
              type={activeTab}
            />
          </div>

          {/* Partner Logos */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-center text-gray-900 mb-6">Our Payment Partners</h2>
            <img
              src="/payments.png"
              alt="Payment Partners"
              className="w-full max-w-md mx-auto h-11 object-contain"
            />
          </div>
        </div>
      </DashboardLayout>

      {/* Payment Details Modal */}
      <Modal
        isOpen={showModal === "paymentDetails"}
        onClose={() => setShowModal(null)}
        title="Payment Details"
        size="lg"
      >
        {selectedPayment && (
          <div className="space-y-8">
            {/* Status and Amount */}
            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl">
              <div>
                <h4 className="text-xl font-bold text-gray-900">
                  KES {selectedPayment.amount.toLocaleString()}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedPayment.date} at {selectedPayment.time}
                </p>
                <p className="text-sm text-gray-500 capitalize mt-1">
                  {selectedPayment.type} • {selectedPayment.method}
                </p>
              </div>
              {getStatusBadge(selectedPayment.status)}
            </div>

            {/* Payment Information */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transaction Code
                </label>
                <p className="text-sm font-mono bg-gray-100 p-3 rounded-lg">
                  {selectedPayment.transactionCode}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reference
                </label>
                <p className="text-sm font-mono bg-gray-100 p-3 rounded-lg">
                  {selectedPayment.reference}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedPayment.type === 'received' ? "Customer" : "Recipient"}
                </label>
                <p className="text-sm bg-gray-100 p-3 rounded-lg">
                  {selectedPayment.customerName || selectedPayment.recipientName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method
                </label>
                <p className="text-sm bg-gray-100 p-3 rounded-lg">
                  {selectedPayment.method}
                </p>
              </div>
              {selectedPayment.type === 'received' && selectedPayment.customerPhone && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Phone
                  </label>
                  <p className="text-sm bg-gray-100 p-3 rounded-lg">
                    {selectedPayment.customerPhone}
                  </p>
                </div>
              )}
              {selectedPayment.type === 'disbursed' && selectedPayment.mobileNumber && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <p className="text-sm bg-gray-100 p-3 rounded-lg">
                    {selectedPayment.mobileNumber}
                  </p>
                </div>
              )}
              {selectedPayment.type === 'disbursed' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Transaction Cost
                    </label>
                    <p className="text-sm bg-red-50 text-red-700 p-3 rounded-lg">
                      KES {selectedPayment.transactionCost?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Net Amount
                    </label>
                    <p className="text-sm bg-green-50 text-green-700 p-3 rounded-lg">
                      KES {selectedPayment.netAmount?.toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <p className="text-sm bg-gray-100 p-4 rounded-lg">
                {selectedPayment.description}
              </p>
            </div>

            {/* Additional Details */}
            {selectedPayment.type === 'received' && selectedPayment.planDetails && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan Details
                </label>
                <p className="text-sm bg-blue-50 text-blue-700 p-4 rounded-lg">
                  {selectedPayment.planDetails}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Download Receipt
              </button>
              <button
                onClick={() => setShowModal(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}