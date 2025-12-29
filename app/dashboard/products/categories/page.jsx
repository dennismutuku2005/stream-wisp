"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Search,
  X,
  Eye,
  Layers,
  Tag,
  FolderOpen,
  ArrowUpDown,
  RefreshCw,
  FolderClosed,
  BarChart3,
  Home,
  Save,
  AlertCircle,
  CheckCircle,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CustomToast from "@/components/customtoast";

// Skeleton Loading Components
const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
      <div className="relative aspect-square bg-gray-200 dark:bg-gray-800"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2 w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded mb-3 w-full"></div>
        <div className="flex items-center justify-between">
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="flex gap-1">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonTableRow = () => {
  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-800 flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
          <div className="flex gap-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/6"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/6"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const SkeletonStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
            </div>
            <div className="p-2 bg-gray-200 dark:bg-gray-800 rounded-lg">
              <div className="h-6 w-6"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Image Upload Component
const ImageUpload = ({ image, onImageChange, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (!imageFile) return;

    const newImage = {
      id: Math.random().toString(36).substr(2, 9),
      file: imageFile,
      preview: URL.createObjectURL(imageFile),
    };

    onImageChange(newImage);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Category Image
      </label>
      
      {image ? (
        <div className="relative">
          <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <Image
              src={image.preview}
              alt="Category preview"
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('category-image-upload')?.click()}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragging 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
            }
          `}
        >
          <input
            id="category-image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800">
              <Upload className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Drop image here or click to upload
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Recommended: 400×400 pixels
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
        className={`relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl transform transition-all duration-300 p-6 w-full max-h-[90vh] overflow-y-auto ${sizeClasses[size]}`}
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

// Category/Subcategory Form Component
const CategoryForm = ({ 
  mode = "create", 
  category = null, 
  parentCategories = [],
  onSubmit, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "",
    isActive: true,
    sortOrder: 0,
  });

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        parentId: category.parentId || "",
        isActive: category.isActive !== false,
        sortOrder: category.sortOrder || 0,
      });
      
      if (category.image) {
        setImage({
          id: category.id,
          preview: category.image,
        });
      }
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onSubmit({
        ...formData,
        image: image?.preview || null,
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleImageChange = (newImage) => {
    setImage(newImage);
  };

  const handleImageRemove = () => {
    if (image?.preview && image.preview.startsWith('blob:')) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter category name"
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
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter category description"
            />
          </div>

          {parentCategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Parent Category
              </label>
              <select
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">No parent (Main Category)</option>
                {parentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort Order
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 dark:border-gray-700 text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
            </label>
          </div>
        </div>

        <div>
          <ImageUpload
            image={image}
            onImageChange={handleImageChange}
            onRemove={handleImageRemove}
          />
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p className="font-medium mb-1">Image Guidelines:</p>
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Use square images (1:1 ratio)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Minimum size: 400×400 pixels</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Max file size: 5MB</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Formats: JPG, PNG, WebP</span>
              </li>
            </ul>
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
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Updating..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {mode === "create" ? "Create Category" : "Update Category"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default function CategoriesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("all"); // all, main, sub
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Toast
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });

  // Generate sample data with images
  const generateCategories = () => {
    const mainCategories = [
      { 
        id: "electronics", 
        name: "Electronics", 
        description: "Electronic devices and accessories", 
        productCount: 156, 
        sortOrder: 1, 
        isActive: true,
        image: "https://picsum.photos/seed/electronics/400/400"
      },
      { 
        id: "fashion", 
        name: "Fashion", 
        description: "Clothing and fashion accessories", 
        productCount: 234, 
        sortOrder: 2, 
        isActive: true,
        image: "https://picsum.photos/seed/fashion/400/400"
      },
      { 
        id: "home", 
        name: "Home & Garden", 
        description: "Home decor and garden supplies", 
        productCount: 189, 
        sortOrder: 3, 
        isActive: true,
        image: "https://picsum.photos/seed/home/400/400"
      },
      { 
        id: "books", 
        name: "Books", 
        description: "Books and educational materials", 
        productCount: 78, 
        sortOrder: 4, 
        isActive: true,
        image: "https://picsum.photos/seed/books/400/400"
      },
      { 
        id: "sports", 
        name: "Sports", 
        description: "Sports equipment and accessories", 
        productCount: 92, 
        sortOrder: 5, 
        isActive: true,
        image: "https://picsum.photos/seed/sports/400/400"
      },
      { 
        id: "beauty", 
        name: "Beauty", 
        description: "Beauty and personal care products", 
        productCount: 145, 
        sortOrder: 6, 
        isActive: true,
        image: "https://picsum.photos/seed/beauty/400/400"
      },
    ];

    const subcategories = [
      { 
        id: "mobiles", 
        name: "Mobile Phones", 
        parentId: "electronics", 
        description: "Smartphones and mobile devices", 
        productCount: 45, 
        sortOrder: 1, 
        isActive: true,
        image: "https://picsum.photos/seed/mobiles/400/400"
      },
      { 
        id: "laptops", 
        name: "Laptops", 
        parentId: "electronics", 
        description: "Laptops and notebooks", 
        productCount: 32, 
        sortOrder: 2, 
        isActive: true,
        image: "https://picsum.photos/seed/laptops/400/400"
      },
      { 
        id: "audio", 
        name: "Audio", 
        parentId: "electronics", 
        description: "Headphones and speakers", 
        productCount: 28, 
        sortOrder: 3, 
        isActive: true,
        image: "https://picsum.photos/seed/audio/400/400"
      },
      { 
        id: "mens", 
        name: "Men's Fashion", 
        parentId: "fashion", 
        description: "Clothing for men", 
        productCount: 89, 
        sortOrder: 1, 
        isActive: true,
        image: "https://picsum.photos/seed/mens/400/400"
      },
      { 
        id: "womens", 
        name: "Women's Fashion", 
        parentId: "fashion", 
        description: "Clothing for women", 
        productCount: 112, 
        sortOrder: 2, 
        isActive: true,
        image: "https://picsum.photos/seed/womens/400/400"
      },
      { 
        id: "furniture", 
        name: "Furniture", 
        parentId: "home", 
        description: "Home furniture", 
        productCount: 67, 
        sortOrder: 1, 
        isActive: true,
        image: "https://picsum.photos/seed/furniture/400/400"
      },
      { 
        id: "decor", 
        name: "Home Decor", 
        parentId: "home", 
        description: "Home decoration items", 
        productCount: 54, 
        sortOrder: 2, 
        isActive: true,
        image: "https://picsum.photos/seed/decor/400/400"
      },
      { 
        id: "fitness", 
        name: "Fitness", 
        parentId: "sports", 
        description: "Fitness equipment", 
        productCount: 45, 
        sortOrder: 1, 
        isActive: true,
        image: "https://picsum.photos/seed/fitness/400/400"
      },
      { 
        id: "skincare", 
        name: "Skincare", 
        parentId: "beauty", 
        description: "Skincare products", 
        productCount: 68, 
        sortOrder: 1, 
        isActive: true,
        image: "https://picsum.photos/seed/skincare/400/400"
      },
    ];

    return [...mainCategories, ...subcategories];
  };

  useEffect(() => {
    const fetchCategories = () => {
      setIsLoading(true);
      setTimeout(() => {
        const data = generateCategories();
        setCategories(data);
        setIsLoading(false);
      }, 1000);
    };

    fetchCategories();
  }, []);

  // Filter categories based on active view
  const filteredCategories = categories.filter((cat) => {
    if (activeView === "main") return !cat.parentId;
    if (activeView === "sub") return cat.parentId;
    return true;
  }).filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === "productCount") {
      aValue = a.productCount || 0;
      bValue = b.productCount || 0;
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Get main categories for parent selection
  const mainCategories = categories.filter(cat => !cat.parentId);

  // Handle create category
  const handleCreateCategory = (formData) => {
    const newCategory = {
      id: `cat_${Date.now()}`,
      ...formData,
      productCount: 0,
    };
    setCategories([newCategory, ...categories]);
    setShowCreateModal(false);
    showToast("Category created successfully", "success");
  };

  // Handle edit category
  const handleEditCategory = (formData) => {
    setCategories(categories.map(cat => 
      cat.id === selectedCategory.id ? { ...cat, ...formData } : cat
    ));
    setShowEditModal(false);
    setSelectedCategory(null);
    showToast("Category updated successfully", "success");
  };

  // Handle delete category
  const handleDeleteCategory = (category) => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      // Check if category has products
      if (category.productCount > 0) {
        showToast(`Cannot delete category with ${category.productCount} products`, "error");
        return;
      }

      setCategories(categories.filter(cat => cat.id !== category.id));
      showToast("Category deleted successfully", "success");
    }
  };

  // Handle view category
  const handleViewCategory = (category) => {
    // Navigate to products page filtered by this category
    router.push(`/dashboard/products?category=${category.id}`);
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

  // Stats calculation
  const totalCategories = categories.length;
  const mainCategoriesCount = categories.filter(cat => !cat.parentId).length;
  const subcategoriesCount = categories.filter(cat => cat.parentId).length;

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
                  Categories
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Manage product categories and subcategories with images
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </button>
          </div>

          {/* Stats Cards */}
          {isLoading ? (
            <SkeletonStats />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Categories</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {totalCategories}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FolderTree className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Main Categories</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {mainCategoriesCount}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FolderOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Subcategories</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {subcategoriesCount}
                    </p>
                  </div>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FolderClosed className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 mb-6">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search categories by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Category Type Toggle */}
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setActiveView("all")}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      activeView === "all"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveView("main")}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      activeView === "main"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Main
                  </button>
                  <button
                    onClick={() => setActiveView("sub")}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      activeView === "sub"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Sub
                  </button>
                </div>
              </div>
            </div>

            {/* Categories Display - Table View Only */}
            <div className="p-4">
              {isLoading ? (
                <div className="space-y-0">
                  {[...Array(5)].map((_, index) => (
                    <SkeletonTableRow key={index} />
                  ))}
                </div>
              ) : sortedCategories.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  <div className="hidden md:grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
                    <div className="col-span-4">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"
                      >
                        Category Name
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="col-span-3">
                      <button
                        onClick={() => handleSort("productCount")}
                        className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"
                      >
                        Products
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="col-span-2">
                      <button
                        onClick={() => handleSort("sortOrder")}
                        className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"
                      >
                        Order
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-1 text-right">Actions</div>
                  </div>
                  {sortedCategories.map((category) => {
                    const isMainCategory = !category.parentId;
                    return (
                      <div
                        key={category.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center">
                          {/* Category Name & Image - Mobile/Tablet */}
                          <div className="md:hidden flex items-center gap-4 mb-3">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                              {category.image ? (
                                <Image
                                  src={category.image}
                                  alt={category.name}
                                  width={64}
                                  height={64}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  {isMainCategory ? (
                                    <FolderOpen className="h-6 w-6 text-gray-400" />
                                  ) : (
                                    <FolderClosed className="h-6 w-6 text-gray-400" />
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {category.name}
                                </h4>
                                {!category.isActive && (
                                  <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                {category.description || "No description"}
                              </p>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:flex md:col-span-4 md:items-center md:gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                              {category.image ? (
                                <Image
                                  src={category.image}
                                  alt={category.name}
                                  width={48}
                                  height={48}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  {isMainCategory ? (
                                    <FolderOpen className="h-5 w-5 text-gray-400" />
                                  ) : (
                                    <FolderClosed className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {category.name}
                                </h4>
                                {!category.isActive && (
                                  <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                {category.description || "No description"}
                              </p>
                            </div>
                          </div>

                          <div className="hidden md:block md:col-span-3">
                            <div className="text-gray-900 dark:text-white font-medium">
                              {category.productCount || 0}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              products
                            </div>
                          </div>

                          <div className="hidden md:block md:col-span-2">
                            <div className="text-gray-900 dark:text-white font-medium">
                              {category.sortOrder}
                            </div>
                          </div>

                          <div className="hidden md:block md:col-span-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              isMainCategory 
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                            }`}>
                              {isMainCategory ? "Main" : "Subcategory"}
                            </span>
                          </div>

                          {/* Mobile Stats */}
                          <div className="md:hidden flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Products:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {category.productCount || 0}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Order:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {category.sortOrder}
                              </span>
                            </div>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              isMainCategory 
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                            }`}>
                              {isMainCategory ? "Main" : "Sub"}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="md:col-span-1 md:text-right mt-3 md:mt-0">
                            <div className="flex items-center gap-1 justify-end">
                              <button
                                onClick={() => handleViewCategory(category)}
                                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                title="View Products"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setShowEditModal(true);
                                }}
                                className="p-1.5 text-blue-500 hover:text-blue-700"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category)}
                                className="p-1.5 text-red-500 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <FolderTree className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 dark:text-white font-medium">No categories found</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {searchQuery
                      ? "Try adjusting your search"
                      : "Get started by creating your first category"}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Create Category
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Create Category Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Category"
        size="lg"
      >
        <CategoryForm
          mode="create"
          parentCategories={mainCategories}
          onSubmit={handleCreateCategory}
          onClose={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        title="Edit Category"
        size="lg"
      >
        {selectedCategory && (
          <CategoryForm
            mode="edit"
            category={selectedCategory}
            parentCategories={mainCategories}
            onSubmit={handleEditCategory}
            onClose={() => {
              setShowEditModal(false);
              setSelectedCategory(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}