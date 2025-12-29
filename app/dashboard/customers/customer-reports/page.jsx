"use client";
import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { 
  Users, 
  Download, 
  Filter, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  RotateCw,
  FileText,
  CreditCard,
  Printer,
  Mail,
  PieChart,
  BarChart
} from "lucide-react";
import Cookies from "js-cookie";
import CustomToast from "@/components/customtoast";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Skeleton Components
const SkeletonCard = ({ className = "" }) => (
  <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="p-3 rounded-xl bg-gray-200">
        <div className="h-6 w-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);

const SkeletonProgressBar = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((item) => (
      <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gray-300"
              style={{ width: `${Math.random() * 60 + 20}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SkeletonList = ({ items = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg animate-pulse">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-200 rounded-full mr-3"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="text-right">
          <div className="h-6 bg-gray-200 rounded w-8 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    ))}
  </div>
);

const SkeletonMiniChart = () => (
  <div className="flex items-end justify-between h-12 gap-1 animate-pulse">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="flex flex-col items-center flex-1">
        <div
          className="w-full bg-gray-200 rounded-t"
          style={{ height: `${Math.random() * 80 + 20}%` }}
        ></div>
        <div className="h-3 bg-gray-200 rounded w-6 mt-1"></div>
      </div>
    ))}
  </div>
);

const SkeletonFilter = () => (
  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end animate-pulse">
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="w-full p-3 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="w-full p-3 bg-gray-200 rounded-lg"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
          <div className="w-full p-3 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
);

// Simple Progress Bar Component
const ProgressBar = ({ value, max, color = "blue" }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className={`h-2 rounded-full bg-${color}-500 transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// Mini Chart Component
const MiniBarChart = ({ data, color = "blue" }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="flex items-end justify-between h-12 gap-1">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className={`w-full bg-${color}-200 rounded-t transition-all duration-300 hover:bg-${color}-300`}
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          ></div>
          <span className="text-xs text-gray-500 mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function CustomerReportsPage() {
  const [reports, setReports] = useState({
    summary: {},
    packageDistribution: [],
    statusDistribution: [],
    monthlyGrowth: [],
    paymentAnalysis: [],
    routerDistribution: []
  });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("last30");
  const [exportLoading, setExportLoading] = useState(false);

  const reportRef = useRef();

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
        setLoading(false);
      }
    } else {
      showToast("No user session found. Please login.", "error");
      setLoading(false);
    }
  }, []);

  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;

  // Fetch reports data
  const fetchReports = async () => {
    if (!userData?.user_id) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINT}/customer-reports.php?isp_id=${userData.user_id}&range=${dateRange}`, {
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

      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      showToast("Failed to load reports. Using demo data.", "warning");
      
      // Mock data for demonstration
      setReports({
        summary: {
          totalCustomers: 245,
          activeCustomers: 189,
          newThisMonth: 23,
          suspended: 12,
          inactive: 44,
          totalRevenue: 458900,
          averageRevenue: 1873
        },
        packageDistribution: [
          { label: "Basic 10Mbps", value: 89, amount: 89000 },
          { label: "Standard 25Mbps", value: 76, amount: 190000 },
          { label: "Premium 50Mbps", value: 45, amount: 135000 },
          { label: "Business 100Mbps", value: 35, amount: 175000 }
        ],
        statusDistribution: [
          { label: "Active", value: 189, color: "#10B981" },
          { label: "Suspended", value: 12, color: "#F59E0B" },
          { label: "Inactive", value: 44, color: "#6B7280" }
        ],
        monthlyGrowth: [
          { label: "Jan", value: 15 },
          { label: "Feb", value: 22 },
          { label: "Mar", value: 18 },
          { label: "Apr", value: 25 },
          { label: "May", value: 30 },
          { label: "Jun", value: 23 }
        ],
        paymentAnalysis: [
          { label: "On Time", value: 167 },
          { label: "Late (<7 days)", value: 15 },
          { label: "Late (>7 days)", value: 7 },
          { label: "Overdue", value: 5 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.user_id) {
      fetchReports();
    }
  }, [userData, dateRange]);

  // PDF Export function
  const exportToPDF = async () => {
    setExportLoading(true);
    try {
      const doc = new jsPDF();
      
      // Header with blue background
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Customer Analytics Report', 105, 12, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()} | Period: ${getDateRangeLabel()}`, 105, 20, { align: 'center' });
      
      // Key Metrics
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Performance Overview', 15, 45);
      
      doc.autoTable({
        startY: 50,
        head: [['Metric', 'Value', 'Percentage']],
        body: [
          ['Total Customers', reports.summary.totalCustomers.toString(), '100%'],
          ['Active Customers', reports.summary.activeCustomers.toString(), `${((reports.summary.activeCustomers / reports.summary.totalCustomers) * 100).toFixed(1)}%`],
          ['New Customers', reports.summary.newThisMonth.toString(), `${((reports.summary.newThisMonth / reports.summary.totalCustomers) * 100).toFixed(1)}%`],
          ['Total Revenue', `KES ${reports.summary.totalRevenue?.toLocaleString()}`, '-'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
      });

      // Package Distribution
      doc.setFont('helvetica', 'bold');
      doc.text('Package Performance', 15, doc.lastAutoTable.finalY + 15);
      
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Package', 'Customers', 'Revenue', 'Share']],
        body: reports.packageDistribution.map(pkg => [
          pkg.label,
          pkg.value.toString(),
          `KES ${pkg.amount?.toLocaleString()}`,
          `${((pkg.value / reports.summary.totalCustomers) * 100).toFixed(1)}%`
        ]),
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Page ${i} of ${pageCount}`,
          105,
          285,
          { align: 'center' }
        );
      }

      doc.save(`customer-report-${new Date().toISOString().split('T')[0]}.pdf`);
      showToast("PDF report downloaded successfully!", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast("Failed to generate PDF report.", "error");
    } finally {
      setExportLoading(false);
    }
  };

  const getDateRangeLabel = () => {
    const ranges = {
      last7: "Last 7 Days",
      last30: "Last 30 Days",
      last90: "Last 90 Days",
      thisMonth: "This Month",
      lastMonth: "Last Month",
      thisYear: "This Year"
    };
    return ranges[dateRange] || "Last 30 Days";
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 mb-1`}>
            {typeof value === "number" && value > 1000 ? value.toLocaleString() : value}
          </p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-${color}-50`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const DataCard = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );

  // Loading State
  if (loading) {
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
            {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 bg-gray-200 rounded-lg w-24"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="bg-gray-100 rounded-xl p-4 border border-gray-200 animate-pulse">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-48"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-9 bg-gray-300 rounded-lg w-28"></div>
                  <div className="h-9 bg-gray-300 rounded-lg w-24"></div>
                  <div className="h-9 bg-gray-300 rounded-lg w-20"></div>
                </div>
              </div>
            </div>

            {/* Filters Skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <SkeletonFilter />
            </div>

            {/* Key Metrics Skeleton */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>

            {/* Analytics Grid Skeleton */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Package Performance Skeleton */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-40"></div>
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                </div>
                <SkeletonProgressBar />
              </div>

              {/* Customer Status Skeleton */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                </div>
                <SkeletonList />
              </div>

              {/* Growth Trend Skeleton */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-36"></div>
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                </div>
                <SkeletonMiniChart />
                <div className="mt-4 p-3 bg-gray-100 rounded-lg animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
                </div>
              </div>

              {/* Payment Analysis Skeleton */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-36"></div>
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                </div>
                <SkeletonList items={4} />
                <div className="mt-4 p-3 bg-gray-100 rounded-lg animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-40 mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Summary Skeleton */}
            <div className="bg-gray-100 rounded-xl p-6 animate-pulse">
              <div className="text-center">
                <div className="h-6 bg-gray-300 rounded w-32 mx-auto mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-64 mx-auto"></div>
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
        <div ref={reportRef} className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Analytics</h1>
              <p className="text-sm text-gray-500 mt-1">
                Comprehensive insights • {getDateRangeLabel()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchReports}
                className="flex items-center px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                Live Data
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">Export Reports</h3>
                <p className="text-sm text-gray-600">Download detailed analytics in multiple formats</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={exportToPDF}
                  disabled={exportLoading}
                  className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {exportLoading ? (
                    <RotateCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  PDF Report
                </button>
                <button className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </button>
                <button className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <DataCard>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Filter className="h-4 w-4 inline mr-2" />
                    Time Period
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="last7">Last 7 Days</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="last90">Last 90 Days</option>
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </DataCard>

          {/* Key Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Customers"
              value={reports.summary.totalCustomers}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Active Now"
              value={reports.summary.activeCustomers}
              subtitle={`${((reports.summary.activeCustomers / reports.summary.totalCustomers) * 100).toFixed(1)}% active rate`}
              icon={CheckCircle}
              color="green"
            />
            <StatCard
              title="New This Month"
              value={reports.summary.newThisMonth}
              icon={TrendingUp}
              color="purple"
            />
            <StatCard
              title="Monthly Revenue"
              value={`KES ${reports.summary.totalRevenue?.toLocaleString()}`}
              subtitle={`Avg: KES ${reports.summary.averageRevenue?.toLocaleString()}`}
              icon={CreditCard}
              color="orange"
            />
          </div>

          {/* Analytics Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Package Performance */}
            <DataCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Package Performance</h3>
                <BarChart className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {reports.packageDistribution.map((pkg, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{pkg.label}</span>
                        <span className="text-sm text-gray-600">{pkg.value} customers</span>
                      </div>
                      <ProgressBar 
                        value={pkg.value} 
                        max={reports.summary.totalCustomers} 
                        color={index % 2 === 0 ? "blue" : "green"}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {((pkg.value / reports.summary.totalCustomers) * 100).toFixed(1)}% of total
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          KES {pkg.amount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DataCard>

            {/* Customer Status */}
            <DataCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Customer Status</h3>
                <PieChart className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {reports.statusDistribution.map((status, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: status.color }}
                      ></div>
                      <span className="font-medium text-gray-900">{status.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{status.value}</div>
                      <div className="text-sm text-gray-500">
                        {((status.value / reports.summary.totalCustomers) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DataCard>

            {/* Growth Trend */}
            <DataCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Acquisition Trend</h3>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <MiniBarChart data={reports.monthlyGrowth} color="blue" />
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-800">Total new customers:</span>
                  <span className="font-semibold text-blue-900">
                    {reports.monthlyGrowth.reduce((sum, month) => sum + month.value, 0)}
                  </span>
                </div>
              </div>
            </DataCard>

            {/* Payment Analysis */}
            <DataCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Payment Behavior</h3>
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {reports.paymentAnalysis.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        index === 0 ? 'bg-green-500' :
                        index === 1 ? 'bg-yellow-500' :
                        index === 2 ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm text-gray-700">{payment.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">{payment.value}</span>
                      <span className="text-xs text-gray-500 w-12 text-right">
                        ({((payment.value / reports.summary.activeCustomers) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-800 text-center">
                  <strong>On-time Payment Rate:</strong>{" "}
                  {((reports.paymentAnalysis[0]?.value / reports.summary.activeCustomers) * 100).toFixed(1)}%
                </div>
              </div>
            </DataCard>
          </div>

          {/* Summary */}
          <DataCard className="bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Summary</h3>
              <p className="text-gray-600">
                Analysis period: <strong>{getDateRangeLabel()}</strong> • 
                Generated on <strong>{new Date().toLocaleDateString()}</strong> • 
                Total records: <strong>{reports.summary.totalCustomers} customers</strong>
              </p>
            </div>
          </DataCard>
        </div>
      </DashboardLayout>
    </>
  );
}