"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
  Package,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Download,
  Printer,
  ArrowUpDown,
  MoreVertical,
  CheckCircle,
  XCircle,
  PackageOpen,
  ShoppingBag,
  Tag,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  ShoppingCart,
  Upload,
  Calendar,
  Users,
  BarChart3,
  Hash,
  Star,
  Clock,
  Settings,
  ChevronDown,
  ChevronUp,
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
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Restock Modal
const RestockModal = ({ isOpen, onClose, product, onRestock }) => {
  const [quantity, setQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onRestock(product.id, parseInt(quantity) || 0);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restock Product">
      <form onSubmit={handleSubmit} className="space-y-6">
        {product && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {product.image && (
              <div className="w-12 h-12 rounded overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current Stock: {product.stock} units
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Restock Quantity *
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Enter quantity"
            min="1"
            required
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            New stock will be: {product ? product.stock + (parseInt(quantity) || 0) : 0} units
          </p>
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
                Restocking...
              </>
            ) : (
              <>
                <Package className="h-4 w-4" />
                Restock Product
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Filter Modal
const FilterModal = ({ isOpen, onClose, filters, onApply }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({
      threshold: "",
      category: "all",
      status: "all",
      sortBy: "stock",
      sortOrder: "asc",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Low Stock">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Low Stock Threshold
          </label>
          <input
            type="number"
            value={localFilters.threshold}
            onChange={(e) => setLocalFilters({ ...localFilters, threshold: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Show products below this stock"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={localFilters.category}
            onChange={(e) => setLocalFilters({ ...localFilters, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home & Garden</option>
            <option value="books">Books</option>
            <option value="sports">Sports</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stock Status
          </label>
          <select
            value={localFilters.status}
            onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="low">Low Stock</option>
            <option value="critical">Critical</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={localFilters.sortBy}
              onChange={(e) => setLocalFilters({ ...localFilters, sortBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="stock">Stock Level</option>
              <option value="name">Product Name</option>
              <option value="sales">Sales Rate</option>
              <option value="price">Price</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort Order
            </label>
            <select
              value={localFilters.sortOrder}
              onChange={(e) => setLocalFilters({ ...localFilters, sortOrder: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Action Dropdown
const ActionDropdown = ({ product, onView, onEdit, onRestock, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-50">
            <button
              onClick={() => {
                onView();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
            <button
              onClick={() => {
                onRestock();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
              <Package className="h-4 w-4" />
              Restock
            </button>
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Edit Product
            </button>
            <div className="border-t border-gray-200 dark:border-gray-800 my-1"></div>
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Product
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Table Skeleton
const TableSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
          <div className="w-20 h-6 bg-gray-300 dark:bg-gray-700 rounded ml-4"></div>
          <div className="w-24 h-6 bg-gray-300 dark:bg-gray-700 rounded ml-4"></div>
          <div className="w-16 h-6 bg-gray-300 dark:bg-gray-700 rounded ml-4"></div>
          <div className="w-32 h-6 bg-gray-300 dark:bg-gray-700 rounded ml-4"></div>
          <div className="w-8 h-6 bg-gray-300 dark:bg-gray-700 rounded ml-4"></div>
        </div>
      ))}
    </div>
  );
};

// Stats Skeleton
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

export default function LowStockPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    threshold: "",
    category: "all",
    status: "all",
    sortBy: "stock",
    sortOrder: "asc",
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });

  // Generate sample low stock products
  const generateProducts = () => {
    const categories = ["Electronics", "Fashion", "Home", "Books", "Sports"];
    const names = [
      "Smartphone X",
      "Laptop Pro",
      "Wireless Headphones",
      "Smart Watch",
      "Bluetooth Speaker",
      "Running Shoes",
      "T-Shirt Pack",
      "Coffee Maker",
      "Desk Lamp",
      "Fitness Tracker",
      "Backpack",
      "Water Bottle",
      "Notebook Set",
      "Pen Set",
      "Desk Organizer",
    ];

    return Array.from({ length: 15 }, (_, i) => {
      const category = categories[i % categories.length];
      const stock = Math.floor(Math.random() * 20) + 1; // 1-20 units
      const status = stock <= 5 ? "critical" : stock <= 10 ? "low" : "warning";
      const salesRate = Math.floor(Math.random() * 50) + 10; // 10-59 sales/month

      return {
        id: `prod_${i + 1}`,
        sku: `SKU${String(i + 1).padStart(4, "0")}`,
        name: names[i % names.length],
        category,
        stock,
        status,
        salesRate,
        price: Math.floor(Math.random() * 50000) + 5000, // 5000-54999 KES
        image: `https://picsum.photos/seed/lowstock${i}/200/200`,
        lastRestocked: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        reorderLevel: 10,
        supplier: ["Supplier A", "Supplier B", "Supplier C"][Math.floor(Math.random() * 3)],
      };
    });
  };

  useEffect(() => {
    const fetchProducts = () => {
      setIsLoading(true);
      setTimeout(() => {
        const data = generateProducts();
        setProducts(data);
        setIsLoading(false);
      }, 1500);
    };

    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.sku.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Threshold filter
    if (filters.threshold && product.stock > parseInt(filters.threshold)) {
      return false;
    }

    // Category filter
    if (filters.category !== "all" && product.category.toLowerCase() !== filters.category) {
      return false;
    }

    // Status filter
    if (filters.status !== "all") {
      if (filters.status === "low" && product.stock > 10) return false;
      if (filters.status === "critical" && product.stock > 5) return false;
      if (filters.status === "out" && product.stock > 0) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue = a[filters.sortBy];
    let bValue = b[filters.sortBy];

    if (filters.sortBy === "stock") {
      aValue = a.stock;
      bValue = b.stock;
    } else if (filters.sortBy === "sales") {
      aValue = a.salesRate;
      bValue = b.salesRate;
    } else if (filters.sortBy === "price") {
      aValue = a.price;
      bValue = b.price;
    }

    if (filters.sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Stats
  const criticalCount = products.filter(p => p.stock <= 5).length;
  const lowCount = products.filter(p => p.stock <= 10 && p.stock > 5).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalProducts = filteredProducts.length;

  // Get status color
  const getStatusColor = (stock) => {
    if (stock <= 5) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    if (stock <= 10) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  };

  const getStatusText = (stock) => {
    if (stock <= 5) return "Critical";
    if (stock <= 10) return "Low";
    return "Warning";
  };

  // Get status icon
  const getStatusIcon = (stock) => {
    if (stock <= 5) return <AlertCircle className="h-4 w-4" />;
    if (stock <= 10) return <AlertTriangle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  // Handle restock
  const handleRestock = (productId, quantity) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, stock: p.stock + quantity } : p
    ));
    showToast(`Restocked ${quantity} units`, "success");
  };

  // Handle delete
  const handleDelete = (product) => {
    if (confirm(`Delete "${product.name}"?`)) {
      setProducts(products.filter(p => p.id !== product.id));
      showToast("Product deleted", "success");
    }
  };

  // Handle bulk restock
  const handleBulkRestock = () => {
    if (selectedProducts.length === 0) {
      showToast("Select products first", "error");
      return;
    }

    const quantity = prompt("Enter restock quantity for all selected products:");
    if (quantity && !isNaN(parseInt(quantity))) {
      setProducts(products.map(p =>
        selectedProducts.includes(p.id) ? { ...p, stock: p.stock + parseInt(quantity) } : p
      ));
      showToast(`Restocked ${selectedProducts.length} products`, "success");
      setSelectedProducts([]);
    }
  };

  // Handle export
  const handleExport = () => {
    const csv = [
      ["SKU", "Name", "Category", "Stock", "Status", "Price", "Sales/Month", "Last Restocked"],
      ...sortedProducts.map(p => [
        p.sku,
        p.name,
        p.category,
        p.stock,
        getStatusText(p.stock),
        `KES ${p.price}`,
        p.salesRate,
        new Date(p.lastRestocked).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "low-stock-report.csv";
    a.click();
    showToast("Report exported", "success");
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
                  Low Stock
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor and manage products with low inventory
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          {isLoading ? (
            <StatsSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Critical Stock</p>
                    <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                      {criticalCount}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock</p>
                    <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                      {lowCount}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {totalProducts}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Inventory Value</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      KES {(totalValue / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
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
                    placeholder="Search products by name or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Bulk Actions */}
                {selectedProducts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {selectedProducts.length} selected
                    </span>
                    <button
                      onClick={handleBulkRestock}
                      className="px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50"
                    >
                      Bulk Restock
                    </button>
                    <button
                      onClick={() => setSelectedProducts([])}
                      className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <TableSkeleton />
              ) : sortedProducts.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left p-4 w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedProducts.length === sortedProducts.length &&
                            sortedProducts.length > 0
                          }
                          onChange={() => {
                            if (selectedProducts.length === sortedProducts.length) {
                              setSelectedProducts([]);
                            } else {
                              setSelectedProducts(sortedProducts.map(p => p.id));
                            }
                          }}
                          className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                        />
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Product
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Category
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Stock Level
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Sales/Month
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Price
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProducts.map((product) => {
                      const statusColor = getStatusColor(product.stock);
                      const statusText = getStatusText(product.stock);
                      const StatusIcon = getStatusIcon(product.stock);

                      return (
                        <tr
                          key={product.id}
                          className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => {
                                if (selectedProducts.includes(product.id)) {
                                  setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                                } else {
                                  setSelectedProducts([...selectedProducts, product.id]);
                                }
                              }}
                              className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 dark:text-white truncate">
                                  {product.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {product.sku}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-900 dark:text-white">
                              {product.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {product.stock} units
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Reorder at {product.reorderLevel}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                {StatusIcon}
                                {statusText}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {product.salesRate}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              last 30 days
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              KES {product.price.toLocaleString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <ActionDropdown
                              product={product}
                              onView={() => router.push(`/dashboard/products/${product.id}`)}
                              onEdit={() => router.push(`/dashboard/products/edit/${product.id}`)}
                              onRestock={() => {
                                setSelectedProduct(product);
                                setShowRestockModal(true);
                              }}
                              onDelete={() => handleDelete(product)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center">
                  <PackageOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 dark:text-white font-medium">No low stock products found</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {searchQuery || filters.threshold || filters.category !== "all" || filters.status !== "all"
                      ? "Try adjusting your search or filters"
                      : "All products have sufficient stock levels"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApply={setFilters}
      />

      {/* Restock Modal */}
      <RestockModal
        isOpen={showRestockModal}
        onClose={() => {
          setShowRestockModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onRestock={handleRestock}
      />
    </>
  );
}