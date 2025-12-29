"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Cookies from "js-cookie";
import {
  Plus,
  Trash2,
  Edit,
  FileText,
  Calendar,
  DollarSign,
  X,
  CheckCircle,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
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
        className={`relative bg-white rounded-lg shadow-xl transform transition-all duration-300 p-6 w-full max-h-[90vh] overflow-y-auto ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
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

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
        <p className="text-gray-600 text-sm">{message}</p>
        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Expense Form Component
const ExpenseForm = ({ expense, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    ...expense
  });

  const categories = [
    "Office Supplies",
    "Utilities",
    "Salaries",
    "Marketing",
    "Software",
    "Hardware",
    "Internet",
    "Maintenance",
    "Travel",
    "Food & Beverages",
    "Other"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      date: formData.date // Keep as string, API will handle date formatting
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Expense title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES) *</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Additional details..."
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          {isEditing ? 'Update' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

// Mobile Expense Card Component
const MobileExpenseCard = ({ expense, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-sm">{expense.title}</h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {expense.category}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">
                KES {parseFloat(expense.amount).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(expense.date)}
              </p>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                </svg>
              </button>

              {showActions && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                  <button
                    onClick={() => {
                      setShowActions(false);
                      onEdit(expense);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowActions(false);
                      onDelete(expense);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {expense.description && (
            <p className="text-xs text-gray-600 mt-2">{expense.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Desktop Table Component
const ExpensesTable = ({ expenses, onEdit, onDelete, isLoading }) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (sortField === 'amount') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="h-3 w-3 opacity-30" />;
    return sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  if (isLoading) {
    return (
      <div className="border border-gray-300 rounded overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-300">
              <th className="text-left p-3 font-medium text-gray-700 border-r border-gray-300">Title</th>
              <th className="text-left p-3 font-medium text-gray-700 border-r border-gray-300">Amount</th>
              <th className="text-left p-3 font-medium text-gray-700 border-r border-gray-300">Category</th>
              <th className="text-left p-3 font-medium text-gray-700 border-r border-gray-300">Date</th>
              <th className="text-left p-3 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-gray-200 animate-pulse">
                <td className="p-3 border-r border-gray-200">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                </td>
                <td className="p-3 border-r border-gray-200">
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </td>
                <td className="p-3 border-r border-gray-200">
                  <div className="h-4 bg-gray-100 rounded w-20"></div>
                </td>
                <td className="p-3 border-r border-gray-200">
                  <div className="h-4 bg-gray-100 rounded w-24"></div>
                </td>
                <td className="p-3">
                  <div className="h-6 bg-gray-100 rounded w-12"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded bg-white overflow-x-auto">
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-300">
            <th 
              className="text-left p-3 font-medium text-gray-700 border-r border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('title')}
            >
              <div className="flex items-center gap-1">
                Title
                <SortIcon field="title" />
              </div>
            </th>
            <th 
              className="text-left p-3 font-medium text-gray-700 border-r border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('amount')}
            >
              <div className="flex items-center gap-1">
                Amount (KES)
                <SortIcon field="amount" />
              </div>
            </th>
            <th 
              className="text-left p-3 font-medium text-gray-700 border-r border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('category')}
            >
              <div className="flex items-center gap-1">
                Category
                <SortIcon field="category" />
              </div>
            </th>
            <th 
              className="text-left p-3 font-medium text-gray-700 border-r border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('date')}
            >
              <div className="flex items-center gap-1">
                Date
                <SortIcon field="date" />
              </div>
            </th>
            <th className="text-left p-3 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedExpenses.map((expense, index) => (
            <tr 
              key={expense.id} 
              className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <td className="p-3 border-r border-gray-200">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{expense.title}</span>
                  {expense.description && (
                    <span className="text-xs text-gray-500 mt-1">
                      {expense.description}
                    </span>
                  )}
                </div>
              </td>
              <td className="p-3 border-r border-gray-200 font-mono text-gray-900 font-semibold">
                {parseFloat(expense.amount).toLocaleString()}
              </td>
              <td className="p-3 border-r border-gray-200">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {expense.category}
                </span>
              </td>
              <td className="p-3 border-r border-gray-200 text-gray-600">
                {formatDate(expense.date)}
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Edit expense"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(expense)}
                    className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        {expenses.length > 0 && (
          <tfoot>
            <tr className="bg-gray-100 border-t border-gray-300">
              <td className="p-3 border-r border-gray-200 font-medium text-gray-900">Total</td>
              <td className="p-3 border-r border-gray-200 font-mono font-bold text-gray-900">
                {expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0).toLocaleString()}
              </td>
              <td className="p-3 border-r border-gray-200"></td>
              <td className="p-3 border-r border-gray-200"></td>
              <td className="p-3"></td>
            </tr>
          </tfoot>
        )}
      </table>
      
      {expenses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No expenses found</p>
          <p className="text-sm mt-1">Add your first expense to get started</p>
        </div>
      )}
    </div>
  );
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userData, setUserData] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [stats, setStats] = useState({
    current_month: { expense_count: 0, total_amount: 0, average_amount: 0, largest_expense: 0 },
    previous_month: { expense_count: 0, total_amount: 0 },
    change_percentage: 0,
    categories: []
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
    }, 4000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/expenses.php`;

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

  // API Functions
  const fetchExpenses = async () => {
    if (!userData?.user_id) return;

    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_expenses',
          user_id: userData.user_id,
          month: selectedMonth,
          category: selectedCategory,
          search: searchTerm
        })
      });

      const data = await response.json();

      if (data.success) {
        setExpenses(data.data.expenses);
        setFilteredExpenses(data.data.expenses);
      } else {
        showToast(data.message || 'Failed to fetch expenses', 'error');
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!userData?.user_id) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_stats',
          user_id: userData.user_id,
          month: selectedMonth
        })
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const addExpense = async (expenseData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_expense',
          user_id: userData.user_id,
          ...expenseData
        })
      });

      const data = await response.json();

      if (data.success) {
        showToast(data.message, 'success');
        fetchExpenses();
        fetchStats();
        return true;
      } else {
        showToast(data.message || 'Failed to add expense', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      showToast('Network error. Please try again.', 'error');
      return false;
    }
  };

  const updateExpense = async (expenseData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_expense',
          user_id: userData.user_id,
          expense_id: selectedExpense.id,
          ...expenseData
        })
      });

      const data = await response.json();

      if (data.success) {
        showToast(data.message, 'success');
        fetchExpenses();
        fetchStats();
        return true;
      } else {
        showToast(data.message || 'Failed to update expense', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      showToast('Network error. Please try again.', 'error');
      return false;
    }
  };

  const deleteExpense = async (expense) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete_expense',
          user_id: userData.user_id,
          expense_id: expense.id
        })
      });

      const data = await response.json();

      if (data.success) {
        showToast(data.message, 'success');
        fetchExpenses();
        fetchStats();
        return true;
      } else {
        showToast(data.message || 'Failed to delete expense', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      showToast('Network error. Please try again.', 'error');
      return false;
    }
  };

  // Load data when component mounts or filters change
  useEffect(() => {
    if (userData?.user_id) {
      fetchExpenses();
      fetchStats();
    }
  }, [userData, selectedMonth, selectedCategory, searchTerm]);

  // Expense handlers
  const handleAddExpense = async (expenseData) => {
    const success = await addExpense(expenseData);
    if (success) {
      setShowModal(null);
    }
  };

  const handleEditExpense = async (expenseData) => {
    const success = await updateExpense(expenseData);
    if (success) {
      setShowModal(null);
      setSelectedExpense(null);
    }
  };

  const handleDeleteExpense = async (expense) => {
    const success = await deleteExpense(expense);
    if (success) {
      setShowModal(null);
    }
  };

  const openEditModal = (expense) => {
    setSelectedExpense(expense);
    setShowModal('edit');
  };

  const openDeleteModal = (expense) => {
    setSelectedExpense(expense);
    setShowModal('delete');
  };

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

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
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading expenses...</p>
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
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Header Section */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Expenses</h1>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              
              {/* Add Expense Button - Always visible */}
              <button
                onClick={() => setShowModal('add')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                Add New Expense
              </button>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total This Month</p>
                <p className="text-2xl font-bold mt-1">
                  KES {stats.current_month.total_amount?.toLocaleString() || '0'}
                </p>
                <p className="text-blue-100 text-xs mt-1">
                  {stats.current_month.expense_count || 0} expense{stats.current_month.expense_count !== 1 ? 's' : ''}
                  {stats.change_percentage !== 0 && (
                    <span className={`ml-2 ${stats.change_percentage > 0 ? 'text-red-200' : 'text-green-200'}`}>
                      {stats.change_percentage > 0 ? '↑' : '↓'} {Math.abs(stats.change_percentage)}%
                    </span>
                  )}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                <Filter className="h-4 w-4" />
                {showMobileFilters ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className={`space-y-3 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Month Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Search and Category Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search expenses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {stats.categories.map((cat, index) => (
                      <option key={index} value={cat.category}>{cat.category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses List - Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-100 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                </div>
              ))
            ) : filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <MobileExpenseCard
                  key={expense.id}
                  expense={expense}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No expenses found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
                <button
                  onClick={() => setShowModal('add')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Add First Expense
                </button>
              </div>
            )}
          </div>

          {/* Expenses Table - Desktop */}
          <div className="hidden lg:block">
            <ExpensesTable
              expenses={filteredExpenses}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              isLoading={isLoading}
            />
          </div>
        </div>
      </DashboardLayout>

      {/* Add Expense Modal */}
      <Modal isOpen={showModal === 'add'} onClose={() => setShowModal(null)} title="Add New Expense">
        <ExpenseForm
          onSubmit={handleAddExpense}
          onCancel={() => setShowModal(null)}
        />
      </Modal>

      {/* Edit Expense Modal */}
      <Modal isOpen={showModal === 'edit'} onClose={() => setShowModal(null)} title="Edit Expense">
        <ExpenseForm
          expense={selectedExpense}
          onSubmit={handleEditExpense}
          onCancel={() => setShowModal(null)}
          isEditing={true}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showModal === 'delete'}
        onClose={() => setShowModal(null)}
        onConfirm={() => handleDeleteExpense(selectedExpense)}
        title="Delete Expense"
        message={`Are you sure you want to delete "${selectedExpense?.title}"?`}
      />
    </>
  );
}