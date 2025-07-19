"use client";
import { useState, useEffect } from "react";

interface ChatSession {
    id: number;
    user_id: number;
    chatbot_id: number;
    full_name: string;
    chatbot_name: string;
    start_time: string;
    end_time: string | null;
    status: "active" | "ended" | "error";
}

interface Message {
    id: number;
    session_id: number;
    content: string;
    role: "user" | "assistant";
    created_at: string;
}

const ChatSessionTable: React.FC = () => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

    useEffect(() => {
        const fetchChatSessions = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/chat-sessions/admin/chat_sessionsList");
                const data = await response.json();

                if (Array.isArray(data)) {
                    setSessions(data);
                } else {
                    console.error("Dữ liệu nhận được không phải là mảng:", data);
                    setSessions([]);
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
                setSessions([]);
            }
        };

        fetchChatSessions();
    }, []);

    const handleViewDetail = async (sessionId: number) => {
        try {
            const res = await fetch(`http://localhost:4000/api/admin/detail/${sessionId}`);
            const data = await res.json();
            console.log("Chi tiết tin nhắn:", data); // GHI NHỚ: kiểm tra log này
            setMessages(data);
            setSelectedSessionId(sessionId);
            setShowModal(true);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết tin nhắn:", error);
        }
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <div className="overflow-y-auto max-h-[495px]">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Người dùng</th>
                            <th className="border p-2">Chatbot</th>
                            <th className="border p-2">Bắt đầu</th>
                            <th className="border p-2">Kết thúc</th>
                            <th className="border p-2">Trạng thái</th>
                            <th className="border p-2">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(sessions) && sessions.length > 0 ? (
                            sessions.map((session) => (
                                <tr key={session.id} className="hover:bg-gray-100">
                                    <td className="border p-2 text-center">{session.id}</td>
                                    <td className="border p-2">{session.full_name}</td>
                                    <td className="border p-2">{session.chatbot_name}</td>
                                    <td className="border p-2">{new Date(session.start_time).toLocaleString()}</td>
                                    <td className="border p-2">
                                        {session.end_time ? new Date(session.end_time).toLocaleString() : "Đang diễn ra"}
                                    </td>
                                    <td className={`border p-2 text-center font-bold ${session.status === "active" ? "text-green-500" : "text-red-500"}`}>
                                        {session.status}
                                    </td>
                                    <td className="border p-2 text-center">
                                        <button
                                            onClick={() => handleViewDetail(session.id)}
                                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="border p-4 text-center">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal hiển thị tin nhắn */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-[90%] max-w-2xl p-4 shadow-lg max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Lịch sử tin nhắn (Phiên #{selectedSessionId})</h2>
                        <div className="space-y-3">
                            {messages.length > 0 ? (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`p-3 rounded ${msg.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}
                                    >
                                        <div className="text-sm text-gray-600 mb-1">
                                            <strong>{msg.role === "user" ? "Người dùng" : "Chatbot"}</strong> lúc{" "}
                                            {new Date(msg.created_at).toLocaleString()}
                                        </div>
                                        <div>{msg.content}</div>
                                    </div>
                                ))
                            ) : (
                                <p>Không có tin nhắn nào.</p>
                            )}
                        </div>
                        <div className="mt-6 text-right">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => setShowModal(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatSessionTable;
