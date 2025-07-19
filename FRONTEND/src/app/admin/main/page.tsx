'use client'
import { useState, useEffect } from 'react';
import { FaUser, FaRobot, FaCog, FaSignOutAlt, FaChartPie, FaCommentAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import UserManagement from '../userManagement/page';
import { logout } from "@/utils/logout";
import ChatSessionTable from '../chatbotManagement/page';
import KnowledgeUpload from '../difyUploadKnowledge/page';
import FeedbackManagement from '../feedbackManagement/page';
// import { Sidebar } from 'lucide-react';

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
                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 shadow-lg rounded-xl flex items-center space-x-4 text-white">
                            <FaUser className="text-4xl" />
                            <div>
                                <h2 className="text-lg font-semibold">Người dùng</h2>
                                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 shadow-lg rounded-xl flex items-center space-x-4 text-white">
                            <FaRobot className="text-4xl" />
                            <div>
                                <h2 className="text-lg font-semibold">Chatbots</h2>
                                <p className="text-2xl font-bold">{stats.totalChatSessions}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'Quản lý người dùng':
                return <UserManagement />;
            case 'Quản lý chatbot':
                return <ChatSessionTable />;
            case
                'Quản lý phản hồi':
                return <FeedbackManagement />;
            case 'Cài đặt':
                return (
                    <KnowledgeUpload />
                );
            default:
                return null;
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-72 bg-gradient-to-b from-blue-600 to-indigo-700 shadow-lg p-5 flex flex-col text-white">
                <h2 className="text-3xl font-bold mb-6">HealthSync</h2>
                <ul className="space-y-4">
                    {['Dashboard', 'Quản lý người dùng', 'Quản lý chatbot', 'Quản lý phản hồi', 'Cài đặt'].map((page) => (
                        <li
                            key={page}
                            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${activePage === page ? 'bg-white text-blue-600 shadow-lg' : 'hover:bg-blue-500'}`}
                            onClick={() => setActivePage(page)}
                        >
                            {page === 'Dashboard' && <FaChartPie className="text-xl" />}
                            {page === 'Quản lý người dùng' && <FaUser className="text-xl" />}
                            {page === 'Quản lý chatbot' && <FaRobot className="text-xl" />}
                            {page === 'Quản lý phản hồi' && <FaCommentAlt className="text-xl" />}
                            {page === 'Cài đặt' && <FaCog className="text-xl" />}
                            <span className="text-lg font-semibold">{page}</span>
                        </li>
                    ))}
                </ul>
                <div className="text-gray-600">
                    <button
                        onClick={logout}
                        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                    >
                        <FaSignOutAlt className="mr-2" /> Đăng xuất
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col p-6">
                <header className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-700">{activePage}</h1>
                </header>
                <main className="flex-1 p-6 bg-white shadow-lg rounded-lg mt-4">
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