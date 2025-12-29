"use client";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Server,
  Database,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  AlertTriangle,
  RotateCw,
  WifiOff,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const REPORTS_ENDPOINT = `${API_BASE_URL}/reports.php`;

export default function ServerStatusPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [servers, setServers] = useState([]);
  const [stats, setStats] = useState({
    overallUptime: 0,
    pppoeUptime: 0,
    databaseUptime: 0,
    lastIncident: "",
  });

  // Ensure client-only rendering for time
  useEffect(() => setMounted(true), []);

  // Fetch real data from API
  const fetchServerData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching data from:', REPORTS_ENDPOINT);
      
      const response = await fetch(REPORTS_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch server data');
      }

      // Transform API data to match our UI structure
      const transformedServers = data.data.servers.map(server => ({
        id: server.id,
        name: server.name,
        location: server.location,
        icon: server.id === 'pppoe-server' ? Server : Database,
        statusData: server.statusData.map(interval => ({
          time: new Date(interval.time),
          timeString: interval.timeString,
          status: interval.status,
          responseTime: interval.responseTime
        }))
      }));

      setServers(transformedServers);
      setStats({
        overallUptime: data.data.stats.overallUptime,
        pppoeUptime: data.data.stats.pppoeUptime,
        databaseUptime: data.data.stats.databaseUptime,
        lastIncident: data.data.stats.lastIncident
      });
      setLastUpdated(new Date(data.data.lastUpdated));
      
    } catch (err) {
      console.error('Error fetching server data:', err);
      setError(err.message);
      // Clear data on error to show proper error state
      setServers([]);
      setStats({
        overallUptime: 0,
        pppoeUptime: 0,
        databaseUptime: 0,
        lastIncident: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchServerData();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchServerData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchServerData();
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Server Status</h1>
            <p className="text-sm text-gray-500">
              Real-time monitoring of our infrastructure servers
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              Last updated: {mounted ? 
                (lastUpdated ? lastUpdated.toLocaleTimeString() : "Loading...") 
                : "..."}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <WifiOff className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Connection Error
            </h3>
            <p className="text-red-600 mb-4">
              Unable to connect to the monitoring service. Please check your internet connection and try again.
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Content */}
        {!error && (
          <>
            {/* System Notice */}
            {!isLoading && parseFloat(stats.overallUptime) > 99 ? (
              <NoticeCard
                type="success"
                icon={CheckCircle}
                title="All Systems Operational"
                message="All servers are running smoothly with excellent uptime performance."
              />
            ) : (
              <NoticeCard
                type="info"
                icon={Activity}
                title="Monitoring Active"
                message="We continuously monitor our servers every 30 minutes to ensure optimal performance."
              />
            )}

            {/* Stats Overview */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {isLoading ? (
                [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
              ) : (
                <>
                  <StatCard
                    title="Overall Uptime"
                    value={stats.overallUptime}
                    suffix="%"
                    icon={TrendingUp}
                    color="green"
                    subtitle="Last 24 hours"
                  />
                  <StatCard
                    title="PPPoE Server"
                    value={stats.pppoeUptime}
                    suffix="%"
                    icon={Server}
                    color="blue"
                    subtitle="Authentication uptime"
                  />
                  <StatCard
                    title="Database Server"
                    value={stats.databaseUptime}
                    suffix="%"
                    icon={Database}
                    color="purple"
                    subtitle="Data & middleware"
                  />
                  <StatCard
                    title="Last Incident"
                    value={stats.lastIncident}
                    icon={AlertTriangle}
                    color="yellow"
                    subtitle="Service disruption"
                  />
                </>
              )}
            </div>

            {/* Server Timelines */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Server Status Timeline
              </h2>
              {isLoading ? (
                [...Array(2)].map((_, i) => (
                  <ServerStatusTimelineSkeleton key={i} />
                ))
              ) : (
                servers.map((server) => (
                  <ServerStatusTimeline
                    key={server.id}
                    server={server}
                    stats={stats}
                    hoveredBar={hoveredBar}
                    setHoveredBar={setHoveredBar}
                    isLoading={false}
                  />
                ))
              )}
            </div>

            {/* Footer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Activity className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    How We Monitor
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Our monitoring system checks server availability every 30
                    minutes using automated ping tests and health checks. Each bar
                    represents a 30-minute interval. Green = responsive, red =
                    downtime, gray = no data. Hover for details like exact time and response times.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ----------------------- Components ----------------------- */

const StatCard = ({ title, value, icon: Icon, color, subtitle, suffix = "" }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className={`text-xl font-semibold text-${color}-600 mt-1`}>
          {value}
          {suffix}
        </div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-2 rounded-full bg-${color}-100`}>
        <Icon className={`h-5 w-5 text-${color}-600`} />
      </div>
    </div>
  </div>
);

const StatCardSkeleton = () => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
      </div>
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
    </div>
  </div>
);

const StatusBar = ({ interval, index, serverId, hoveredBar, setHoveredBar }) => {
  const isOnline = interval.status === "online";
  const isOffline = interval.status === "offline";
  const isUnknown = interval.status === "unknown";
  const isHovered = hoveredBar === `${serverId}-${index}`;

  const getBarColor = () => {
    if (isOnline) return "bg-green-500 hover:bg-green-600";
    if (isOffline) return "bg-red-500 hover:bg-red-600";
    return "bg-gray-300 hover:bg-gray-400";
  };

  const getStatusText = () => {
    if (isOnline) return "Online";
    if (isOffline) return "Offline";
    return "No data";
  };

  return (
    <div
      className={`relative h-8 w-4 rounded-sm cursor-pointer transition-all duration-200 ${getBarColor()} ${
        isHovered ? "scale-110 z-10" : ""
      }`}
      onMouseEnter={() => setHoveredBar(`${serverId}-${index}`)}
      onMouseLeave={() => setHoveredBar(null)}
    >
      {isHovered && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap z-20">
          <div className="font-medium">{interval.timeString}</div>
          <div className={
            isOnline ? "text-green-300" : 
            isOffline ? "text-red-300" : "text-gray-300"
          }>
            {getStatusText()}
          </div>
          {interval.responseTime && (
            <div className="text-gray-300">{interval.responseTime}ms</div>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

const ServerStatusTimeline = ({ server, stats, hoveredBar, setHoveredBar, isLoading }) => {
  const uptime = stats[server.id.replace("-", "") + "Uptime"] || "0.0";
  const Icon = server.icon;

  if (isLoading) {
    return <ServerStatusTimelineSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{server.name}</h3>
            <p className="text-sm text-gray-500">{server.location}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">24h uptime</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>24h ago</span>
          <span>Now</span>
        </div>
        <div className="flex gap-1 overflow-hidden">
          {server.statusData.map((interval, i) => (
            <StatusBar
              key={i}
              interval={interval}
              index={i}
              serverId={server.id}
              hoveredBar={hoveredBar}
              setHoveredBar={setHoveredBar}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <span className="text-gray-600">Online</span>
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span className="text-gray-600">Offline</span>
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
            <span className="text-gray-600">No data</span>
          </span>
        </div>
        <span className="text-gray-500">Checked every 30 mins</span>
      </div>
    </div>
  );
};

const ServerStatusTimelineSkeleton = () => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    {/* Header Skeleton */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 animate-pulse"></div>
        <div>
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="text-right">
        <div className="h-6 w-12 bg-gray-200 rounded animate-pulse mb-1"></div>
        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>

    {/* Timeline Skeleton */}
    <div className="mb-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>24h ago</span>
        <span>Now</span>
      </div>
      <div className="flex gap-1 overflow-hidden">
        {[...Array(48)].map((_, i) => (
          <div
            key={i}
            className="h-8 w-4 bg-gray-200 rounded-sm animate-pulse"
          ></div>
        ))}
      </div>
    </div>

    {/* Legend Skeleton */}
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded-sm animate-pulse"></div>
            <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

const NoticeCard = ({ type, title, message, icon: Icon }) => (
  <div
    className={`p-4 rounded-lg ${
      type === "success"
        ? "bg-green-50 border-l-4 border-green-400"
        : type === "warning"
        ? "bg-yellow-50 border-l-4 border-yellow-400"
        : type === "info"
        ? "bg-blue-50 border-l-4 border-blue-400"
        : "bg-red-50 border-l-4 border-red-400"
    }`}
  >
    <div className="flex items-start">
      <Icon
        className={`h-5 w-5 ${
          type === "success"
            ? "text-green-600"
            : type === "warning"
            ? "text-yellow-600"
            : type === "info"
            ? "text-blue-600"
            : "text-red-600"
        } mt-0.5 flex-shrink-0`}
      />
      <div className="ml-3">
        <h3
          className={`text-sm font-medium ${
            type === "success"
              ? "text-green-800"
              : type === "warning"
              ? "text-yellow-800"
              : type === "info"
              ? "text-blue-800"
              : "text-red-800"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm mt-1 ${
            type === "success"
              ? "text-green-700"
              : type === "warning"
              ? "text-yellow-700"
              : type === "info"
              ? "text-blue-700"
              : "text-red-700"
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  </div>
);