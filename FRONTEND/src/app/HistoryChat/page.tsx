"use client";
import { useEffect, useState } from "react";
import { Menu, Plus, Trash2, X } from "lucide-react";

interface Session {
    id: number;
    user_id: number;
    chatbot_id: number;
    start_time: string;
    end_time: string | null;
    status: string;
}

interface HistoryChatProps {
    token: string;
    userId: string;
    onSelectSession: (sessionId: number) => void;
}

export default function ChatSessions({ token, userId, onSelectSession }: HistoryChatProps) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(true); // Kiểm soát sidebar mở/đóng

    useEffect(() => {
        fetchSessions();
    }, [userId, token]);

    const fetchSessions = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/chat-sessions/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            }

            const data = await res.json();
            setSessions(data || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phiên chat:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSession = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/chat-sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id: userId, chatbot_id: 1 }),
            });

            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            }

            fetchSessions();
        } catch (error) {
            console.error("Lỗi khi tạo phiên chat:", error);
        }
    };

    const handleDeleteSession = async (sessionId: number) => {
        try {
            const res = await fetch(`http://localhost:4000/api/chat-sessions/${sessionId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            }

            setSessions((prev) => prev.filter((session) => session.id !== sessionId));
        } catch (error) {
            console.error("Lỗi khi xóa phiên chat:", error);
        }
    };

    return (
        <div
            className={`fixed top-0 left-0 h-screen shadow-md border-r border-gray-300 bg-gray-100 transition-all ${isOpen ? "w-72 p-4" : "w-14 p-2"
                }`}
        >
            {/* Nút menu để đóng/mở sidebar */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
                    title={isOpen ? "Đóng sidebar" : "Mở sidebar"}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Chỉ hiển thị tiêu đề khi sidebar mở */}
                {isOpen && <h2 className="text-lg font-semibold text-gray-700">Lịch sử trò chuyện</h2>}
            </div>

            {/* Nút thêm mới, chỉ hiển thị khi sidebar mở */}
            {isOpen && (
                <button
                    onClick={handleCreateSession}
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition w-full mb-4"
                    title="Thêm phiên chat"
                >
                    <Plus size={18} className="inline-block mr-2" /> Thêm phiên chat
                </button>
            )}

            {/* Danh sách phiên chat */}
            {isOpen ? (
                loading ? (
                    <p className="text-gray-500">Đang tải...</p>
                ) : sessions.length === 0 ? (
                    <p className="text-gray-500">Không có phiên chat nào.</p>
                ) : (
                    <ul className="space-y-2">
                        {sessions.map((session) => (
                            <li
                                key={session.id}
                                className="p-3 bg-white rounded-md shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => onSelectSession(session.id)}
                            >
                                <span className="flex-1">
                                    🗂 Phiên {session.id} - {new Date(session.start_time).toLocaleString()}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSession(session.id);
                                    }}
                                    className="text-red-500 hover:text-red-700 transition"
                                    title="Xóa phiên chat"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )
            ) : (
                <p className="text-gray-500 text-center">Mở menu để xem</p>
            )}
        </div>
    );
}
