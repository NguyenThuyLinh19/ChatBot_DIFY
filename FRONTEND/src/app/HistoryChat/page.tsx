"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

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

    useEffect(() => {
        fetchSessions();
    }, [userId, token]);

    const fetchSessions = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/chat-sessions/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(res)

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
        <div className="bg-gray-100 p-4 overflow-y-auto h-screen fixed top-0 left-0 w-72 shadow-md border-r border-gray-300">
            <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
                <span className="text-gray-700">Lịch sử trò chuyện</span>
                <button
                    onClick={handleCreateSession}
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    title="Thêm phiên chat"
                >
                    <Plus size={18} />
                </button>
            </h2>
            {loading ? (
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
            )}
        </div>
    );
}
