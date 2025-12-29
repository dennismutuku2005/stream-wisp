"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Cookies from "js-cookie";
import {
  DollarSign,
  Wallet,
  ArrowUpRight,
  CheckCircle,
  X,
  AlertCircle,
  Info,
  RotateCw,
  CreditCard,
  Clock,
  Loader2,
  Calendar,
  FileText,
  Hash
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
    xl: "max-w-4xl"
  };

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      ></div>

      <div
        className={`relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300 p-6 w-full max-h-[90vh] overflow-y-auto ${sizeClasses[size]}`}
        style={{
          boxShadow: "0 25px 50px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
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

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: CheckCircle,
      label: "Completed"
    },
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: Clock,
      label: "Pending"
    },
    failed: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: AlertCircle,
      label: "Failed"
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

// Compact Transaction Item
const CompactTransactionItem = ({ transaction, onViewDetails }) => {
  return (
    <div 
      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
      onClick={() => onViewDetails(transaction)}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          transaction.status === 'completed' ? 'bg-green-100' : 
          transaction.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          <DollarSign className={`h-4 w-4 ${
            transaction.status === 'completed' ? 'text-green-600' : 
            transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className="font-medium text-gray-900 text-sm truncate">
              KES {transaction.amount.toLocaleString()}
            </p>
          </div>
          <p className="text-xs text-gray-500 truncate">
            {new Date(transaction.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-2">
        <StatusBadge status={transaction.status} />
        <p className={`text-xs font-medium mt-1 ${
          transaction.status === 'completed' ? 'text-green-600' : 
          transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
        }`}>
          KES {transaction.net_amount.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

// Transaction Details Modal
const TransactionDetailsModal = ({ transaction, isOpen, onClose }) => {
  if (!transaction) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details" size="md">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Reference</p>
            <p className="font-semibold text-gray-900">{transaction.reference}</p>
          </div>
          <StatusBadge status={transaction.status} />
        </div>

        {/* Amount Details */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Amount Details</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600">Withdrawal Amount</p>
              <p className="font-semibold text-gray-900">KES {transaction.amount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-xs text-gray-600">Transaction Fee</p>
              <p className="font-semibold text-red-600">KES {transaction.transaction_cost}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg col-span-2">
              <p className="text-xs text-gray-600">Net Amount Deducted</p>
              <p className="font-semibold text-green-600">KES {transaction.net_amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Transaction Information */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Transaction Information</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Date & Time</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {new Date(transaction.date).toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Transaction ID</span>
              </div>
              <span className="text-sm font-medium text-gray-900 truncate ml-2">
                {transaction.conversation_id || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Remarks */}
        {transaction.remarks && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Remarks</h4>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{transaction.remarks}</p>
            </div>
          </div>
        )}

        {/* Response Description */}
        {transaction.response_description && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Status Message</h4>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">{transaction.response_description}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Eligibility Check Component
const EligibilityCheck = ({ amount, availableBalance, onEligibilityChange }) => {
  const [checks, setChecks] = useState({
    minAmount: false,
    sufficientBalance: false,
    validAmount: false
  });

  const transactionCost = getTransactionCost(parseFloat(amount) || 0);
  const totalDeduction = (parseFloat(amount) || 0) + transactionCost;

  useEffect(() => {
    const amountNum = parseFloat(amount) || 0;
    const newChecks = {
      minAmount: amountNum >= 100,
      sufficientBalance: totalDeduction <= availableBalance,
      validAmount: amountNum > 0 && !isNaN(amountNum)
    };
    
    setChecks(newChecks);
    onEligibilityChange(newChecks.minAmount && newChecks.sufficientBalance && newChecks.validAmount);
  }, [amount, availableBalance, totalDeduction, onEligibilityChange]);

  if (!amount || parseFloat(amount) <= 0) return null;

  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="font-medium text-gray-900 mb-3 text-sm">Eligibility Check</h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          {checks.minAmount ? (
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
          )}
          <span className={checks.minAmount ? "text-green-700" : "text-red-700"}>
            Minimum amount: KES 100
          </span>
        </div>
        <div className="flex items-center">
          {checks.sufficientBalance ? (
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
          )}
          <span className={checks.sufficientBalance ? "text-green-700" : "text-red-700"}>
            Sufficient balance (Total needed: KES {totalDeduction.toLocaleString()})
          </span>
        </div>
        <div className="flex items-center">
          {checks.validAmount ? (
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
          )}
          <span className={checks.validAmount ? "text-green-700" : "text-red-700"}>
            Valid amount entered
          </span>
        </div>
        
        {/* Transaction Cost Breakdown */}
        <div className="pt-2 mt-2 border-t border-blue-200">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Withdrawal Amount:</span>
            <span className="font-medium">KES {parseFloat(amount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Transaction Fee:</span>
            <span className="font-medium text-red-600">KES {transactionCost}</span>
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-gray-700">Total Deduction:</span>
            <span className="text-blue-700">KES {totalDeduction.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Withdraw() {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [userData, setUserData] = useState(null);
  const [walletData, setWalletData] = useState({
    availableBalance: 0,
    totalWithdrawn: 0,
    accountDetails: {
      bankName: "",
      accountNumber: "",
      accountType: ""
    }
  });
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [lastWithdrawal, setLastWithdrawal] = useState(null);

  const router = useRouter();

  const [toast, setToast] = useState({
    message: "",
    type: "error",
    isVisible: false
  });

  const showToast = (message, type = "error") => {
    setToast({
      message,
      type,
      isVisible: true
    });

    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 5000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const API_BASE = "https://api.onenetwork-system.com/pppoe/user/v1/withdraw.php";

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
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } else {
      showToast("No user session found. Please login.", "error");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }, [router]);

  // Fetch wallet data and account details
  const fetchWalletData = async () => {
    if (!userData?.user_id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}?user_id=${userData.user_id}`);
      const result = await response.json();

      if (result.success) {
        setWalletData({
          availableBalance: result.data.wallet.availableBalance,
          totalWithdrawn: result.data.wallet.totalWithdrawn,
          accountDetails: result.data.accountDetails
        });
        setWithdrawalHistory(result.data.recentWithdrawals);
        
        if (!isLoading) {
          showToast("Wallet data refreshed successfully!", "success");
        }
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Wallet API Error:', err);
      showToast("Failed to load wallet data. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.user_id) {
      fetchWalletData();
    }
  }, [userData]);

  const handleWithdraw = async () => {
    if (!isEligible) {
      showToast("Please check eligibility requirements", "error");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          amount: parseFloat(withdrawAmount),
          remarks: remarks || "Withdrawal request"
        })
      });

      const result = await response.json();

      if (result.success) {
        const transactionCost = getTransactionCost(parseFloat(withdrawAmount));
        const netAmount = parseFloat(withdrawAmount) - transactionCost;
        
        const withdrawalRecord = {
          id: result.withdrawal_id,
          amount: parseFloat(withdrawAmount),
          transaction_cost: transactionCost,
          net_amount: netAmount,
          status: result.status,
          date: new Date().toISOString(),
          remarks: remarks || "Withdrawal request",
          reference: `WD-${String(result.withdrawal_id).padStart(3, '0')}`,
          response_description: result.response?.ResponseDescription || "Initiated successfully",
          conversation_id: result.conversation_id || '',
          originator_conversation_id: result.originator_conversation_id || ''
        };

        setLastWithdrawal(withdrawalRecord);

        // Update local state
        const totalDeduction = parseFloat(withdrawAmount) + transactionCost;
        setWalletData(prev => ({
          ...prev,
          availableBalance: prev.availableBalance - totalDeduction
        }));

        // Add to withdrawal history
        setWithdrawalHistory(prev => [withdrawalRecord, ...prev]);
        
        if (result.status === 'pending') {
          showToast(`Withdrawal initiated! KES ${parseFloat(withdrawAmount).toLocaleString()} is being processed.`, "success");
          setShowModal("success");
        } else {
          showToast("Withdrawal failed. Please try again or contact support.", "error");
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Withdrawal Error:', error);
      showToast(error.message || "Failed to process withdrawal. Please try again.", "error");
    } finally {
      setIsProcessing(false);
      setWithdrawAmount("");
      setRemarks("");
    }
  };

  const handleViewTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal("transaction-details");
  };

  // Show only latest 5 transactions
  const latestTransactions = withdrawalHistory.slice(0, 5);

  if (!userData && isLoading) {
    return (
      <>
        <CustomToast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
        <DashboardLayout>
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <RotateCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Loading user session...</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </>
    );
  }

  return (
    <>
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-4 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Withdraw Funds</h1>
              <p className="text-gray-500 mt-2 text-sm lg:text-base">
                Instant withdrawals to your registered bank account
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal("learn")}
                className="flex items-center px-3 lg:px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Info className="h-4 w-4 mr-2 text-gray-600" />
                <span className="text-sm text-gray-700">Learn More</span>
              </button>
              <button
                onClick={fetchWalletData}
                disabled={isLoading}
                className="flex items-center px-3 lg:px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RotateCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Wallet & Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Wallet Overview Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Available Balance */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <Wallet className="h-6 w-6 lg:h-8 lg:w-8 opacity-90" />
                    <div className="text-right">
                      <div className="text-blue-100 text-xs lg:text-sm">Available Balance</div>
                      <div className="text-xl lg:text-2xl font-bold">
                        {isLoading ? (
                          <div className="h-6 lg:h-8 w-20 lg:w-24 bg-blue-400 rounded animate-pulse"></div>
                        ) : (
                          `KES ${walletData.availableBalance.toLocaleString()}`
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-blue-100 text-xs lg:text-sm">Ready for instant withdrawal</p>
                </div>

                {/* Total Withdrawn */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <ArrowUpRight className="h-6 w-6 lg:h-8 lg:w-8 opacity-90" />
                    <div className="text-right">
                      <div className="text-green-100 text-xs lg:text-sm">Total Withdrawn</div>
                      <div className="text-xl lg:text-2xl font-bold">
                        {isLoading ? (
                          <div className="h-6 lg:h-8 w-20 lg:w-24 bg-green-400 rounded animate-pulse"></div>
                        ) : (
                          `KES ${walletData.totalWithdrawn.toLocaleString()}`
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-green-100 text-xs lg:text-sm">All-time withdrawals</p>
                </div>
              </div>

              {/* Withdrawal Form */}
              <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Withdraw Funds</h3>
                
                {/* Account Details */}
                <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm lg:text-base">Withdrawal Account</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs lg:text-sm text-gray-600">{walletData.accountDetails.bankName}</p>
                      <p className="text-xs lg:text-sm text-gray-600">Account: {walletData.accountDetails.accountNumber}</p>
                      <p className="text-xs lg:text-sm text-gray-600">Type: {walletData.accountDetails.accountType}</p>
                    </div>
                    <CreditCard className="h-5 w-5 lg:h-6 lg:w-6 text-gray-400" />
                  </div>
                </div>

                {/* Withdrawal Amount */}
                <div className="mb-4 lg:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Withdrawal Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">KES</span>
                    </div>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="block w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                      placeholder="0.00"
                      min="100"
                      max={walletData.availableBalance}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        onClick={() => setWithdrawAmount(walletData.availableBalance.toString())}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Minimum: KES 100 • Maximum: KES {walletData.availableBalance.toLocaleString()}
                  </p>
                </div>

                {/* Eligibility Check */}
                <EligibilityCheck 
                  amount={withdrawAmount}
                  availableBalance={walletData.availableBalance}
                  onEligibilityChange={setIsEligible}
                />

                {/* Remarks */}
                <div className="mb-4 lg:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks (Optional)
                  </label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                    placeholder="e.g., Operational expenses, Salary payment, etc."
                  />
                </div>

                {/* Withdraw Button */}
                <button
                  onClick={() => setShowModal("confirm")}
                  disabled={!isEligible || isLoading || isProcessing}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-sm lg:text-base"
                >
                  {isProcessing ? "Processing..." : "Withdraw Instantly"}
                </button>
              </div>
            </div>

            {/* Right Column - Recent Transactions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 h-full">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Latest Transactions</h3>
                  <span className="text-xs text-gray-500">
                    Showing {Math.min(latestTransactions.length, 5)} of {withdrawalHistory.length}
                  </span>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 animate-pulse">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-gray-100 rounded-full"></div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-100 rounded w-16"></div>
                            <div className="h-2 bg-gray-100 rounded w-12"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-100 rounded w-12"></div>
                          <div className="h-2 bg-gray-100 rounded w-8"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : latestTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {latestTransactions.map((transaction) => (
                      <CompactTransactionItem 
                        key={transaction.id} 
                        transaction={transaction}
                        onViewDetails={handleViewTransactionDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 lg:py-12 text-gray-500">
                    <Wallet className="h-8 w-8 lg:h-12 lg:w-12 mx-auto mb-3 lg:mb-4 text-gray-300" />
                    <p className="font-medium text-sm lg:text-base">No transactions yet</p>
                    <p className="text-xs lg:text-sm mt-1">Your withdrawals will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Learn More Modal */}
      <Modal isOpen={showModal === "learn"} onClose={() => setShowModal(null)} title="About Withdrawals">
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Instant Withdrawal Process</h4>
                <p className="text-blue-700 text-sm">
                  Withdraw your earnings instantly to your registered bank account. 
                  Funds are processed immediately through Safaricom B2B API.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Transaction Costs</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Transaction fees are automatically calculated based on amount</p>
                <p>• Fees range from KES 2 to KES 115 depending on amount</p>
                <p>• Total deduction = Withdrawal amount + Transaction fee</p>
                <p>• You receive: Withdrawal amount - Transaction fee</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Transaction Status</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• <StatusBadge status="pending" />: Withdrawal initiated and being processed</p>
                <p>• <StatusBadge status="completed" />: Funds successfully transferred</p>
                <p>• <StatusBadge status="failed" />: Transaction declined</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowModal(null)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Got It
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Withdrawal Modal */}
      <Modal isOpen={showModal === "confirm"} onClose={() => setShowModal(null)} title="Confirm Withdrawal">
        <div className="space-y-6">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">Instant Withdrawal</h4>
                <p className="text-yellow-700 text-sm">
                  This withdrawal will be processed immediately through Safaricom B2B API.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Withdrawal Amount:</span>
              <span className="font-semibold text-gray-900">KES {parseFloat(withdrawAmount).toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Transaction Fee:</span>
              <span className="font-semibold text-red-600">- KES {getTransactionCost(parseFloat(withdrawAmount))}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-gray-900 font-semibold">Total Deduction:</span>
              <span className="font-semibold text-blue-700">
                KES {(parseFloat(withdrawAmount) + getTransactionCost(parseFloat(withdrawAmount))).toLocaleString()}
              </span>
            </div>

            {remarks && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-gray-600 text-sm">Remarks: </span>
                <span className="text-gray-900 text-sm">{remarks}</span>
              </div>
            )}

            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600 text-sm">Destination: </span>
              <span className="text-gray-900 text-sm">
                {walletData.accountDetails.bankName} - {walletData.accountDetails.accountNumber}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleWithdraw}
              disabled={isProcessing}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Confirm Withdrawal
                </>
              )}
            </button>
            <button
              onClick={() => setShowModal(null)}
              disabled={isProcessing}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={showModal === "success"} onClose={() => setShowModal(null)} title="Withdrawal Initiated">
        <div className="space-y-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Withdrawal Initiated Successfully!</h4>
                <p className="text-green-700 text-sm">
                  Your withdrawal request has been received and is being processed.
                </p>
              </div>
            </div>
          </div>

          {lastWithdrawal && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Reference:</span>
                <span className="font-semibold text-gray-900">{lastWithdrawal.reference}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">KES {lastWithdrawal.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Status:</span>
                <StatusBadge status={lastWithdrawal.status} />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setShowModal(null);
                fetchWalletData();
              }}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View Transactions
            </button>
            <button
              onClick={() => setShowModal(null)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={showModal === "transaction-details"}
        onClose={() => setShowModal(null)}
      />
    </>
  );
}

// Helper function for transaction cost (matching PHP logic)
function getTransactionCost(amount) {
  const tiers = [
    [1, 49, 2],
    [50, 100, 3],
    [101, 500, 8],
    [501, 1000, 13],
    [1001, 1500, 18],
    [1501, 2500, 25],
    [2501, 3500, 30],
    [3501, 5000, 39],
    [5001, 7500, 48],
    [7501, 10000, 54],
    [10001, 15000, 63],
    [15001, 20000, 68],
    [20001, 25000, 74],
    [25001, 30000, 79],
    [30001, 35000, 90],
    [35001, 40000, 106],
    [40001, 45000, 110],
    [45001, 50000, 115],
    [50001, 70000, 115],
    [70001, 150000, 115],
    [150001, 250000, 115],
    [250001, 500000, 115],
    [500001, 1000000, 115]
  ];
  
  for (const tier of tiers) {
    if (amount >= tier[0] && amount <= tier[1]) {
      return tier[2];
    }
  }
  return 115;
}