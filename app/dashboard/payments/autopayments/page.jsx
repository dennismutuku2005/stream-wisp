"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Cookies from "js-cookie";
import {
    DollarSign,
    Wallet,
    Calendar,
    Clock,
    CheckCircle,
    X,
    AlertCircle,
    Info,
    Download,
    RotateCw,
    CreditCard,
    Plus,
    Trash2,
    Bell,
    Lock,
    Zap,
    Eye
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
        active: {
            bg: "bg-green-100",
            text: "text-green-800",
            icon: CheckCircle,
            label: "Active"
        },
        pending: {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            icon: Clock,
            label: "Pending"
        },
        cancelled: {
            bg: "bg-red-100",
            text: "text-red-800",
            icon: X,
            label: "Cancelled"
        },
        completed: {
            bg: "bg-blue-100",
            text: "text-blue-800",
            icon: CheckCircle,
            label: "Completed"
        }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            <IconComponent className="w-3 h-3 mr-1" />
            {config.label}
        </span>
    );
};

// Automated Payment Card Component
const AutomatedPaymentCard = ({ payment, onEdit, onDelete }) => {
    const getNextPaymentDate = () => {
        const today = new Date();
        const paymentDate = new Date(payment.nextPaymentDate);
        return paymentDate.toLocaleDateString();
    };

    const getDaysUntilPayment = () => {
        const today = new Date();
        const paymentDate = new Date(payment.nextPaymentDate);
        const diffTime = paymentDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysUntil = getDaysUntilPayment();

    return (
        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">{payment.name}</h3>
                        <StatusBadge status={payment.status} />
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Paybill: {payment.paybill} • Account: {payment.accountNumber}</p>
                    <p className="text-xs text-gray-500">Amount: KES {payment.amount.toLocaleString()} • {payment.frequency}</p>
                </div>
                <div className="flex space-x-1">
                    <button
                        onClick={() => onEdit(payment)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(payment)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-600">
                        Next: {getNextPaymentDate()}
                    </span>
                </div>
                <div className={`text-xs font-medium ${daysUntil <= 3 ? 'text-red-600' :
                        daysUntil <= 7 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                    {daysUntil === 0 ? 'Today' :
                        daysUntil === 1 ? 'Tomorrow' :
                            daysUntil < 0 ? 'Overdue' : `${daysUntil} days`}
                </div>
            </div>
        </div>
    );
};

export default function AutomatedPayment() {
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(null);
    const [userData, setUserData] = useState(null);
    const [walletData, setWalletData] = useState({
        availableBalance: 0,
        totalWithdrawn: 0,
        reservedForBills: 0
    });
    const [automatedPayments, setAutomatedPayments] = useState([]);
    const [editingPayment, setEditingPayment] = useState(null);
    const [paymentToDelete, setPaymentToDelete] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        paybill: "",
        accountNumber: "",
        amount: "",
        frequency: "monthly",
        nextPaymentDate: "",
        notificationPhone: "",
        description: ""
    });

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

    // Fetch wallet and payments data
    const fetchData = async () => {
        if (!userData?.user_id) return;

        setIsLoading(true);
        try {
            const response = await fetch(`https://api.onenetwork-system.com/pppoe/user/v1/automated-payments.php?user_id=${userData.user_id}`);
            const result = await response.json();

            if (result.success) {
                setWalletData(result.data.walletData);
                setAutomatedPayments(result.data.automatedPayments);
                if (!isLoading) {
                    showToast("Data loaded successfully!", "success");
                }
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            console.error('API Error:', err);
            showToast("Failed to load data. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userData?.user_id) {
            fetchData();
        }
    }, [userData]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            paybill: "",
            accountNumber: "",
            amount: "",
            frequency: "monthly",
            nextPaymentDate: "",
            notificationPhone: "",
            description: ""
        });
        setEditingPayment(null);
    };

    const handleCreatePayment = async () => {
        // Validation
        if (!formData.name || !formData.paybill || !formData.accountNumber || !formData.amount || !formData.nextPaymentDate) {
            showToast("Please fill in all required fields", "error");
            return;
        }

        if (parseFloat(formData.amount) < 10) {
            showToast("Minimum amount is KES 10", "error");
            return;
        }

        const totalReserved = automatedPayments
            .filter(p => p.status === 'active')
            .reduce((sum, p) => sum + p.amount, 0) + parseFloat(formData.amount);

        if (totalReserved > walletData.availableBalance) {
            showToast("Insufficient balance for this automated payment", "error");
            return;
        }

        try {
            const payload = {
                user_id: userData.user_id,
                action: editingPayment ? 'update' : 'create',
                name: formData.name,
                paybill: formData.paybill,
                accountNumber: formData.accountNumber,
                amount: parseFloat(formData.amount),
                frequency: formData.frequency,
                nextPaymentDate: formData.nextPaymentDate,
                notificationPhone: formData.notificationPhone,
                description: formData.description
            };

            if (editingPayment) {
                payload.payment_id = editingPayment.id;
            }

            const response = await fetch('https://api.onenetwork-system.com/pppoe/user/v1/automated-payments.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                showToast(
                    editingPayment ? "Automated payment updated successfully!" : "Automated payment created successfully!",
                    "success"
                );
                setShowModal(null);
                resetForm();
                fetchData(); // Refresh data
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            console.error('API Error:', err);
            showToast(err.message, "error");
        }
    };

    const handleEditPayment = (payment) => {
        setEditingPayment(payment);
        setFormData({
            name: payment.name,
            paybill: payment.paybill,
            accountNumber: payment.accountNumber,
            amount: payment.amount.toString(),
            frequency: payment.frequency,
            nextPaymentDate: payment.nextPaymentDate,
            notificationPhone: payment.notificationPhone,
            description: payment.description || ""
        });
        setShowModal("create");
    };

    const handleDeletePayment = (payment) => {
        setPaymentToDelete(payment);
        setShowModal("confirm-delete");
    };

    const confirmDeletePayment = async () => {
        try {
            const response = await fetch('https://api.onenetwork-system.com/pppoe/user/v1/automated-payments.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userData.user_id,
                    action: 'delete',
                    payment_id: paymentToDelete.id
                })
            });

            const result = await response.json();

            if (result.success) {
                showToast("Automated payment deleted successfully!", "success");
                setPaymentToDelete(null);
                setShowModal(null);
                fetchData(); // Refresh data
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            console.error('API Error:', err);
            showToast(err.message, "error");
        }
    };

    const totalReservedAmount = automatedPayments
        .filter(p => p.status === 'active')
        .reduce((sum, p) => sum + p.amount, 0);

    const availableForWithdrawal = walletData.availableBalance - totalReservedAmount;

    // Get first 4 payments for the sidebar
    const firstFourPayments = automatedPayments.slice(0, 4);

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
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Automated Payments</h1>
                            <p className="text-gray-500 mt-2 text-sm lg:text-base">
                                Schedule automatic bill payments and manage your recurring expenses
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowModal("learn")}
                                className="flex items-center px-3 lg:px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Info className="h-4 w-4 mr-2 text-gray-600" />
                                <span className="text-sm text-gray-700">How It Works</span>
                            </button>
                            <button
                                onClick={fetchData}
                                disabled={isLoading}
                                className="flex items-center px-3 lg:px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                <RotateCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                <span className="text-sm">Refresh</span>
                            </button>
                        </div>
                    </div>

                    {/* Wallet Overview Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                            <p className="text-blue-100 text-xs lg:text-sm">Total wallet balance</p>
                        </div>

                        {/* Reserved for Bills */}
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3 lg:mb-4">
                                <Lock className="h-6 w-6 lg:h-8 lg:w-8 opacity-90" />
                                <div className="text-right">
                                    <div className="text-orange-100 text-xs lg:text-sm">Reserved for Bills</div>
                                    <div className="text-xl lg:text-2xl font-bold">
                                        {isLoading ? (
                                            <div className="h-6 lg:h-8 w-20 lg:w-24 bg-orange-400 rounded animate-pulse"></div>
                                        ) : (
                                            `KES ${totalReservedAmount.toLocaleString()}`
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className="text-orange-100 text-xs lg:text-sm">For automated payments</p>
                        </div>

                        {/* Available for Withdrawal */}
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-3 lg:mb-4">
                                <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 opacity-90" />
                                <div className="text-right">
                                    <div className="text-green-100 text-xs lg:text-sm">Available to Withdraw</div>
                                    <div className="text-xl lg:text-2xl font-bold">
                                        {isLoading ? (
                                            <div className="h-6 lg:h-8 w-20 lg:w-24 bg-green-400 rounded animate-pulse"></div>
                                        ) : (
                                            `KES ${availableForWithdrawal.toLocaleString()}`
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className="text-green-100 text-xs lg:text-sm">After bill reservations</p>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column - Create Payment & Active Payments */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Create New Payment Card */}
                            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4 lg:mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Create Auto Payment</h3>
                                    <button
                                        onClick={() => setShowModal("create")}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        <span className="text-sm">New</span>
                                    </button>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-start space-x-3">
                                        <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-blue-900 mb-1">Automated Bill Payments</h4>
                                            <p className="text-blue-700 text-sm">
                                                Schedule recurring payments for your bills. Funds will be automatically reserved and paid on the specified dates.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Active Payments */}
                            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4 lg:mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Your Automated Payments</h3>
                                    <span className="text-sm text-gray-500">
                                        {automatedPayments.filter(p => p.status === 'active').length} active
                                    </span>
                                </div>

                                {isLoading ? (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : automatedPayments.length > 0 ? (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {automatedPayments.map((payment) => (
                                            <AutomatedPaymentCard
                                                key={payment.id}
                                                payment={payment}
                                                onEdit={handleEditPayment}
                                                onDelete={handleDeletePayment}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 lg:py-12 text-gray-500">
                                        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p className="font-medium text-sm lg:text-base">No automated payments</p>
                                        <p className="text-xs lg:text-sm mt-1">Create your first automated payment to get started</p>
                                        <button
                                            onClick={() => setShowModal("create")}
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            Create Payment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Info & Recent Activity */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Recent Bills */}
                            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Bills</h3>
                                    {automatedPayments.length > 4 && (
                                        <button
                                            onClick={() => setShowModal("all-bills")}
                                            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View All
                                        </button>
                                    )}
                                </div>

                                {isLoading ? (
                                    <div className="space-y-3">
                                        {[...Array(4)].map((_, i) => (
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
                                ) : firstFourPayments.length > 0 ? (
                                    <div className="space-y-3">
                                        {firstFourPayments.map((payment) => {
                                            const paymentDate = new Date(payment.nextPaymentDate);
                                            const today = new Date();
                                            const diffTime = paymentDate - today;
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                            return (
                                                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${payment.status === 'active' ? 'bg-green-100' : 'bg-yellow-100'
                                                            }`}>
                                                            <Calendar className={`h-4 w-4 ${payment.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                                                                }`} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{payment.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {paymentDate.toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            KES {payment.amount.toLocaleString()}
                                                        </p>
                                                        <div className={`text-xs font-medium ${diffDays <= 3 ? 'text-red-600' : 'text-green-600'
                                                            }`}>
                                                            {diffDays}d
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">No bills scheduled</p>
                                )}
                            </div>

                            {/* Important Notice */}
                            <div className="bg-orange-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-orange-200">
                                <div className="flex items-start space-x-3">
                                    <Lock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-orange-900 mb-2">Funds Reservation</h4>
                                        <p className="text-orange-700 text-sm">
                                            When you create an automated payment, the amount is immediately reserved in your wallet.
                                            You won't be able to withdraw reserved funds until the payment is completed or cancelled.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>

            {/* Create/Edit Payment Modal */}
            <Modal isOpen={showModal === "create"} onClose={() => { setShowModal(null); resetForm(); }} title={editingPayment ? "Edit Payment" : "Create Payment"} size="lg">
                <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Internet Bill, Rent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount (KES) *
                            </label>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => handleInputChange('amount', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0.00"
                                min="10"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Paybill Number *
                            </label>
                            <input
                                type="text"
                                value={formData.paybill}
                                onChange={(e) => handleInputChange('paybill', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 123456"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Number *
                            </label>
                            <input
                                type="text"
                                value={formData.accountNumber}
                                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., ACC001"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Frequency
                            </label>
                            <select
                                value={formData.frequency}
                                onChange={(e) => handleInputChange('frequency', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="weekly">Weekly</option>
                                <option value="daily">Daily</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Next Payment Date *
                            </label>
                            <input
                                type="date"
                                value={formData.nextPaymentDate}
                                onChange={(e) => handleInputChange('nextPaymentDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notification Phone Number
                        </label>
                        <input
                            type="tel"
                            value={formData.notificationPhone}
                            onChange={(e) => handleInputChange('notificationPhone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="+254712345678"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            We'll send SMS notifications before and after each payment
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Add any additional details about this payment..."
                        />
                    </div>

                    {/* Funds Reservation Notice */}
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-start space-x-3">
                            <Lock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-orange-900 mb-1">Funds Reservation Notice</h4>
                                <p className="text-orange-700 text-sm">
                                    KES {formData.amount || '0'} will be immediately reserved in your wallet.
                                    This amount won't be available for withdrawal until the payment is processed or cancelled.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleCreatePayment}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            {editingPayment ? 'Update Payment' : 'Create Payment'}
                        </button>
                        <button
                            onClick={() => { setShowModal(null); resetForm(); }}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={showModal === "confirm-delete"} onClose={() => { setShowModal(null); setPaymentToDelete(null); }} title="Confirm Delete" size="sm">
                <div className="space-y-6">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-red-900 mb-1">Delete Automated Payment</h4>
                                <p className="text-red-700 text-sm">
                                    Are you sure you want to delete "{paymentToDelete?.name}"? This action cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={confirmDeletePayment}
                            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Delete Payment
                        </button>
                        <button
                            onClick={() => { setShowModal(null); setPaymentToDelete(null); }}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* All Bills Modal */}
            <Modal isOpen={showModal === "all-bills"} onClose={() => setShowModal(null)} title="All Automated Bills" size="lg">
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start space-x-3">
                            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-blue-700 text-sm">
                                    Showing all {automatedPayments.length} automated bills. You can manage each payment from the main page.
                                </p>
                            </div>
                        </div>
                    </div>

                    {automatedPayments.map((payment) => {
                        const paymentDate = new Date(payment.nextPaymentDate);
                        const today = new Date();
                        const diffTime = paymentDate - today;
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        return (
                            <div key={payment.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                <div className="flex items-center space-x-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${payment.status === 'active' ? 'bg-green-100' : 'bg-yellow-100'
                                        }`}>
                                        <Calendar className={`h-5 w-5 ${payment.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                                            }`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <p className="font-semibold text-gray-900">{payment.name}</p>
                                            <StatusBadge status={payment.status} />
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Paybill: {payment.paybill} • Account: {payment.accountNumber}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {paymentDate.toLocaleDateString()} • {payment.frequency}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">
                                        KES {payment.amount.toLocaleString()}
                                    </p>
                                    <div className={`text-sm font-medium ${diffDays <= 3 ? 'text-red-600' :
                                        diffDays <= 7 ? 'text-orange-600' : 'text-green-600'
                                        }`}>
                                        {diffDays === 0 ? 'Today' :
                                            diffDays === 1 ? 'Tomorrow' :
                                                diffDays < 0 ? 'Overdue' : `${diffDays} days`}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Modal>

            {/* How It Works Modal */}
            <Modal isOpen={showModal === "learn"} onClose={() => setShowModal(null)} title="How Automated Payments Work" size="lg">
                <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start space-x-3">
                            <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-2">Automated Bill Payments</h4>
                                <p className="text-blue-700 text-sm">
                                    Set up recurring payments for your bills and let the system handle the rest.
                                    Never miss a payment deadline again!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• <span className="font-medium">Automatic Deductions:</span> Payments are made automatically on scheduled dates</p>
                                <p>• <span className="font-medium">Funds Reservation:</span> Required amounts are reserved in your wallet</p>
                                <p>• <span className="font-medium">SMS Notifications:</span> Get alerts before and after each payment</p>
                                <p>• <span className="font-medium">Multiple Payments:</span> Set up as many automated payments as you need</p>
                                <p>• <span className="font-medium">Security:</span> Funds are safe until payment processing</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Funds Reservation System</h4>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• When you create an automated payment, the amount is immediately reserved</p>
                                <p>• Reserved funds are deducted from your available withdrawal balance</p>
                                <p>• This ensures funds are available when payment dates arrive</p>
                                <p>• You can cancel any payment to free up reserved funds</p>
                                <p>• Failed payments automatically free up the reserved amount</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Payment Process</h4>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>1. Set up payment details and schedule</p>
                                <p>2. Funds are reserved in your wallet immediately</p>
                                <p>3. Receive SMS notification 24 hours before payment</p>
                                <p>4. System processes payment automatically on due date</p>
                                <p>5. Receive confirmation SMS after successful payment</p>
                                <p>6. Reserved funds are released after payment completion</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Important Notes</h4>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• Minimum payment amount: KES 10</p>
                                <p>• Ensure sufficient balance before payment dates</p>
                                <p>• You can edit or cancel payments anytime</p>
                                <p>• Failed payments due to insufficient funds will be retried</p>
                                <p>• Contact support for any payment issues</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => setShowModal("create")}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            First Payment
                        </button>
                        <button
                            onClick={() => setShowModal(null)}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Got It
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}