"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import {
  Package2,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Tag,
  Layers,
  DollarSign,
  Star,
  TrendingUp,
  Package,
  ShoppingBag,
  Grid,
  List,
  SortAsc,
  SortDesc,
  RefreshCw,
  Copy,
  Archive,
  EyeOff,
  Shield,
  BadgePercent,
  CheckCircle,
  Clock,
  AlertTriangle,
  Image as ImageIcon,
  BarChart3,
  FolderTree,
  Hash,
  Calendar,
  User,
  Truck,
  Store,
  Percent,
  ArrowUpDown,
  ShoppingCart,
  Heart,
  Share2,
  Link as LinkIcon,
  Bookmark,
  ShoppingBasket,
  BarChart,
  PieChart,
  LineChart,
  Target,
  Activity,
  Zap,
  Settings,
  MessageSquare,
  Bell,
  Mail,
  Phone,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  ExternalLink,
  Menu,
  Home,
  ShoppingCart as CartIcon,
  Users,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  Laptop,
  UserPlus,
  Users2,
  UserCheck,
  UserX,
  Wallet,
  Receipt,
  Award,
  Trophy,
  Gift,
  PackageOpen,
  TruckIcon,
  CheckSquare,
  RotateCcw,
  RotateCw as RotateCwIcon,
  ShoppingBag as ShoppingBagIcon,
  Tag as TagIcon,
  Package as PackageIcon,
  Grid3X3,
  Columns,
  Rows,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  CheckCheck,
  XCircle,
  Minus,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw as RotateCcwIcon,
  Upload,
  DownloadCloud,
  Printer,
  Mail as MailIcon,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Flag,
  BookmarkPlus,
  BookmarkMinus,
  BookOpen,
  Book,
  BookmarkCheck,
  BookmarkX,
  Bookmark as BookmarkIcon,
  BookmarkPlus as BookmarkPlusIcon,
  BookmarkMinus as BookmarkMinusIcon,
  BookmarkCheck as BookmarkCheckIcon,
  BookmarkX as BookmarkXIcon,
  Heart as HeartIcon,
  HeartOff,
  Star as StarIcon,
  StarOff,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,
  Flag as FlagIcon,
  Share as ShareIcon,
  Send,
  Copy as CopyIcon,
  Link2,
  QrCode,
  Barcode,
  Camera,
  Video,
  Mic,
  Headphones,
  Music,
  Film,
  Tv,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Camera as CameraIcon,
  Video as VideoIcon,
  Mic as MicIcon,
  Headphones as HeadphonesIcon,
  Music as MusicIcon,
  Film as FilmIcon,
  Tv as TvIcon,
  Monitor as MonitorIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Watch as WatchIcon,
  Cpu,
  HardDrive,
  MemoryStick,
  Server,
  Database,
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  Bluetooth,
  Radio,
  Satellite,
  Navigation,
  Map,
  Compass,
  Globe as GlobeIcon,
  MapPin as MapPinIcon,
  Navigation as NavigationIcon,
  Compass as CompassIcon,
  Map as MapIcon,
  Wind,
  Droplets,
  Thermometer,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun as SunIcon,
  Moon as MoonIcon,
  Sunrise,
  Sunset,
  Umbrella,
  Snowflake,
  Fire,
  Flame,
  Waves,
  Leaf,
  TreePine,
  TreeDeciduous,
  Sprout,
  Bug,
  Bird,
  Cat,
  Dog,
  Fish,
  Rabbit,
  Turtle,
  Whale,
  Bee,
  Spider,
  Snail,
  Crab,
  Octopus,
  Butterfly,
  Shell,
  Feather,
  Bone,
  Skull,
  Ghost,
  Alien,
  Rocket,
  Astronaut,
  Satellite as SatelliteIcon,
  Planet,
  Star as StarIcon2,
  Moon as MoonIcon2,
  Sun as SunIcon2,
  Cloud as CloudIcon,
  CloudOff as CloudOffIcon,
  Droplet,
  Thermometer as ThermometerIcon,
  Wind as WindIcon,
  Umbrella as UmbrellaIcon,
  Snowflake as SnowflakeIcon,
  Flame as FlameIcon,
  Droplets as DropletsIcon,
  Waves as WavesIcon,
  Leaf as LeafIcon,
  TreePine as TreePineIcon,
  TreeDeciduous as TreeDeciduousIcon,
  Sprout as SproutIcon,
  Bug as BugIcon,
  Bird as BirdIcon,
  Cat as CatIcon,
  Dog as DogIcon,
  Fish as FishIcon,
  Rabbit as RabbitIcon,
  Turtle as TurtleIcon,
  Whale as WhaleIcon,
  Bee as BeeIcon,
  Spider as SpiderIcon,
  Snail as SnailIcon,
  Crab as CrabIcon,
  Octopus as OctopusIcon,
  Butterfly as ButterflyIcon,
  Shell as ShellIcon,
  Feather as FeatherIcon,
  Bone as BoneIcon,
  Skull as SkullIcon,
  Ghost as GhostIcon,
  Alien as AlienIcon,
  Rocket as RocketIcon,
  Astronaut as AstronautIcon,
  SatelliteDish,
  Telescope,
  Microscope,
  Beaker,
  FlaskConical,
  FlaskRound,
  TestTube,
  TestTube2,
  Dropper,
  Pill,
  Stethoscope,
  Syringe,
  Bandage,
  HeartPulse,
  Brain,
  Eye as EyeIcon,
  Ear,
  Nose,
  Mouth,
  Hand,
  Footprints,
  Bone as BoneIcon2,
  Skull as SkullIcon2,
  Heart as HeartIcon2,
  Lungs,
  Kidney,
  Liver,
  Stomach,
  Brain as BrainIcon,
  Atom,
  Dna,
  Microscope as MicroscopeIcon,
  Telescope as TelescopeIcon,
  Beaker as BeakerIcon,
  FlaskConical as FlaskConicalIcon,
  FlaskRound as FlaskRoundIcon,
  TestTube as TestTubeIcon,
  TestTube2 as TestTube2Icon,
  Dropper as DropperIcon,
  Pill as PillIcon,
  Stethoscope as StethoscopeIcon,
  Syringe as SyringeIcon,
  Bandage as BandageIcon,
  HeartPulse as HeartPulseIcon,
  Brain as BrainIcon2,
  Eye as EyeIcon2,
  Ear as EarIcon,
  Nose as NoseIcon,
  Mouth as MouthIcon,
  Hand as HandIcon,
  Footprints as FootprintsIcon,
  Bone as BoneIcon3,
  Skull as SkullIcon3,
  Heart as HeartIcon3,
  Lungs as LungsIcon,
  Kidney as KidneyIcon,
  Liver as LiverIcon,
  Stomach as StomachIcon,
  Brain as BrainIcon3,
  Atom as AtomIcon,
  Dna as DnaIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CustomToast from "@/components/customtoast";

