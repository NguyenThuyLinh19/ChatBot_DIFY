'use client'
import { useState, useEffect } from 'react';
import { FaUser, FaRobot, FaCog, FaSignOutAlt, FaChartPie } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import UserManagement from '../userManagement/page';
import { logout } from "@/utils/logout";

const AdminDashboard = () => {
    const [activePage, setActivePage] = useState('Dashboard');
    const [stats, setStats] = useState({ totalUsers: 0, totalChatSessions: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/admin/stats');
                if (!response.ok) {
                    throw new Error(`Lỗi HTTP: ${response.status}`);
                }
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.log('Lỗi khi lấy dữ liệu: ', error);
            }
        };
        fetchStats();
    }, []);

    const renderContent = () => {
        switch (activePage) {
            case 'Dashboard':
                return (
                    <div>

                        <div className="grid grid-cols-2 gap-6 mt-6">
                            <div className="bg-white p-6 shadow-lg rounded-lg flex items-center space-x-4">
                                <FaUser className="text-blue-500 text-3xl" />
                                <div>
                                    <h2 className="text-lg font-semibold">Người dùng</h2>
                                    <p className="text-gray-600 text-xl font-bold">{stats.totalUsers}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 shadow-lg rounded-lg flex items-center space-x-4">
                                <FaRobot className="text-green-500 text-3xl" />
                                <div>
                                    <h2 className="text-lg font-semibold">Chatbots</h2>
                                    <p className="text-gray-600 text-xl font-bold">{stats.totalChatSessions}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Quản lý người dùng':
                return <UserManagement />;
            case 'Quản lý chatbot':
                return <p className="text-gray-600">Trang quản lý chatbot.</p>;
            case 'Cài đặt':
                return <p className="text-gray-600">Trang cài đặt hệ thống.</p>;
            default:
                return null;
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg p-5 flex flex-col">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Admin Panel</h2>
                <ul className="space-y-4">
                    {['Dashboard', 'Quản lý người dùng', 'Quản lý chatbot', 'Cài đặt'].map((page) => (
                        <li
                            key={page}
                            className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer ${activePage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                            onClick={() => setActivePage(page)}
                        >
                            {page === 'Dashboard' && <FaChartPie />}
                            {page === 'Quản lý người dùng' && <FaUser />}
                            {page === 'Quản lý chatbot' && <FaRobot />}
                            {page === 'Cài đặt' && <FaCog />}
                            <span>{page}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-700">{activePage}</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        <FaSignOutAlt className="mr-2" /> Đăng xuất
                    </button>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 bg-white shadow-lg rounded-lg">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePage}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;

