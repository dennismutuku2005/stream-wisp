"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package2,
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Tag,
  Layers,
  DollarSign,
  Hash,
  FileText,
  FolderTree,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Copy,
  ShoppingBag,
  Truck,
  Percent,
  Star,
  TrendingUp,
  Shield,
  Users,
  Globe,
  Package,
  RefreshCw,
  Camera,
  Link as LinkIcon,
  QrCode,
  Barcode,
  BookOpen,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Settings,
  Zap,
  Target,
  Award,
  Gift,
  Bookmark,
  Heart,
  Share2,
  Send,
  Download,
  Printer,
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  Home,
  CreditCard,
  Users2,
  UserPlus,
  Wallet,
  Receipt,
  Trophy,
  PackageOpen,
  CheckSquare,
  RotateCw,
  RotateCcw,
  ShoppingCart,
  ShoppingBasket,
  Store,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Grid,
  List,
  Columns,
  Rows,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Check,
  XCircle,
  Minus,
  MoreVertical,
  Edit,
  Eye as EyeIcon,
  Trash,
  Copy as CopyIcon,
  Archive,
  BookmarkPlus,
  BookmarkMinus,
  BookmarkCheck,
  BookmarkX,
  Heart as HeartIcon,
  HeartOff,
  Star as StarIcon,
  StarOff,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Share as ShareIcon,
  Link2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CustomToast from "@/components/customtoast";

