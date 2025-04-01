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

const ChatSessionTable: React.FC = () => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);

    useEffect(() => {
        const fetchChatSessions = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/chat-sessions/admin/chat_sessionsList");
                const data = await response.json();

                console.log("Dữ liệu từ API:", data); // Kiểm tra dữ liệu trong console

                if (Array.isArray(data)) {
                    setSessions(data); // Nếu dữ liệu là mảng, cập nhật state
                } else {
                    console.error("Dữ liệu nhận được không phải là mảng:", data);
                    setSessions([]); // Nếu không phải mảng, đặt giá trị mặc định
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
                setSessions([]); // Đảm bảo luôn là mảng
            }
        };


        fetchChatSessions();
    }, []);

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Danh sách phiên chat</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Người dùng</th>
                        <th className="border p-2">Chatbot</th>
                        <th className="border p-2">Bắt đầu</th>
                        <th className="border p-2">Kết thúc</th>
                        <th className="border p-2">Trạng thái</th>
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
                                <td
                                    className={`border p-2 text-center font-bold ${session.status === "active" ? "text-green-500" : "text-red-500"
                                        }`}
                                >
                                    {session.status}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="border p-4 text-center">
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>
        </div>
    );
};

export default ChatSessionTable;
