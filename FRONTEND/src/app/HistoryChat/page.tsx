"use client";
import { useEffect, useState, useRef } from "react";
import { Menu, MoreVertical, Plus, Trash2, X, Edit3 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export default function ChatSessions({ token, userId, onSelectSession, isOpen, setIsOpen }: HistoryChatProps) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteSessionId, setDeleteSessionId] = useState<number | null>(null);
    const hasCreatedSession = useRef(false);

    useEffect(() => {
        if (userId && token) {
            fetchOrCreateSession();
        }
    }, [userId, token]); // Gọi khi userId hoặc token thay đổi


    useEffect(() => {
        if (userId && token) {
            fetchSessions(); //Gọi lại khi user thay đổi để cập nhật danh sách
        }
    }, [userId]);


    const fetchOrCreateSession = async () => {
        if (hasCreatedSession.current) return; // Ngăn gọi API nhiều lần
        hasCreatedSession.current = true; // Đánh dấu đã tạo phiên

        try {
            const res = await fetch(`http://localhost:4000/api/chat-sessions/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const sessions = await res.json();
            if (sessions.length > 0) {
                // Nếu có phiên chat, chọn phiên mới nhất
                onSelectSession(sessions[0].id);
            } else {
                // Nếu không có, tạo phiên mới
                const newSessionRes = await fetch("http://localhost:4000/api/chat-sessions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ user_id: userId, chatbot_id: 1 }),
                });

                const newSession = await newSessionRes.json();
                onSelectSession(newSession.id);
            }

            fetchSessions(); // Cập nhật danh sách phiên chat
        } catch (error) {
            console.error("Lỗi khi lấy hoặc tạo phiên chat:", error);
        }
    };


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

            const newSession = await res.json(); //Lấy phiên chat mới
            onSelectSession(newSession.id); //Chuyển khung chat sang phiên mới
            fetchSessions(); //Cập nhật danh sách phiên chat
        } catch (error) {
            console.error("Lỗi khi tạo phiên chat:", error);
        }
    };

    const confirmDeleteSession = (sessionId: number) => {
        setDeleteSessionId(sessionId);
    };

    const handleDeleteSession = async () => {
        if (deleteSessionId === null) return;
        try {
            const res = await fetch(`http://localhost:4000/api/chat-sessions/${deleteSessionId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            }
            fetchSessions(); // 🔥 Cập nhật danh sách sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa phiên chat:", error);
        } finally {
            setDeleteSessionId(null);
        }
    };


    return (
        <div className={`fixed top-0 left-0 h-screen shadow-md border-r border-gray-300 bg-gray-100 transition-all duration-300 ${isOpen ? "w-72 p-4" : "w-14 p-2"}`}>
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
                    title={isOpen ? "Đóng sidebar" : "Mở sidebar"}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                {isOpen && <h2 className="text-lg font-semibold text-gray-700">Lịch sử trò chuyện</h2>}
            </div>

            {isOpen && (
                <button
                    onClick={handleCreateSession}
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition w-full mb-4"
                    title="Thêm phiên chat"
                >
                    <Plus size={18} className="inline-block mr-2" /> Thêm phiên chat
                </button>
            )}

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
                                    Chat {session.id} - {new Date(session.start_time).toLocaleString()}
                                </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-2 hover:bg-gray-200 rounded-full">
                                            <MoreVertical size={18} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            alert("Chức năng đổi tên chưa được triển khai!");
                                        }}>
                                            <Edit3 size={16} className="mr-2" /> Đổi tên
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            confirmDeleteSession(session.id);
                                        }} className="text-red-500">
                                            <Trash2 size={16} className="mr-2" /> Xóa
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </li>
                        ))}
                    </ul>
                )
            ) : (
                <p className="text-gray-500 text-center"></p>
            )}

            {/* Modal xác nhận xóa */}
            <Dialog open={deleteSessionId !== null} onOpenChange={() => setDeleteSessionId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa phiên chat này không? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteSessionId(null)}>Hủy</Button>
                        <Button variant="destructive" onClick={handleDeleteSession}>Xóa</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
