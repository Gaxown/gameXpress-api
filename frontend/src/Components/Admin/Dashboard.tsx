import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import { useAuth } from "../../context/AuthContext";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Label,
    AreaChart,
    Area,
    LineChart,
    Line,
} from "recharts";
import {
    CubeIcon,
    TagIcon,
    UsersIcon,
    ExclamationTriangleIcon,
    NoSymbolIcon,
    ClockIcon,
    CheckCircleIcon,
    CubeTransparentIcon,
    ShoppingCartIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    ChartPieIcon,
    BellAlertIcon,
    ListBulletIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    SparklesIcon,
    CurrencyDollarIcon,
    TrophyIcon,
    FireIcon,
    RectangleStackIcon,
    ArrowTrendingUpIcon,
    ArrowPathIcon,
    EyeIcon,
    PlusCircleIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface Product {
    id: number;
    name: string;
    stock: number;
    category?: {
        id: number;
        name: string;
    };
    price: number;
    status: string;
    created_at: string;
    image?: string;
}

interface DashboardStats {
    total_products: number;
    total_categories: number;
    total_users: number;
    low_stock_products: number;
    out_of_stock_products: number;
    recent_products: Product[];
    stock_alerts: Product[];
    total_revenue?: number;
    total_orders?: number;
    recent_activities?: {
        id: number;
        type: string;
        message: string;
        timestamp: string;
        user?: string;
        userId?: number;
    }[];
    sales_trend?: {
        date: string;
        revenue: number;
        orders: number;
    }[];
    top_products?: Product[];
    current_month_revenue?: number;
    previous_month_revenue?: number;
}

const formatNumber = (num: number): string => {
    return num.toLocaleString("en-US");
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(amount);
};

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    colorClass?: string;
    description?: string;
    trend?: number;
    isCurrency?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    colorClass = "brand",
    description,
    trend,
    isCurrency = false,
}) => {
    const colorMap: Record<
        string,
        { bg: string; text: string; border: string }
    > = {
        brand: {
            bg: "bg-gradient-to-br from-brand-50 to-brand-100",
            text: "text-brand-600",
            border: "border-brand-200",
        },
        accent: {
            bg: "bg-gradient-to-br from-accent-50 to-accent-100",
            text: "text-accent-600",
            border: "border-accent-200",
        },
        blue: {
            bg: "bg-gradient-to-br from-blue-50 to-blue-100",
            text: "text-blue-600",
            border: "border-blue-200",
        },
        warning: {
            bg: "bg-gradient-to-br from-warning-50 to-warning-100",
            text: "text-warning-600",
            border: "border-warning-200",
        },
        danger: {
            bg: "bg-gradient-to-br from-danger-50 to-danger-100",
            text: "text-danger-600",
            border: "border-danger-200",
        },
        success: {
            bg: "bg-gradient-to-br from-success-50 to-success-100",
            text: "text-success-600",
            border: "border-success-200",
        },
        purple: {
            bg: "bg-gradient-to-br from-purple-50 to-purple-100",
            text: "text-purple-600",
            border: "border-purple-200",
        },
        teal: {
            bg: "bg-gradient-to-br from-teal-50 to-teal-100",
            text: "text-teal-600",
            border: "border-teal-200",
        },
    };

    const { bg, text, border } = colorMap[colorClass] || colorMap.brand;

    return (
        <motion.div
            whileHover={{
                y: -4,
                boxShadow: "0 12px 20px -4px rgba(0, 0, 0, 0.1)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${bg} rounded-2xl shadow-md p-5 border ${border} overflow-hidden relative group`}
        >
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-start mb-2">
                <div
                    className={`rounded-full p-2.5 ${text} bg-white/80 backdrop-blur-sm shadow-sm`}
                >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-500">{title}</h3>
                <div className="flex items-baseline mt-1">
                    <p className="text-2xl font-bold text-slate-800">
                        {isCurrency ? formatCurrency(Number(value)) : value}
                    </p>
                    {trend !== undefined && (
                        <span
                            className={`ml-2 text-xs font-medium flex items-center ${
                                trend >= 0
                                    ? "text-success-600"
                                    : "text-danger-600"
                            }`}
                        >
                            {trend >= 0 ? (
                                <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                            ) : (
                                <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                            )}
                            {Math.abs(trend)}%
                        </span>
                    )}
                </div>
                {description && (
                    <p className="text-xs text-slate-400 mt-1">{description}</p>
                )}
            </div>
        </motion.div>
    );
};

const ActivityItem: React.FC<{
    type: string;
    message: string;
    timestamp: string;
    user?: string;
}> = ({ type, message, timestamp, user }) => {
    const getIcon = () => {
        switch (type) {
            case "product":
                return <CubeIcon className="h-4 w-4 text-brand-500" />;
            case "user":
                return <UsersIcon className="h-4 w-4 text-blue-500" />;
            case "order":
                return <ShoppingCartIcon className="h-4 w-4 text-accent-500" />;
            case "stock":
                return (
                    <ExclamationTriangleIcon className="h-4 w-4 text-warning-500" />
                );
            case "alert":
                return <BellAlertIcon className="h-4 w-4 text-danger-500" />;
            default:
                return <SparklesIcon className="h-4 w-4 text-slate-500" />;
        }
    };

    return (
        <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1.5 bg-white rounded-full p-1 shadow-sm">
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700">{message}</p>
                <div className="flex items-center text-xs text-slate-500 mt-1">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    <span>
                        {new Date(timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                    {user && (
                        <>
                            <span className="mx-1">•</span>
                            <span>{user}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Mock data for sales trend if not provided by API
const generateMockSalesTrend = () => {
    const data = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        data.push({
            date: date.toISOString().split("T")[0],
            revenue: Math.random() * 10000 + 5000,
            orders: Math.floor(Math.random() * 50) + 10,
        });
    }
    return data;
};

const getMockRecentActivities = () => {
    return [
        {
            id: 1,
            type: "product",
            message: "New product 'PlayStation 5 Pro' added to inventory",
            timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
            user: "Admin",
            userId: 1,
        },
        {
            id: 2,
            type: "order",
            message: "New order #1043 received for $299.95",
            timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
            user: "System",
            userId: 0,
        },
        {
            id: 3,
            type: "stock",
            message: "Nintendo Switch inventory running low (5 remaining)",
            timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
            user: "System",
            userId: 0,
        },
        {
            id: 4,
            type: "user",
            message: "New user John Smith registered",
            timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
            user: "System",
            userId: 0,
        },
        {
            id: 5,
            type: "alert",
            message: "Xbox Series X is now out of stock",
            timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
            user: "System",
            userId: 0,
        },
    ];
};

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeframe, setTimeframe] = useState<"day" | "week" | "month">(
        "week"
    );

    // Animation variants for staggered children
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get<DashboardStats>(
                    "/admin/dashboard"
                );

                // Add mock data for new fields if they don't exist in the API response
                const data = {
                    ...response.data,
                    total_revenue: response.data.total_revenue || 254876.5,
                    total_orders: response.data.total_orders || 1254,
                    recent_activities:
                        response.data.recent_activities ||
                        getMockRecentActivities(),
                    sales_trend:
                        response.data.sales_trend || generateMockSalesTrend(),
                    top_products:
                        response.data.top_products ||
                        response.data.recent_products?.slice(0, 3) ||
                        [],
                    current_month_revenue:
                        response.data.current_month_revenue || 42580.75,
                    previous_month_revenue:
                        response.data.previous_month_revenue || 39876.2,
                };

                setStats(data);
            } catch (err: any) {
                console.error("Failed to fetch dashboard data:", err);
                setError(
                    err.response?.data?.message ||
                        err.message ||
                        "Failed to load dashboard data."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-10 bg-gradient-to-br from-slate-50 to-indigo-50">
                <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 rounded-full border-t-4 border-brand-500 animate-spin"></div>
                        <div className="absolute inset-3 rounded-full bg-white shadow-md flex items-center justify-center">
                            <SparklesIcon className="h-8 w-8 text-brand-400" />
                        </div>
                    </div>
                    <p className="mt-6 text-lg font-medium text-slate-700">
                        Loading Dashboard...
                    </p>
                    <p className="text-sm text-slate-500 animate-pulse">
                        Preparing your analytics
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 bg-gradient-to-br from-red-50 to-red-100 min-h-screen">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200 max-w-lg mx-auto text-center">
                    <NoSymbolIcon className="h-12 w-12 text-danger-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-danger-700 mb-2">
                        Loading Error
                    </h2>
                    <p className="text-slate-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-10 bg-gradient-to-br from-slate-50 to-indigo-100">
                <div className="flex flex-col items-center text-center">
                    <CubeTransparentIcon className="h-16 w-16 text-slate-400 mb-4" />
                    <h2 className="text-2xl font-semibold text-slate-600 mb-2">
                        No Dashboard Data
                    </h2>
                    <p className="text-slate-500 max-w-sm">
                        We couldn't find any data to display on the dashboard
                        right now. Please check back later or ensure data
                        sources are active.
                    </p>
                </div>
            </div>
        );
    }

    const inStockCount = Math.max(
        0,
        stats.total_products -
            stats.low_stock_products -
            stats.out_of_stock_products
    );

    const stockPieData = [
        {
            name: "In Stock",
            value: inStockCount,
            color: "rgb(16, 185, 129)",
        },
        {
            name: "Low Stock",
            value: stats.low_stock_products,
            color: "rgb(245, 158, 11)",
        },
        {
            name: "Out of Stock",
            value: stats.out_of_stock_products,
            color: "rgb(239, 68, 68)",
        },
    ];

    // Calculate revenue trend percentage
    const revenueTrend =
        stats.current_month_revenue && stats.previous_month_revenue
            ? Math.round(
                  ((stats.current_month_revenue -
                      stats.previous_month_revenue) /
                      stats.previous_month_revenue) *
                      100
              )
            : 0;

    // Filter sales trend data based on selected timeframe
    const filteredSalesTrend = (() => {
        if (!stats.sales_trend) return [];

        const now = new Date();
        const filterDate = new Date();

        switch (timeframe) {
            case "day":
                filterDate.setDate(now.getDate() - 1);
                break;
            case "week":
                filterDate.setDate(now.getDate() - 7);
                break;
            case "month":
                filterDate.setMonth(now.getMonth() - 1);
                break;
        }

        return stats.sales_trend.filter(
            (item) => new Date(item.date) >= filterDate
        );
    })();

    return (
        <div className="p-5 md:p-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                        Admin Dashboard
                    </h1>
                    <p className="mt-1 text-lg text-slate-600">
                        Welcome back,{" "}
                        <span className="font-medium text-brand-600">
                            {user?.name || "Admin"}
                        </span>
                        !
                    </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-3">
                    <button
                        className="bg-white shadow-sm border border-slate-200 rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        <ArrowPathIcon className="h-4 w-4 text-slate-500" />
                        Refresh
                    </button>
                    <div className="bg-white shadow-sm border border-slate-200 rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-slate-700">
                        <CalendarDaysIcon className="h-4 w-4 text-slate-500" />
                        <span>
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Revenue Overview */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-8 bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200"
            >
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="p-6 md:p-8 flex flex-col justify-between md:border-r border-slate-200">
                        <div>
                            <div className="flex items-center mb-2">
                                <CurrencyDollarIcon className="h-5 w-5 text-brand-500 mr-2" />
                                <h2 className="font-semibold text-slate-900">
                                    Revenue Overview
                                </h2>
                            </div>
                            <p className="text-3xl font-bold text-slate-800 mb-1">
                                {formatCurrency(
                                    stats.current_month_revenue || 0
                                )}
                            </p>
                            <div className="flex items-center">
                                <span
                                    className={`text-sm font-medium ${
                                        revenueTrend >= 0
                                            ? "text-success-600"
                                            : "text-danger-600"
                                    } flex items-center`}
                                >
                                    {revenueTrend >= 0 ? (
                                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                                    ) : (
                                        <ArrowDownIcon className="h-4 w-4 mr-1" />
                                    )}
                                    {Math.abs(revenueTrend)}% from last month
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-xs text-slate-500 mb-1">
                                    Total Orders
                                </p>
                                <p className="text-lg font-semibold text-slate-800">
                                    {formatNumber(stats.total_orders || 0)}
                                </p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-xs text-slate-500 mb-1">
                                    All-Time Revenue
                                </p>
                                <p className="text-lg font-semibold text-slate-800">
                                    {
                                        formatCurrency(
                                            stats.total_revenue || 0
                                        ).split(".")[0]
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 p-4 bg-slate-50">
                        <div className="flex justify-between items-center mb-3 px-2">
                            <h3 className="text-sm font-medium text-slate-600">
                                Sales Performance
                            </h3>
                            <div className="flex bg-white rounded-lg border border-slate-200 text-xs">
                                <button
                                    onClick={() => setTimeframe("day")}
                                    className={`px-3 py-1 rounded-l-lg ${
                                        timeframe === "day"
                                            ? "bg-brand-500 text-white"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    Day
                                </button>
                                <button
                                    onClick={() => setTimeframe("week")}
                                    className={`px-3 py-1 ${
                                        timeframe === "week"
                                            ? "bg-brand-500 text-white"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setTimeframe("month")}
                                    className={`px-3 py-1 rounded-r-lg ${
                                        timeframe === "month"
                                            ? "bg-brand-500 text-white"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    Month
                                </button>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={filteredSalesTrend}>
                                <defs>
                                    <linearGradient
                                        id="colorRevenue"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="rgb(255, 90, 31)"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="rgb(255, 90, 31)"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 10, fill: "#6b7280" }}
                                    tickFormatter={(date) =>
                                        new Date(date).toLocaleDateString(
                                            "en-US",
                                            {
                                                month:
                                                    timeframe === "day"
                                                        ? undefined
                                                        : "short",
                                                day: "numeric",
                                            }
                                        )
                                    }
                                />
                                <YAxis
                                    width={55}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 10, fill: "#6b7280" }}
                                    tickFormatter={(value) =>
                                        `$${value / 1000}k`
                                    }
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor:
                                            "rgba(255, 255, 255, 0.95)",
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                        boxShadow:
                                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                    }}
                                    formatter={(value: number) => [
                                        formatCurrency(value),
                                        "Revenue",
                                    ]}
                                    labelFormatter={(date) =>
                                        new Date(date).toLocaleDateString(
                                            "en-US",
                                            {
                                                weekday: "long",
                                                month: "short",
                                                day: "numeric",
                                            }
                                        )
                                    }
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="rgb(255, 90, 31)"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    activeDot={{
                                        r: 6,
                                        strokeWidth: 2,
                                        stroke: "#fff",
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </motion.div>

            {/* Key Metrics & Stats */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
            >
                <motion.div variants={item}>
                    <StatCard
                        title="Total Products"
                        value={formatNumber(stats.total_products)}
                        icon={CubeIcon}
                        colorClass="brand"
                        trend={4.2}
                    />
                </motion.div>
                <motion.div variants={item}>
                    <StatCard
                        title="Total Revenue"
                        value={stats.total_revenue || 0}
                        icon={CurrencyDollarIcon}
                        colorClass="teal"
                        trend={revenueTrend}
                        isCurrency={true}
                    />
                </motion.div>
                <motion.div variants={item}>
                    <StatCard
                        title="Total Users"
                        value={formatNumber(stats.total_users)}
                        icon={UserGroupIcon}
                        colorClass="blue"
                        trend={2.8}
                    />
                </motion.div>
                <motion.div variants={item}>
                    <StatCard
                        title="Total Orders"
                        value={formatNumber(stats.total_orders || 0)}
                        icon={ShoppingCartIcon}
                        colorClass="purple"
                        trend={1.9}
                    />
                </motion.div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Stock Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-slate-200"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                            <ChartPieIcon className="h-5 w-5 mr-2 text-indigo-500" />
                            Inventory Status
                        </h2>
                        <div className="bg-brand-50 rounded-md px-3 py-1 text-xs font-medium text-brand-700 border border-brand-100">
                            {stats.total_products} Products
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie
                                data={stockPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={3}
                                dataKey="value"
                                stroke="none"
                                strokeWidth={2}
                            >
                                {stockPieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                                <Label
                                    value={`${inStockCount}`}
                                    position="center"
                                    fill="#334155"
                                    style={{
                                        fontSize: "24px",
                                        fontWeight: "bold",
                                    }}
                                    dy={-5}
                                />
                                <Label
                                    value="In Stock"
                                    position="center"
                                    fill="#64748b"
                                    style={{ fontSize: "12px" }}
                                    dy={15}
                                />
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor:
                                        "rgba(255, 255, 255, 0.95)",
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                    boxShadow:
                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                                formatter={(value: number, name: string) => [
                                    `${formatNumber(value)} Products`,
                                    name,
                                ]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {stockPieData.map((item, index) => (
                            <div
                                key={index}
                                className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center"
                            >
                                <div className="flex justify-center mb-1">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-500">
                                    {item.name}
                                </p>
                                <p className="text-sm font-semibold">
                                    {formatNumber(item.value)}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activities */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-slate-200"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                            <ClockIcon className="h-5 w-5 mr-2 text-blue-500" />
                            Recent Activities
                        </h2>
                        <button className="text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors flex items-center">
                            <EyeIcon className="h-3.5 w-3.5 mr-1" />
                            View All
                        </button>
                    </div>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {stats.recent_activities &&
                        stats.recent_activities.length > 0 ? (
                            stats.recent_activities.map((activity) => (
                                <ActivityItem
                                    key={activity.id}
                                    type={activity.type}
                                    message={activity.message}
                                    timestamp={activity.timestamp}
                                    user={activity.user}
                                />
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-500">
                                <ClockIcon className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                                <p>No recent activities</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Stock Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-slate-200"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                            <BellAlertIcon className="h-5 w-5 mr-2 text-warning-500" />
                            Stock Alerts
                        </h2>
                        <button className="text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors flex items-center">
                            <ArrowPathIcon className="h-3.5 w-3.5 mr-1" />
                            Refresh
                        </button>
                    </div>
                    {stats.stock_alerts.length > 0 ? (
                        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                            {stats.stock_alerts.map((product) => (
                                <div
                                    key={product.id}
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                        product.stock <= 5
                                            ? "bg-danger-50 border border-danger-100"
                                            : "bg-warning-50 border border-warning-100"
                                    }`}
                                >
                                    <div className="flex-shrink-0 mr-3">
                                        <div className="w-10 h-10 bg-white rounded-md shadow-sm flex items-center justify-center">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-8 h-8 object-contain"
                                                />
                                            ) : (
                                                <CubeIcon className="h-5 w-5 text-slate-400" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={`text-sm font-semibold ${
                                                product.stock <= 5
                                                    ? "text-danger-800"
                                                    : "text-warning-800"
                                            } truncate`}
                                            title={product.name}
                                        >
                                            {product.name}
                                        </p>
                                        <p
                                            className={`text-xs ${
                                                product.stock <= 5
                                                    ? "text-danger-600"
                                                    : "text-warning-600"
                                            }`}
                                        >
                                            {product.category?.name ||
                                                "Uncategorized"}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex-shrink-0 text-sm font-semibold px-3 py-1 rounded-full ${
                                            product.stock <= 5
                                                ? "bg-white text-danger-700"
                                                : "bg-white text-warning-700"
                                        }`}
                                    >
                                        {product.stock} left
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center rounded-lg bg-slate-50 border border-dashed border-slate-200">
                            <CheckCircleIcon className="mx-auto h-10 w-10 text-success-400" />
                            <p className="mt-2 text-base font-medium text-slate-700">
                                All Clear!
                            </p>
                            <p className="text-sm text-slate-500">
                                No products are currently low on stock.
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Recent Products & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Products */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-slate-200"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                            <RectangleStackIcon className="h-5 w-5 mr-2 text-brand-500" />
                            Recent Products
                        </h2>
                        <button className="text-sm text-brand-600 hover:text-brand-800 font-medium transition duration-200 flex items-center">
                            <PlusCircleIcon className="h-4 w-4 mr-1" />
                            Add Product
                        </button>
                    </div>
                    {stats.recent_products.length > 0 ? (
                        <div className="overflow-x-auto -mx-4 px-4">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {stats.recent_products
                                        .slice(0, 5)
                                        .map((product) => (
                                            <tr
                                                key={product.id}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-3 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-9 w-9 bg-slate-100 rounded-md flex items-center justify-center">
                                                            <CubeIcon className="h-5 w-5 text-slate-400" />
                                                        </div>
                                                        <div className="ml-3">
                                                            <p
                                                                className="text-sm font-medium text-slate-800 line-clamp-1"
                                                                title={
                                                                    product.name
                                                                }
                                                            >
                                                                {product.name}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                ID: {product.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-700">
                                                    {product.category?.name ||
                                                        "Uncategorized"}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                                                    {formatCurrency(
                                                        product.price
                                                    )}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-700">
                                                    {product.stock}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            product.status ===
                                                            "available"
                                                                ? "bg-success-100 text-success-700"
                                                                : product.status ===
                                                                  "out_of_stock"
                                                                ? "bg-danger-100 text-danger-700"
                                                                : "bg-warning-100 text-warning-700"
                                                        }`}
                                                    >
                                                        {product.status.replace(
                                                            "_",
                                                            " "
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-16 text-center rounded-lg bg-slate-50 border border-dashed border-slate-200">
                            <ShoppingCartIcon className="mx-auto h-12 w-12 text-slate-300" />
                            <p className="mt-4 text-lg font-medium text-slate-600">
                                No Recent Products
                            </p>
                            <p className="text-sm text-slate-500">
                                Newly added products will appear here.
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="lg:col-span-1 bg-gradient-to-br from-brand-50 to-accent-50 rounded-2xl shadow-md p-6 border border-brand-100"
                >
                    <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center">
                        <SparklesIcon className="h-5 w-5 mr-2 text-brand-500" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all cursor-pointer">
                            <PlusCircleIcon className="h-7 w-7 text-brand-500 mb-3" />
                            <h3 className="text-sm font-medium text-slate-800">
                                Add Product
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Create a new product listing
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                            <UserGroupIcon className="h-7 w-7 text-blue-500 mb-3" />
                            <h3 className="text-sm font-medium text-slate-800">
                                Manage Users
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                View and edit user accounts
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
                            <TagIcon className="h-7 w-7 text-purple-500 mb-3" />
                            <h3 className="text-sm font-medium text-slate-800">
                                Categories
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Organize your product catalog
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer">
                            <ChartBarIcon className="h-7 w-7 text-teal-500 mb-3" />
                            <h3 className="text-sm font-medium text-slate-800">
                                Reports
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                View detailed analytics
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <h3 className="text-sm font-medium text-slate-800 mb-3 flex items-center">
                            <FireIcon className="h-4 w-4 text-warning-500 mr-1.5" />
                            Top Selling Products
                        </h3>
                        {stats.top_products && stats.top_products.length > 0 ? (
                            <div className="space-y-3">
                                {stats.top_products
                                    .slice(0, 3)
                                    .map((product, index) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center"
                                        >
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                                                <span className="text-xs font-semibold text-brand-600">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-800 truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {formatCurrency(
                                                        product.price
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">
                                No data available
                            </p>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* CSS for custom scrollbar */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