// Modal Component for Actions
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
    "2xl": "max-w-5xl",
  };

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      ></div>

      <div
        className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transform transition-all duration-300 p-6 w-full max-h-[90vh] overflow-y-auto ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
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

// Filter Modal Component
const FilterModal = ({ isOpen, onClose, categories, subcategories, onApplyFilters }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [stockStatus, setStockStatus] = useState("");
  const [status, setStatus] = useState("");

  const handleApply = () => {
    onApplyFilters({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      priceRange,
      stockStatus,
      status,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setPriceRange({ min: "", max: "" });
    setStockStatus("");
    setStatus("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Products">
      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory Filter */}
        {selectedCategory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subcategory
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {subcategories
                .filter((sub) => sub.categoryId === selectedCategory)
                .map((subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() => setSelectedSubcategory(subcategory.id)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      selectedSubcategory === subcategory.id
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {subcategory.name}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price Range (KES)
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <span className="text-gray-500">to</span>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Stock Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stock Status
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { value: "in_stock", label: "In Stock", color: "green" },
              { value: "low_stock", label: "Low Stock", color: "yellow" },
              { value: "out_of_stock", label: "Out of Stock", color: "red" },
              { value: "pre_order", label: "Pre-order", color: "blue" },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setStockStatus(status.value)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  stockStatus === status.value
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { value: "active", label: "Active", color: "green" },
              { value: "draft", label: "Draft", color: "gray" },
              { value: "archived", label: "Archived", color: "red" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setStatus(item.value)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  status === item.value
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Product Detail Modal
const ProductDetailModal = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Details" size="lg">
      <div className="space-y-6">
        {/* Product Header */}
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <Package2 className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{product.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                KES {product.price.toLocaleString()}
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  product.stockStatus === "in_stock"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : product.stockStatus === "low_stock"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {product.stockStatus === "in_stock"
                  ? "In Stock"
                  : product.stockStatus === "low_stock"
                  ? "Low Stock"
                  : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">SKU</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{product.sku}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{product.category}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Subcategory</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{product.subcategory}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Stock</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{product.stock}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Sold</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{product.sold}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
            <span
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                product.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : product.status === "draft"
                  ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {product.status === "active" ? "Active" : product.status === "draft" ? "Draft" : "Archived"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-900 dark:text-white">Description</h5>
          <p className="text-sm text-gray-600 dark:text-gray-400">{product.fullDescription}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Handle edit
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit Product
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Table Skeleton Loader
const TableSkeleton = () => {
  return (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
          <div className="w-20 h-6 bg-gray-300 dark:bg-gray-700 rounded ml-4"></div>
          <div className="w-16 h-6 bg-gray-300 dark:bg-gray-700 rounded ml-4"></div>
          <div className="w-24 h-6 bg-gray-300 dark:bg-gray-700 rounded ml-4"></div>
          <div className="w-20 h-6 bg-gray-300 dark:bg-gray-700 rounded ml-4"></div>
          <div className="w-8 h-6 bg-gray-300 dark:bg-gray-700 rounded ml-4"></div>
        </div>
      ))}
    </div>
  );
};

// Action Dropdown Component
const ActionDropdown = ({ product, onView, onEdit, onDelete, onDuplicate }) => {
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
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
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
                onEdit();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit Product
            </button>
            <button
              onClick={() => {
                onDuplicate();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Copy className="h-4 w-4" />
              Duplicate
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

export default function ProductsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "error",
    isVisible: false,
  });

  // Sample categories and subcategories
  const categories = [
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "home", name: "Home & Garden" },
    { id: "books", name: "Books" },
    { id: "sports", name: "Sports" },
    { id: "beauty", name: "Beauty" },
  ];

  const subcategories = [
    { id: "mobiles", name: "Mobile Phones", categoryId: "electronics" },
    { id: "laptops", name: "Laptops", categoryId: "electronics" },
    { id: "audio", name: "Audio", categoryId: "electronics" },
    { id: "mens", name: "Men's Fashion", categoryId: "fashion" },
    { id: "womens", name: "Women's Fashion", categoryId: "fashion" },
    { id: "kids", name: "Kids Fashion", categoryId: "fashion" },
    { id: "furniture", name: "Furniture", categoryId: "home" },
    { id: "decor", name: "Home Decor", categoryId: "home" },
    { id: "kitchen", name: "Kitchen", categoryId: "home" },
    { id: "fiction", name: "Fiction", categoryId: "books" },
    { id: "nonfiction", name: "Non-fiction", categoryId: "books" },
    { id: "fitness", name: "Fitness", categoryId: "sports" },
    { id: "outdoor", name: "Outdoor", categoryId: "sports" },
    { id: "skincare", name: "Skincare", categoryId: "beauty" },
    { id: "makeup", name: "Makeup", categoryId: "beauty" },
  ];

  // Generate sample products
  const generateProducts = () => {
    const productNames = [
      "iPhone 15 Pro Max",
      "MacBook Pro 16-inch",
      "Samsung Galaxy S24",
      "Sony WH-1000XM5 Headphones",
      "Nike Air Max 270",
      "Adidas Ultraboost 22",
      "Levi's 501 Original Jeans",
      "IKEA Billy Bookcase",
      "Nespresso Vertuo Plus",
      "Kindle Paperwhite",
      "PlayStation 5",
      "Xbox Series X",
      "Canon EOS R5",
      "Dyson V15 Detect",
      "Instant Pot Duo Plus",
      "Yeti Rambler 36 oz",
      "Lululemon ABC Pants",
      "Patagonia Better Sweater",
      "Apple Watch Series 9",
      "Bose QuietComfort Earbuds",
    ];

    const statuses = ["active", "draft", "archived"];
    const stockStatuses = ["in_stock", "low_stock", "out_of_stock"];

    return productNames.map((name, index) => {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const catSubcategories = subcategories.filter((s) => s.categoryId === category.id);
      const subcategory = catSubcategories.length > 0 
        ? catSubcategories[Math.floor(Math.random() * catSubcategories.length)]
        : { id: "other", name: "Other" };

      return {
        id: `prod_${index + 1}`,
        sku: `SKU${String(index + 1).padStart(4, "0")}`,
        name,
        description: `High-quality ${name.toLowerCase()} with premium features`,
        fullDescription: `This is a premium ${name.toLowerCase()} featuring the latest technology and design. Perfect for everyday use with excellent performance and durability.`,
        price: Math.floor(Math.random() * 50000) + 5000,
        originalPrice: Math.floor(Math.random() * 60000) + 6000,
        category: category.name,
        subcategory: subcategory.name,
        stock: Math.floor(Math.random() * 100),
        sold: Math.floor(Math.random() * 500),
        stockStatus: stockStatuses[Math.floor(Math.random() * stockStatuses.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        image: `https://picsum.photos/seed/${index}/200/200`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        rating: (Math.random() * 5).toFixed(1),
        reviews: Math.floor(Math.random() * 1000),
      };
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const generatedProducts = generateProducts();
        setProducts(generatedProducts);
        setFilteredProducts(generatedProducts);
        setIsLoading(false);
      }, 1000);
    };

    fetchProducts();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, products]);

  // Handle sort
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === "price") {
      aValue = a.price;
      bValue = b.price;
    } else if (sortBy === "stock") {
      aValue = a.stock;
      bValue = b.stock;
    }

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Handle product selection
  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map((p) => p.id));
    }
  };

  // Handle actions
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    router.push(`/dashboard/products/edit/${product.id}`);
  };

  const handleDeleteProduct = (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId));
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
      showToast("Product deleted successfully", "success");
    }
  };

  const handleDuplicateProduct = (product) => {
    const newProduct = {
      ...product,
      id: `prod_${products.length + 1}`,
      sku: `${product.sku}_COPY`,
      name: `${product.name} (Copy)`,
    };
    setProducts([newProduct, ...products]);
    showToast("Product duplicated successfully", "success");
  };

  // Handle bulk actions
  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) {
      showToast("Please select products to delete", "error");
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      setProducts(products.filter((p) => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      showToast(`${selectedProducts.length} products deleted successfully`, "success");
    }
  };

  const handleBulkStatus = (status) => {
    if (selectedProducts.length === 0) {
      showToast("Please select products", "error");
      return;
    }

    setProducts(
      products.map((p) =>
        selectedProducts.includes(p.id) ? { ...p, status } : p
      )
    );
    showToast(`${selectedProducts.length} products updated`, "success");
  };

  // Apply filters
  const applyFilters = (filters) => {
    let filtered = products;

    if (filters.category) {
      filtered = filtered.filter((p) =>
        categories.find((c) => c.id === filters.category)?.name === p.category
      );
    }

    if (filters.subcategory) {
      filtered = filtered.filter((p) =>
        subcategories.find((s) => s.id === filters.subcategory)?.name === p.subcategory
      );
    }

    if (filters.priceRange.min) {
      filtered = filtered.filter((p) => p.price >= parseInt(filters.priceRange.min));
    }

    if (filters.priceRange.max) {
      filtered = filtered.filter((p) => p.price <= parseInt(filters.priceRange.max));
    }

    if (filters.stockStatus) {
      filtered = filtered.filter((p) => p.stockStatus === filters.stockStatus);
    }

    if (filters.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  // Show toast
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

  // Format price in KES
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "archived":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get stock status color
  const getStockColor = (stockStatus) => {
    switch (stockStatus) {
      case "in_stock":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "out_of_stock":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your products, inventory, and pricing
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <Link
                href="/dashboard/products/add"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {products.length}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Package2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">In Stock</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {products.filter(p => p.stockStatus === "in_stock").length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {products.filter(p => p.stockStatus === "low_stock").length}
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Out of Stock</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {products.filter(p => p.stockStatus === "out_of_stock").length}
                  </p>
                </div>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Bulk Actions */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 mb-6">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products by name, SKU, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Bulk Actions */}
                {selectedProducts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedProducts.length} selected
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBulkStatus("active")}
                        className="px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50"
                      >
                        Set Active
                      </button>
                      <button
                        onClick={() => handleBulkStatus("draft")}
                        className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        Set Draft
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <TableSkeleton />
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left p-4 w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedProducts.length === paginatedProducts.length &&
                            paginatedProducts.length > 0
                          }
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 dark:border-gray-700 text-blue-500 focus:ring-blue-500"
                        />
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Product
                      </th>
                      <th
                        className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                        onClick={() => handleSort("category")}
                      >
                        <div className="flex items-center gap-1">
                          Category
                          {sortBy === "category" && (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th
                        className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                        onClick={() => handleSort("price")}
                      >
                        <div className="flex items-center gap-1">
                          Price
                          {sortBy === "price" && (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th
                        className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                        onClick={() => handleSort("stock")}
                      >
                        <div className="flex items-center gap-1">
                          Stock
                          {sortBy === "stock" && (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
                            className="rounded border-gray-300 dark:border-gray-700 text-blue-500 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <Package2 className="h-5 w-5 text-gray-400 m-2" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {product.sku}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <span className="text-sm text-gray-900 dark:text-white">
                              {product.category}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {product.subcategory}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice > product.price && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                {formatPrice(product.originalPrice)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <span className="text-sm text-gray-900 dark:text-white">
                              {product.stock} units
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getStockColor(
                                product.stockStatus
                              )}`}
                            >
                              {product.stockStatus === "in_stock"
                                ? "In Stock"
                                : product.stockStatus === "low_stock"
                                ? "Low Stock"
                                : "Out of Stock"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              product.status
                            )}`}
                          >
                            {product.status === "active"
                              ? "Active"
                              : product.status === "draft"
                              ? "Draft"
                              : "Archived"}
                          </span>
                        </td>
                        <td className="p-4">
                          <ActionDropdown
                            product={product}
                            onView={() => handleViewProduct(product)}
                            onEdit={() => handleEditProduct(product)}
                            onDelete={() => handleDeleteProduct(product.id)}
                            onDuplicate={() => handleDuplicateProduct(product)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {paginatedProducts.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <Package2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 dark:text-white font-medium">No products found</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {searchQuery
                      ? "Try adjusting your search or filters"
                      : "Get started by adding your first product"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Pagination */}
            {paginatedProducts.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {startIndex + 1} to {Math.min(endIndex, sortedProducts.length)} of{" "}
                    {sortedProducts.length} products
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 text-sm rounded-lg ${
                            currentPage === pageNum
                              ? "bg-blue-500 text-white"
                              : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>

      {/* Modals */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        categories={categories}
        subcategories={subcategories}
        onApplyFilters={applyFilters}
      />

      <ProductDetailModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        product={selectedProduct}
      />
    </>
  );
}