"use client";
import { useEffect, useState, useRef } from "react";
import { Menu, MoreVertical, Plus, Trash2, X, Edit3, MessageCircle } from "lucide-react";
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
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const hasCreatedSession = useRef(false);

    useEffect(() => {
        if (userId && token) fetchOrCreateSession();
    }, [userId, token]);

    useEffect(() => {
        if (userId && token) fetchSessions();
    }, [userId]);

    const fetchOrCreateSession = async () => {
        if (hasCreatedSession.current) return;
        hasCreatedSession.current = true;

        try {
            const res = await fetch(`http://localhost:4000/api/chat-sessions/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const sessions = await res.json();
            if (sessions.length > 0) {
                onSelectSession(sessions[0].id);
                setSelectedSessionId(sessions[0].id);
            } else {
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
                setSelectedSessionId(newSession.id);
            }

            fetchSessions();
        } catch (error) {
            console.error("Lỗi khi lấy hoặc tạo phiên chat:", error);
        }
    };

    const fetchSessions = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/chat-sessions/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
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
            if (!res.ok) throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);

            const newSession = await res.json();
            onSelectSession(newSession.id);
            setSelectedSessionId(newSession.id);
            fetchSessions();
        } catch (error) {
            console.error("Lỗi khi tạo phiên chat:", error);
        }
    };

    const confirmDeleteSession = (sessionId: number) => setDeleteSessionId(sessionId);

    const handleDeleteSession = async () => {
        if (deleteSessionId === null) return;
        try {
            const res = await fetch(`http://localhost:4000/api/chat-sessions/${deleteSessionId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
            fetchSessions();
        } catch (error) {
            console.error("Lỗi khi xóa phiên chat:", error);
        } finally {
            setDeleteSessionId(null);
        }
    };

    return (
        <aside className={`fixed top-0 left-0 h-screen bg-white border-r shadow-md transition-all duration-300 z-10 ${isOpen ? "w-72 p-4" : "w-16 p-2"}`}>
            <div className="flex justify-between items-center mb-4">
                {/* <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    title={isOpen ? "Đóng sidebar" : "Mở sidebar"}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button> */}
                {isOpen && (
                    <h2 className="text-lg font-semibold text-gray-800 ml-auto">Lịch sử</h2>
                )}

            </div>

            {isOpen && (
                <button
                    onClick={handleCreateSession}
                    className="flex items-center justify-center gap-2 p-2 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-sm mb-4"
                >
                    <Plus size={18} /> Phiên mới
                </button>
            )}

            {isOpen && (
                loading ? (
                    <p className="text-gray-500 text-sm">Đang tải...</p>
                ) : sessions.length === 0 ? (
                    <p className="text-gray-500 text-sm">Chưa có phiên nào.</p>
                ) : (
                    <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-180px)] pr-1 scrollbar-thin scrollbar-thumb-gray-300">
                        {sessions.map((session) => (
                            <li
                                key={session.id}
                                className={`p-3 rounded-xl border flex items-center justify-between group cursor-pointer transition-all duration-200 ${selectedSessionId === session.id ? "bg-blue-100 border-blue-400 shadow-inner" : "bg-gray-50 hover:bg-gray-100 border-gray-200"}`}
                                onClick={() => {
                                    onSelectSession(session.id);
                                    setSelectedSessionId(session.id);
                                }}
                            >
                                <div className="flex items-center gap-2 text-sm text-gray-800">
                                    <MessageCircle size={16} className="text-blue-500" />
                                    <span className="truncate max-w-[150px]">{session.id} New conversation </span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-1 hover:bg-gray-200 rounded-full"
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                alert("Chức năng đổi tên chưa được hỗ trợ.");
                                            }}
                                        >
                                            <Edit3 size={16} className="mr-2" /> Đổi tên
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                confirmDeleteSession(session.id);
                                            }}
                                            className="text-red-600"
                                        >
                                            <Trash2 size={16} className="mr-2" /> Xóa
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </li>
                        ))}
                    </ul>
                )
            )}

            <Dialog open={deleteSessionId !== null} onOpenChange={() => setDeleteSessionId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogDescription>
                            Bạn chắc chắn muốn xóa phiên chat này? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteSessionId(null)}>Hủy</Button>
                        <Button variant="destructive" onClick={handleDeleteSession}>Xóa</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </aside>
    );
}