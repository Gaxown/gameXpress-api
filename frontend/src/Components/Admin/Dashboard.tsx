import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import { useAuth } from "../../context/AuthContext";
import {
    AreaChart,
    Area,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    RadialBarChart,
    RadialBar,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from "recharts";
import {
    Squares2X2Icon,
    TagIcon,
    UsersIcon,
    ExclamationCircleIcon,
    ArrowTrendingUpIcon,
    BellAlertIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    ShoppingCartIcon,
    ChartBarIcon,
    CheckBadgeIcon,
    ExclamationTriangleIcon,
    DocumentTextIcon,
} from "@heroicons/react/24/outline";

// Keep existing interfaces
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
}

interface DashboardStats {
    total_products: number;
    total_categories: number;
    total_users: number;
    low_stock_products: number;
    out_of_stock_products: number;
    recent_products: Product[];
    stock_alerts: Product[];
}

// Helper functions
const formatNumber = (num: number): string => {
    return num.toLocaleString("en-US");
};

const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
};

// New StatCard component with updated design
const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    bgColor: string;
    textColor: string;
    trend?: string;
    trendUp?: boolean;
}> = ({ title, value, icon: Icon, bgColor, textColor, trend, trendUp }) => {
    return (
        <div
            className={`relative overflow-hidden rounded-xl shadow-lg ${bgColor} p-6`}
        >
            <div className="absolute right-0 top-0 opacity-20">
                <Icon className="h-24 w-24 -mr-6 -mt-6" />
            </div>
            <h3 className="text-sm font-medium uppercase tracking-wider opacity-80">
                {title}
            </h3>
            <p className={`text-3xl font-bold mt-1 ${textColor}`}>{value}</p>
        </div>
    );
};

