import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../lib/axios";
import NotificationsDropdown from "./NotificationsDropdown";
import { motion, AnimatePresence } from "framer-motion";
import {
    BellIcon,
    ChartBarIcon,
    ShoppingBagIcon,
    TagIcon,
    UsersIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    ChevronDownIcon,
    ViewColumnsIcon,
    CubeIcon,
    PhotoIcon,
    ShieldCheckIcon,
    MagnifyingGlassIcon,
    QuestionMarkCircleIcon,
    SparklesIcon,
    Squares2X2Icon,
    ArrowTrendingUpIcon,
    RocketLaunchIcon,
    UserCircleIcon,
    TrophyIcon,
    ChartPieIcon,
    DocumentTextIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const notificationRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const response = await api.get("/admin/notifications?page=1");
            setNotifications(response.data.data || []);
            setUnreadCount(
                response.data.data?.filter((n: any) => !n.read_at).length || 0
            );
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setNotificationsOpen(false);
            }
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setSearchFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notificationRef, searchRef]);

    // Close mobile sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const handleMarkAsRead = async (id: string) => {
        try {
            await api.patch(`/admin/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    // Check if a menu item or its children are active
    const isMenuActive = (path: string) => {
        if (path === "/admin" && location.pathname === "/admin") {
            return true;
        }
        return path !== "/admin" && location.pathname.includes(path);
    };

    const navItems = [
        {
            name: "Dashboard",
            icon: ChartBarIcon,
            href: "/admin",
            current: location.pathname === "/admin",
        },
        {
            name: "Products",
            icon: ShoppingBagIcon,
            href: "#",
            current: location.pathname.includes("/admin/products"),
            hasSubmenu: true,
            submenuItems: [
                {
                    name: "All Products",
                    href: "/admin/products",
                    current: location.pathname === "/admin/products",
                },
                {
                    name: "Add Product",
                    href: "/admin/products/add",
                    current: location.pathname === "/admin/products/add",
                },
                {
                    name: "Product Images",
                    href: "/admin/products/images",
                    current: location.pathname === "/admin/products/images",
                },
            ],
        },
        {
            name: "Categories",
            icon: TagIcon,
            href: "/admin/categories",
            current: location.pathname.includes("/admin/categories"),
        },
        {
            name: "Users",
            icon: UsersIcon,
            href: "/admin/users",
            current: location.pathname.includes("/admin/users"),
        },
        {
            name: "Analytics",
            icon: ChartPieIcon,
            href: "#",
            current: location.pathname.includes("/admin/analytics"),
            hasSubmenu: true,
            submenuItems: [
                {
                    name: "Sales Report",
                    href: "/admin/analytics/sales",
                    current: location.pathname === "/admin/analytics/sales",
                },
                {
                    name: "User Trends",
                    href: "/admin/analytics/users",
                    current: location.pathname === "/admin/analytics/users",
                },
                {
                    name: "Product Performance",
                    href: "/admin/analytics/products",
                    current: location.pathname === "/admin/analytics/products",
                },
            ],
        },
        {
            name: "Settings",
            icon: Cog6ToothIcon,
            href: "/home",
            current: location.pathname.includes("/admin/settings"),
        },
    ];

    const quickLinks = [
        { name: "Store Front", icon: HomeIcon, href: "/" },
        { name: "Add Product", icon: CubeIcon, href: "/admin/products/add" },
        {
            name: "Manage Images",
            icon: PhotoIcon,
            href: "/admin/products/images",
        },
        { name: "Documentation", icon: DocumentTextIcon, href: "#" },
    ];

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleSubmenu = (name: string) => {
        setExpandedMenu(expandedMenu === name ? null : name);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-40">
                <button
                    onClick={toggleSidebar}
                    className="rounded-full p-2 bg-white shadow-md text-slate-700 hover:bg-brand-50 transition-colors duration-200"
                >
                    {sidebarOpen ? (
                        <XMarkIcon className="h-6 w-6" />
                    ) : (
                        <Bars3Icon className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Top header (right side of sidebar) */}
            <div
                className="hidden lg:flex fixed top-0 right-0 h-16 bg-white shadow-sm border-b border-slate-100 z-20"
                style={{ left: "280px" }}
            >
                <div className="flex-1 flex items-center justify-between px-6">
                    {/* Search bar */}
                    <div ref={searchRef} className="max-w-md w-64 relative">
                        <div
                            className={`flex items-center rounded-lg border ${
                                searchFocused
                                    ? "border-brand-400 bg-white shadow-md"
                                    : "border-slate-200 bg-slate-50"
                            } transition-all duration-200`}
                        >
                            <div className="pl-3">
                                <MagnifyingGlassIcon
                                    className={`h-5 w-5 ${
                                        searchFocused
                                            ? "text-brand-500"
                                            : "text-slate-400"
                                    }`}
                                />
                            </div>
                            <input
                                type="text"
                                className="p-2 bg-transparent border-none focus:ring-0 text-sm w-full"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                            />
                        </div>

                        {/* Search results (only shown when focused and has query) */}
                        <AnimatePresence>
                            {searchFocused && searchQuery.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-slate-200 p-3 z-50"
                                >
                                    <div className="text-xs font-medium text-slate-500 mb-2">
                                        Recent Searches
                                    </div>
                                    <div className="space-y-1">
                                        <div
                                            className="p-2 hover:bg-slate-50 rounded-md cursor-pointer flex items-center text-sm text-slate-700"
                                            onClick={() =>
                                                navigate("/admin/products")
                                            }
                                        >
                                            <ShoppingBagIcon className="h-4 w-4 mr-2 text-slate-400" />
                                            <span>Products</span>
                                        </div>
                                        <div
                                            className="p-2 hover:bg-slate-50 rounded-md cursor-pointer flex items-center text-sm text-slate-700"
                                            onClick={() =>
                                                navigate("/admin/users")
                                            }
                                        >
                                            <UsersIcon className="h-4 w-4 mr-2 text-slate-400" />
                                            <span>Users</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Help button */}
                        <button className="p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors">
                            <QuestionMarkCircleIcon className="h-6 w-6" />
                        </button>

                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() =>
                                    setNotificationsOpen(!notificationsOpen)
                                }
                                className="relative p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors"
                                id="notifications-menu-button"
                                aria-expanded={notificationsOpen}
                                aria-haspopup="true"
                            >
                                <span className="sr-only">
                                    View notifications
                                </span>
                                <BellIcon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                                )}
                            </button>
                            {notificationsOpen && (
                                <NotificationsDropdown
                                    notifications={notifications}
                                    onMarkAsRead={handleMarkAsRead}
                                    onClose={() => setNotificationsOpen(false)}
                                />
                            )}
                        </div>

                        {/* User profile - desktop only */}
                        <div className="hidden md:flex items-center">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-r from-brand-500 to-brand-700 flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="ml-2">
                                <p className="text-sm font-medium text-slate-800 line-clamp-1">
                                    {user?.name || "Admin User"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar backdrop */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm lg:hidden z-30"
                        onClick={() => setSidebarOpen(false)}
                    ></motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 bg-white border-r border-slate-100 w-72 lg:w-[280px] shadow-xl lg:shadow-md overflow-hidden`}
            >
                {/* Logo area */}
                <div className="p-6 flex items-center justify-center border-b border-slate-100">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-2 rounded-xl shadow-md">
                            <ViewColumnsIcon className="h-7 w-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 ml-3 tracking-tight">
                            GameXpress
                        </h1>
                    </div>
                </div>

                {/* Sidebar content with scrolling */}
                <div className="overflow-y-auto h-[calc(100vh-13rem)]">
                    {/* Main navigation */}
                    <nav className="mt-4">
                        <div className="px-4 mb-3">
                            <h2 className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Main Menu
                            </h2>
                        </div>
                        <div className="px-3 space-y-1">
                            {navItems.map((item) => (
                                <div key={item.name}>
                                    {item.hasSubmenu ? (
                                        <div>
                                            <button
                                                onClick={() =>
                                                    toggleSubmenu(item.name)
                                                }
                                                className={`w-full flex justify-between items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                                                    isMenuActive(item.href)
                                                        ? "bg-brand-50 text-brand-700"
                                                        : "text-slate-700 hover:bg-slate-50"
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <item.icon
                                                        className={`h-5 w-5 mr-3 ${
                                                            isMenuActive(
                                                                item.href
                                                            )
                                                                ? "text-brand-500"
                                                                : "text-slate-500"
                                                        }`}
                                                    />
                                                    <span>{item.name}</span>
                                                </div>
                                                <ChevronDownIcon
                                                    className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                                                        expandedMenu ===
                                                        item.name
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                />
                                            </button>
                                            <AnimatePresence>
                                                {expandedMenu === item.name && (
                                                    <motion.div
                                                        initial={{
                                                            opacity: 0,
                                                            height: 0,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            height: "auto",
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            height: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.2,
                                                        }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="ml-10 space-y-1 mt-1 mb-2">
                                                            {item.submenuItems?.map(
                                                                (subitem) => (
                                                                    <Link
                                                                        key={
                                                                            subitem.name
                                                                        }
                                                                        to={
                                                                            subitem.href
                                                                        }
                                                                        className={`group flex items-center px-3 py-2 text-sm rounded-lg ${
                                                                            subitem.current
                                                                                ? "bg-brand-50 text-brand-700 font-medium"
                                                                                : "text-slate-600 hover:bg-slate-50"
                                                                        }`}
                                                                    >
                                                                        <div
                                                                            className={`w-1.5 h-1.5 rounded-full mr-3 ${
                                                                                subitem.current
                                                                                    ? "bg-brand-500"
                                                                                    : "bg-slate-300 group-hover:bg-slate-400"
                                                                            }`}
                                                                        ></div>
                                                                        {
                                                                            subitem.name
                                                                        }
                                                                    </Link>
                                                                )
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <Link
                                            to={item.href}
                                            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                                                item.current
                                                    ? "bg-brand-50 text-brand-700"
                                                    : "text-slate-700 hover:bg-slate-50"
                                            }`}
                                        >
                                            <item.icon
                                                className={`h-5 w-5 mr-3 ${
                                                    item.current
                                                        ? "text-brand-500"
                                                        : "text-slate-500"
                                                }`}
                                            />
                                            {item.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Quick Links */}
                        <div className="mt-8 px-4">
                            <h2 className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Quick Links
                            </h2>
                            <div className="mt-3 px-3">
                                {quickLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <link.icon className="h-5 w-5 mr-3 text-slate-500" />
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Pro features promo */}
                        <div className="mx-6 mt-8">
                            <div className="rounded-xl bg-gradient-to-br from-brand-50 to-purple-50 p-5 border border-brand-100">
                                <RocketLaunchIcon className="h-7 w-7 text-brand-500 mb-2" />
                                <h3 className="text-sm font-semibold text-slate-800">
                                    Upgrade to Pro
                                </h3>
                                <p className="text-xs text-slate-600 mt-1 mb-3">
                                    Get advanced analytics and premium features
                                </p>
                                <button className="w-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center">
                                    Learn More
                                    <ArrowRightIcon className="h-3.5 w-3.5 ml-1.5" />
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* User profile section */}
                <div className="absolute bottom-0 w-full border-t border-slate-100 bg-white p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-brand-500 to-brand-700 flex items-center justify-center text-white font-semibold shadow-sm">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <span className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-slate-800 truncate max-w-[9rem]">
                                    {user?.name || "Admin User"}
                                </p>
                                <p className="text-xs text-slate-500 truncate flex items-center">
                                    <ShieldCheckIcon className="h-3 w-3 mr-1" />
                                    {user?.roles?.[0]?.name || "Admin"}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <Link
                                to="/admin/settings/profile"
                                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                                title="Profile settings"
                            >
                                <Cog6ToothIcon className="h-5 w-5" />
                            </Link>
                            <button
                                onClick={logout}
                                className="rounded-full p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                title="Sign out"
                            >
                                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-[280px] min-h-screen pt-0 lg:pt-16">
                <main className="min-h-[calc(100vh-4rem)]">
                    <Outlet />
                </main>
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
        </div>
    );
};

export default AdminLayout;