// Image Upload Component
const ImageUpload = ({ images, onImagesChange, maxImages = 5 }) => {
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
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      images.length + files.length <= maxImages
    );

    if (imageFiles.length === 0) {
      return;
    }

    const newImages = imageFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      isPrimary: images.length === 0 && imageFiles.length === 1
    }));

    onImagesChange([...images, ...newImages]);
  };

  const removeImage = (id) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    onImagesChange(images.filter(img => img.id !== id));
  };

  const setPrimaryImage = (id) => {
    onImagesChange(
      images.map(img => ({
        ...img,
        isPrimary: img.id === id
      }))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Images
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Upload up to {maxImages} images. First image will be used as primary.
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {images.length}/{maxImages}
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }
        `}
      >
        <input
          id="file-upload"
          type="file"
          multiple
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
              Drop images here or click to upload
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              PNG, JPG, GIF up to 5MB each
            </p>
          </div>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800"
            >
              <div className="aspect-square relative">
                <Image
                  src={image.preview}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {image.isPrimary && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded-full">
                      Primary
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPrimaryImage(image.id);
                  }}
                  className="p-2 bg-white rounded-lg hover:bg-gray-100"
                  title="Set as primary"
                >
                  <Star className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                  className="p-2 bg-white rounded-lg hover:bg-gray-100"
                  title="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute bottom-2 right-2">
                <button
                  onClick={() => removeImage(image.id)}
                  className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Variant Section Component
const VariantSection = ({ variants, onVariantsChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [newVariant, setNewVariant] = useState({
    name: '',
    options: [''],
    price: '',
    sku: ''
  });

  const addVariant = () => {
    if (!newVariant.name.trim() || newVariant.options.length === 0) {
      return;
    }

    onVariantsChange([...variants, {
      id: Math.random().toString(36).substr(2, 9),
      ...newVariant,
      options: newVariant.options.filter(opt => opt.trim() !== '')
    }]);

    setNewVariant({
      name: '',
      options: [''],
      price: '',
      sku: ''
    });
    setShowForm(false);
  };

  const removeVariant = (id) => {
    onVariantsChange(variants.filter(v => v.id !== id));
  };

  const addOption = () => {
    setNewVariant({
      ...newVariant,
      options: [...newVariant.options, '']
    });
  };

  const updateOption = (index, value) => {
    const newOptions = [...newVariant.options];
    newOptions[index] = value;
    setNewVariant({
      ...newVariant,
      options: newOptions
    });
  };

  const removeOption = (index) => {
    const newOptions = newVariant.options.filter((_, i) => i !== index);
    setNewVariant({
      ...newVariant,
      options: newOptions
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Variants
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Add different sizes, colors, or styles
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Plus className="h-4 w-4" />
            Add Variant
          </button>
        )}
      </div>

      {/* Variant Form */}
      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">New Variant</h4>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Variant Name (e.g., Size, Color)
              </label>
              <input
                type="text"
                value={newVariant.name}
                onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="e.g., Size, Color, Material"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (KES)
              </label>
              <input
                type="number"
                value={newVariant.price}
                onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SKU
              </label>
              <input
                type="text"
                value={newVariant.sku}
                onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Variant-SKU-001"
              />
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {newVariant.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder={`Option ${index + 1}`}
                  />
                  {newVariant.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addVariant}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Variant
            </button>
          </div>
        </div>
      )}

      {/* Existing Variants */}
      {variants.length > 0 && (
        <div className="space-y-3">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">{variant.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({variant.options.join(', ')})
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>KES {parseFloat(variant.price).toLocaleString()}</span>
                  <span>{variant.sku}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeVariant(variant.id)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// SEO Section Component
const SeoSection = ({ seoData, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            SEO Settings
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Optimize your product for search engines
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            value={seoData.title}
            onChange={(e) => onChange({ ...seoData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Product title for search engines"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Recommended: 50-60 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Meta Description
          </label>
          <textarea
            value={seoData.description}
            onChange={(e) => onChange({ ...seoData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Product description for search engines"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Recommended: 150-160 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Keywords
          </label>
          <input
            type="text"
            value={seoData.keywords}
            onChange={(e) => onChange({ ...seoData, keywords: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="comma, separated, keywords"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Separate keywords with commas
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URL Slug
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">yourstore.com/products/</span>
            <input
              type="text"
              value={seoData.slug}
              onChange={(e) => onChange({ ...seoData, slug: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="product-url-slug"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    sku: '',
    description: '',
    fullDescription: '',
    
    // Pricing
    price: '',
    compareAtPrice: '',
    costPrice: '',
    
    // Inventory
    stock: '',
    lowStockThreshold: '5',
    stockStatus: 'in_stock',
    trackInventory: true,
    
    // Organization
    category: '',
    subcategory: '',
    tags: [],
    brand: '',
    
    // Shipping
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    shippingClass: 'standard',
    
    // Status
    status: 'draft',
    visibility: 'visible',
    
    // Additional
    warranty: '',
    rating: '5',
    featured: false,
    
    // Variants
    hasVariants: false,
  });

  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: '',
    slug: '',
  });

  const [categories] = useState([
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'books', name: 'Books' },
    { id: 'sports', name: 'Sports' },
    { id: 'beauty', name: 'Beauty' },
    { id: 'toys', name: 'Toys & Games' },
    { id: 'food', name: 'Food & Beverages' },
  ]);

  const [subcategories] = useState([
    { id: 'mobiles', name: 'Mobile Phones', categoryId: 'electronics' },
    { id: 'laptops', name: 'Laptops', categoryId: 'electronics' },
    { id: 'audio', name: 'Audio', categoryId: 'electronics' },
    { id: 'mens', name: "Men's Fashion", categoryId: 'fashion' },
    { id: 'womens', name: "Women's Fashion", categoryId: 'fashion' },
    { id: 'furniture', name: 'Furniture', categoryId: 'home' },
    { id: 'kitchen', name: 'Kitchen', categoryId: 'home' },
    { id: 'fitness', name: 'Fitness', categoryId: 'sports' },
    { id: 'skincare', name: 'Skincare', categoryId: 'beauty' },
  ]);

  const [shippingClasses] = useState([
    { id: 'free', name: 'Free Shipping' },
    { id: 'standard', name: 'Standard Shipping' },
    { id: 'express', name: 'Express Shipping' },
    { id: 'heavy', name: 'Heavy/Bulky Items' },
    { id: 'international', name: 'International' },
  ]);

  const [tags, setTags] = useState('');
  const [toast, setToast] = useState({
    message: '',
    type: 'error',
    isVisible: false,
  });

  // Generate SKU
  const generateSKU = () => {
    const prefix = 'SKU';
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    const sku = `${prefix}-${random}`;
    setFormData({ ...formData, sku });
  };

  // Handle tag input
  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };

  const addTag = () => {
    if (tags.trim() && !formData.tags.includes(tags.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tags.trim()],
      });
      setTags('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.name.trim()) {
      showToast('Product name is required', 'error');
      setIsLoading(false);
      return;
    }

    if (!formData.price) {
      showToast('Price is required', 'error');
      setIsLoading(false);
      return;
    }

    if (!formData.category) {
      showToast('Category is required', 'error');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Form Data:', {
        ...formData,
        images,
        variants,
        seoData,
      });

      showToast('Product added successfully!', 'success');
      setIsLoading(false);
      
      // Redirect to products page after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/products');
      }, 2000);
    }, 2000);
  };

  // Handle save as draft
  const handleSaveDraft = () => {
    setFormData({ ...formData, status: 'draft' });
    handleSubmit(new Event('submit'));
  };

  // Show toast
  const showToast = (message, type = 'error') => {
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

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price || 0);
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
        <div className="max-w-6xl mx-auto py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard/products"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Products
                </Link>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Create a new product listing in your store
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Publish Product
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {['basic', 'pricing', 'inventory', 'media', 'shipping', 'seo'].map((step, index) => (
                <button
                  key={step}
                  onClick={() => setActiveTab(step)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${activeTab === step 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs font-medium capitalize">
                    {step === 'basic' ? 'Basic Info' : 
                     step === 'pricing' ? 'Pricing' :
                     step === 'inventory' ? 'Inventory' :
                     step === 'media' ? 'Media' :
                     step === 'shipping' ? 'Shipping' :
                     'SEO'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Tabs Content */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-800">
                <nav className="flex overflow-x-auto">
                  {[
                    { id: 'basic', label: 'Basic Information', icon: Package2 },
                    { id: 'pricing', label: 'Pricing', icon: DollarSign },
                    { id: 'inventory', label: 'Inventory', icon: Package },
                    { id: 'media', label: 'Media', icon: ImageIcon },
                    { id: 'organization', label: 'Organization', icon: FolderTree },
                    { id: 'shipping', label: 'Shipping', icon: Truck },
                    { id: 'seo', label: 'SEO', icon: Globe },
                    { id: 'variants', label: 'Variants', icon: Layers },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                        ${activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }
                      `}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Basic Information Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Enter product name"
                          required
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            SKU (Stock Keeping Unit)
                          </label>
                          <button
                            type="button"
                            onClick={generateSKU}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Generate
                          </button>
                        </div>
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="PROD-001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Short Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Brief description for product cards and listings"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Description
                      </label>
                      <textarea
                        value={formData.fullDescription}
                        onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Detailed product description with features, specifications, etc."
                      />
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <button type="button" className="text-xs px-3 py-1 border rounded">B</button>
                        <button type="button" className="text-xs px-3 py-1 border rounded">I</button>
                        <button type="button" className="text-xs px-3 py-1 border rounded">U</button>
                        <button type="button" className="text-xs px-3 py-1 border rounded">Link</button>
                        <button type="button" className="text-xs px-3 py-1 border rounded">Image</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => {
                            setFormData({ 
                              ...formData, 
                              category: e.target.value,
                              subcategory: '' // Reset subcategory when category changes
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Subcategory
                        </label>
                        <select
                          value={formData.subcategory}
                          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          disabled={!formData.category}
                        >
                          <option value="">Select a subcategory</option>
                          {subcategories
                            .filter(sub => sub.categoryId === formData.category)
                            .map((sub) => (
                              <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={tags}
                            onChange={handleTagsChange}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Add tags (press Enter or click Add)"
                          />
                          <button
                            type="button"
                            onClick={addTag}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-blue-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Price (KES) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                            KES
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="0.00"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Compare at Price (KES)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                            KES
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.compareAtPrice}
                            onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                            className="w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="0.00"
                          />
                        </div>
                        {formData.compareAtPrice && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            You save: {formatPrice(formData.compareAtPrice - formData.price)}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cost Price (KES)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                            KES
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.costPrice}
                            onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                            className="w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="0.00"
                          />
                        </div>
                        {formData.costPrice && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Profit: {formatPrice(formData.price - formData.costPrice)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Selling Price</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                            {formatPrice(formData.price)}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Cost Price</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                            {formatPrice(formData.costPrice)}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</p>
                          <p className={`text-xl font-bold mt-1 ${
                            formData.price && formData.costPrice
                              ? formData.price > formData.costPrice
                                ? 'text-green-600'
                                : 'text-red-600'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {formData.price && formData.costPrice
                              ? `${(((formData.price - formData.costPrice) / formData.costPrice) * 100).toFixed(1)}%`
                              : '0%'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Stock Quantity *
                        </label>
                        <input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Low Stock Threshold
                        </label>
                        <input
                          type="number"
                          value={formData.lowStockThreshold}
                          onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="5"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Get notified when stock drops below this number
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Stock Status
                        </label>
                        <select
                          value={formData.stockStatus}
                          onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="in_stock">In Stock</option>
                          <option value="low_stock">Low Stock</option>
                          <option value="out_of_stock">Out of Stock</option>
                          <option value="pre_order">Pre-order</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Track Inventory
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.trackInventory}
                              onChange={(e) => setFormData({ ...formData, trackInventory: e.target.checked })}
                              className="rounded border-gray-300 dark:border-gray-700 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              Track quantity of this product
                            </span>
                          </label>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          When checked, stock quantity will be automatically updated with each sale
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Inventory Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Current Stock</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {formData.stock || 0}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock Alert</p>
                          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                            {formData.lowStockThreshold}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                            formData.stockStatus === 'in_stock'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : formData.stockStatus === 'low_stock'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : formData.stockStatus === 'pre_order'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {formData.stockStatus === 'in_stock'
                              ? 'In Stock'
                              : formData.stockStatus === 'low_stock'
                              ? 'Low Stock'
                              : formData.stockStatus === 'pre_order'
                              ? 'Pre-order'
                              : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <div className="space-y-6">
                    <ImageUpload
                      images={images}
                      onImagesChange={setImages}
                      maxImages={10}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Video URL
                      </label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Add a YouTube or Vimeo link for product video
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Media Tips</h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Use high-quality images (minimum 800x800 pixels)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Show product from multiple angles</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Include lifestyle images showing product in use</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Use consistent lighting and background</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Organization Tab */}
                {activeTab === 'organization' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Brand
                        </label>
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Product brand name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Collection
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="e.g., Summer Collection 2024"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Product Type
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="e.g., Physical, Digital, Service"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Vendor
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Supplier name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Status
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { value: 'draft', label: 'Draft', color: 'gray' },
                          { value: 'active', label: 'Active', color: 'green' },
                          { value: 'archived', label: 'Archived', color: 'red' },
                        ].map((status) => (
                          <label
                            key={status.value}
                            className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                              formData.status === status.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                            }`}
                          >
                            <input
                              type="radio"
                              name="status"
                              value={status.value}
                              checked={formData.status === status.value}
                              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                              className="text-blue-500 focus:ring-blue-500"
                            />
                            <div className="ml-3">
                              <span className="block text-sm font-medium text-gray-900 dark:text-white">
                                {status.label}
                              </span>
                              <span className="block text-sm text-gray-500 dark:text-gray-400">
                                {status.value === 'draft'
                                  ? 'Save as draft for later'
                                  : status.value === 'active'
                                  ? 'Make product visible to customers'
                                  : 'Archive product (hidden from store)'}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Visibility
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { value: 'visible', label: 'Visible', description: 'Product is visible in store' },
                          { value: 'hidden', label: 'Hidden', description: 'Product is hidden from store' },
                          { value: 'search_only', label: 'Search Only', description: 'Only visible via search' },
                          { value: 'private', label: 'Private', description: 'Visible only to admins' },
                        ].map((visibility) => (
                          <label
                            key={visibility.value}
                            className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                              formData.visibility === visibility.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                            }`}
                          >
                            <input
                              type="radio"
                              name="visibility"
                              value={visibility.value}
                              checked={formData.visibility === visibility.value}
                              onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                              className="text-blue-500 focus:ring-blue-500"
                            />
                            <div className="ml-3">
                              <span className="block text-sm font-medium text-gray-900 dark:text-white">
                                {visibility.label}
                              </span>
                              <span className="block text-sm text-gray-500 dark:text-gray-400">
                                {visibility.description}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Tab */}
                {activeTab === 'shipping' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Weight (kg)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            className="w-full pr-12 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="0.00"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                            kg
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Shipping Class
                        </label>
                        <select
                          value={formData.shippingClass}
                          onChange={(e) => setFormData({ ...formData, shippingClass: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          {shippingClasses.map((sc) => (
                            <option key={sc.id} value={sc.id}>{sc.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Dimensions (cm)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Length</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.1"
                              value={formData.dimensions.length}
                              onChange={(e) => setFormData({
                                ...formData,
                                dimensions: { ...formData.dimensions, length: e.target.value }
                              })}
                              className="w-full pr-12 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="0.0"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              cm
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Width</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.1"
                              value={formData.dimensions.width}
                              onChange={(e) => setFormData({
                                ...formData,
                                dimensions: { ...formData.dimensions, width: e.target.value }
                              })}
                              className="w-full pr-12 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="0.0"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              cm
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Height</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.1"
                              value={formData.dimensions.height}
                              onChange={(e) => setFormData({
                                ...formData,
                                dimensions: { ...formData.dimensions, height: e.target.value }
                              })}
                              className="w-full pr-12 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              placeholder="0.0"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              cm
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Shipping Preview</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Package Weight</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                            {formData.weight || '0.00'} kg
                          </p>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Package Size</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                            {formData.dimensions.length && formData.dimensions.width && formData.dimensions.height
                              ? `${formData.dimensions.length}×${formData.dimensions.width}×${formData.dimensions.height} cm`
                              : 'Not set'
                            }
                          </p>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Shipping Class</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                            {shippingClasses.find(sc => sc.id === formData.shippingClass)?.name || 'Standard'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <SeoSection seoData={seoData} onChange={setSeoData} />
                )}

                {/* Variants Tab */}
                {activeTab === 'variants' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Product Variants
                        </label>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Add variants like sizes, colors, or materials
                        </p>
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.hasVariants}
                          onChange={(e) => setFormData({ ...formData, hasVariants: e.target.checked })}
                          className="rounded border-gray-300 dark:border-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">This product has variants</span>
                      </label>
                    </div>

                    {formData.hasVariants ? (
                      <VariantSection variants={variants} onVariantsChange={setVariants} />
                    ) : (
                      <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-900 dark:text-white font-medium">No variants added</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          Enable variants to add different options for this product
                        </p>
                      </div>
                    )}

                    {variants.length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Variants Summary</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-800">
                                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-400">Variant</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-400">Options</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-400">Price (KES)</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-400">SKU</th>
                              </tr>
                            </thead>
                            <tbody>
                              {variants.map((variant) => (
                                <tr key={variant.id} className="border-b border-gray-200 dark:border-gray-800">
                                  <td className="p-3 text-sm text-gray-900 dark:text-white">{variant.name}</td>
                                  <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                                    {variant.options.join(', ')}
                                  </td>
                                  <td className="p-3 text-sm text-gray-900 dark:text-white">
                                    {formatPrice(variant.price)}
                                  </td>
                                  <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{variant.sku}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>All changes are saved automatically</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/products')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Publish Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </>
  );
}