// New component for product card
const ProductCard: React.FC<{
    product: Product;
    variant: "recent" | "alert";
}> = ({ product, variant }) => {
    const isAlert = variant === "alert";
    const criticalStock = product.stock <= 5;

    return (
        <div
            className={`rounded-lg border p-4 transition-all duration-300 ${
                isAlert
                    ? criticalStock
                        ? "border-red-200 bg-red-50 hover:shadow-red-100"
                        : "border-amber-200 bg-amber-50 hover:shadow-amber-100"
                    : "border-indigo-100 bg-white hover:shadow-indigo-100"
            } hover:shadow-lg`}
        >
            <div className="flex items-center gap-4">
                <div
                    className={`rounded-full p-3 ${
                        isAlert
                            ? criticalStock
                                ? "bg-red-100 text-red-600"
                                : "bg-amber-100 text-amber-600"
                            : "bg-indigo-100 text-indigo-600"
                    }`}
                >
                    {isAlert ? (
                        <ExclamationCircleIcon className="h-5 w-5" />
                    ) : (
                        <ShoppingBagIcon className="h-5 w-5" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4
                        className="font-semibold text-gray-800 truncate"
                        title={product.name}
                    >
                        {truncateText(product.name, 24)}
                    </h4>
                    <div className="flex text-xs text-gray-500 gap-2 mt-1">
                        <span className="flex items-center">
                            <TagIcon className="h-3 w-3 mr-1" />
                            {product.category?.name || "Uncategorized"}
                        </span>
                        {!isAlert && (
                            <span className="flex items-center">
                                <span className="font-medium">
                                    ${product.price.toFixed(2)}
                                </span>
                            </span>
                        )}
                        {isAlert && (
                            <div
                                className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                                    criticalStock
                                        ? "bg-red-100 text-red-700"
                                        : "bg-amber-100 text-amber-700"
                                }`}
                            >
                                Stock: {product.stock}
                            </div>
                        )}
                        {!isAlert && (
                            <div
                                className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                                    product.status === "available"
                                        ? "bg-green-100 text-green-700"
                                        : product.status === "out_of_stock"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-amber-100 text-amber-700"
                                }`}
                            >
                                {product.status.replace("_", " ")}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// New sidebar component
const Sidebar: React.FC<{ active: string }> = ({ active }) => {
    const navItems = [
        { name: "Dashboard", icon: Squares2X2Icon, active: true },
        { name: "Products", icon: ShoppingBagIcon, active: false },
        { name: "Orders", icon: ShoppingCartIcon, active: false },
        { name: "Customers", icon: UsersIcon, active: false },
        { name: "Reports", icon: DocumentTextIcon, active: false },
        { name: "Settings", icon: Cog6ToothIcon, active: false },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900 fixed left-0 top-0 text-white">
            <div className="p-5">
                <h1 className="text-2xl font-bold text-center mb-8">
                    <span className="bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
                        GameXpress
                    </span>
                </h1>
                <div className="space-y-6">
                    <div className="space-y-2">
                        {navItems.map((item) => (
                            <div
                                key={item.name}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                    item.name === active
                                        ? "bg-indigo-600 text-white"
                                        : "hover:bg-gray-800"
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.name}</span>
                                {item.name === active && (
                                    <div className="ml-auto h-2 w-2 rounded-full bg-white"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <hr className="border-gray-700" />

                    <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-800">
                            <UserCircleIcon className="h-5 w-5" />
                            <span>Profile</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-800 text-red-400">
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            <span>Logout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Dashboard Component
const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get<DashboardStats>(
                    "/admin/dashboard"
                );
                setStats(response.data);
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

    // Loading state with new design
    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar active="Dashboard" />
                <div className="ml-64 w-full p-8">
                    <div className="flex items-center justify-center h-[80vh]">
                        <div className="text-center">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                            <p className="mt-4 text-lg font-medium text-gray-600">
                                Loading dashboard data...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state with new design
    if (error) {
        return (
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar active="Dashboard" />
                <div className="ml-64 w-full p-8">
                    <div className="flex items-center justify-center h-[80vh]">
                        <div className="max-w-md text-center p-8 bg-white rounded-lg shadow-lg border border-red-200">
                            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100">
                                <ExclamationTriangleIcon className="h-10 w-10 text-red-500" />
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-gray-800">
                                Error Loading Dashboard
                            </h2>
                            <p className="mt-2 text-gray-600">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // No data state with new design
    if (!stats) {
        return (
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar active="Dashboard" />
                <div className="ml-64 w-full p-8">
                    <div className="flex items-center justify-center h-[80vh]">
                        <div className="max-w-md text-center p-8 bg-white rounded-lg shadow-lg">
                            <ShoppingBagIcon className="mx-auto h-16 w-16 text-gray-400" />
                            <h2 className="mt-4 text-xl font-bold text-gray-800">
                                No Dashboard Data
                            </h2>
                            <p className="mt-2 text-gray-600">
                                We couldn't find any data to display. Please
                                check back later or add some products to your
                                store.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate derived data
    const inStockCount = Math.max(
        0,
        stats.total_products -
            stats.low_stock_products -
            stats.out_of_stock_products
    );

    // Sample data for new chart types (using real data where possible)
    const stockStatus = [
        { name: "In Stock", value: inStockCount, fill: "#10B981" },
        { name: "Low Stock", value: stats.low_stock_products, fill: "#F59E0B" },
        {
            name: "Out of Stock",
            value: stats.out_of_stock_products,
            fill: "#EF4444",
        },
    ];

    // Weekly sales data (sample data)
    const weeklySales = [
        { name: "Mon", sales: 4000 },
        { name: "Tue", sales: 3000 },
        { name: "Wed", sales: 5000 },
        { name: "Thu", sales: 2780 },
        { name: "Fri", sales: 1890 },
        { name: "Sat", sales: 6390 },
        { name: "Sun", sales: 3490 },
    ];

    // Performance data (sample)
    const performance = [
        { subject: "Sales", A: 120, B: 110, fullMark: 150 },
        { subject: "Products", A: 98, B: 130, fullMark: 150 },
        { subject: "Marketing", A: 86, B: 130, fullMark: 150 },
        { subject: "Support", A: 99, B: 100, fullMark: 150 },
        { subject: "R&D", A: 85, B: 90, fullMark: 150 },
        { subject: "Admin", A: 65, B: 85, fullMark: 150 },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar active="Dashboard" />
            <div className="ml-64 w-full p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Dashboard Overview
                        </h1>
                        <p className="text-gray-600">
                            Welcome back,{" "}
                            <span className="font-medium text-indigo-600">
                                {user?.name || "Admin"}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <BellAlertIcon className="h-6 w-6 text-gray-500" />
                            {stats.stock_alerts.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                    {stats.stock_alerts.length > 9
                                        ? "9+"
                                        : stats.stock_alerts.length}
                                </span>
                            )}
                        </div>
                        <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            {user?.name?.charAt(0) || "A"}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Products"
                        value={formatNumber(stats.total_products)}
                        icon={ShoppingBagIcon}
                        bgColor="bg-gradient-to-br from-indigo-500 to-purple-600"
                        textColor="text-white"
                        trend="12%"
                        trendUp={true}
                    />
                    <StatCard
                        title="Total Categories"
                        value={formatNumber(stats.total_categories)}
                        icon={TagIcon}
                        bgColor="bg-gradient-to-br from-cyan-500 to-blue-600"
                        textColor="text-white"
                        trend="5%"
                        trendUp={true}
                    />
                    <StatCard
                        title="User Accounts"
                        value={formatNumber(stats.total_users)}
                        icon={UsersIcon}
                        bgColor="bg-gradient-to-br from-orange-500 to-amber-600"
                        textColor="text-white"
                        trend="3%"
                        trendUp={true}
                    />
                    <StatCard
                        title="Stock Alerts"
                        value={formatNumber(
                            stats.low_stock_products +
                                stats.out_of_stock_products
                        )}
                        icon={ExclamationCircleIcon}
                        bgColor="bg-gradient-to-br from-red-500 to-rose-600"
                        textColor="text-white"
                        trend="8%"
                        trendUp={false}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Weekly Sales */}

                    {/* Performance Radar Chart */}
                </div>

                {/* Product Sections & Stock Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Stock Distribution */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Stock Distribution
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={stockStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stockStatus.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.fill}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => [
                                        `${value} products`,
                                        "",
                                    ]}
                                    contentStyle={{
                                        borderRadius: "0.5rem",
                                        boxShadow:
                                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                        border: "none",
                                    }}
                                />
                                <Legend
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                    wrapperStyle={{ paddingLeft: "10px" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recent Products */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Recent Products
                            </h2>
                            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                                View All
                            </button>
                        </div>

                        <div className="space-y-3">
                            {stats.recent_products.length > 0 ? (
                                stats.recent_products
                                    .slice(0, 3)
                                    .map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            variant="recent"
                                        />
                                    ))
                            ) : (
                                <div className="text-center py-10">
                                    <CheckBadgeIcon className="mx-auto h-10 w-10 text-gray-400" />
                                    <p className="mt-2 text-gray-600">
                                        No recent products added
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stock Alerts */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Stock Alerts
                            </h2>
                            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                                Manage Stock
                            </button>
                        </div>

                        <div className="space-y-3">
                            {stats.stock_alerts.length > 0 ? (
                                stats.stock_alerts
                                    .slice(0, 3)
                                    .map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            variant="alert"
                                        />
                                    ))
                            ) : (
                                <div className="text-center py-10">
                                    <CheckBadgeIcon className="mx-auto h-10 w-10 text-green-500" />
                                    <p className="mt-2 text-gray-600">
                                        All stock levels are normal
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
