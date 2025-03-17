"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, User, Bot } from "lucide-react";
import ChatSessions from "@/app/HistoryChat/page";

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [difyToken, setDifyToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>(""); // Thêm state cho tên người dùng
  const [botTyping, setBotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  // State điều khiển hiển thị sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // State điều khiển dropdown hiển thị tên người dùng
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    const difyAuthToken = Cookies.get("dify_token");
    if (!authToken || !difyAuthToken) {
      router.push("/login");
      return;
    }
    setToken(authToken);
    setDifyToken(difyAuthToken);

    try {
      const decoded: any = jwtDecode(authToken); // Giải mã token
      setUserId(decoded.id); // Lấy user_id từ token
      // Giả sử token có chứa tên người dùng trong trường "name"
      setUserName(decoded.name || "User");
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchFullName = async () => {
      // Chỉ gọi nếu đã có token và userId
      if (!token || !userId) return;

      try {
        // Thay :id bằng userId thực tế
        const res = await fetch(`http://localhost:4000/api/users/${userId}/fullname`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Lỗi API: ${res.status} - ${await res.text()}`);
        }

        const data = await res.json();
        setUserName(data.full_name || "Người dùng");
      } catch (error) {
        console.error("Lỗi khi lấy tên đầy đủ:", error);
      }
    };

    fetchFullName();
  }, [token, userId]);

  const sendMessage = async () => {
    if (!input.trim() || selectedSessionId === null) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    saveMessages(input, "user", selectedSessionId);
    setInput("");
    setBotTyping(true);

    try {
      const difyAuthToken = Cookies.get("dify_token");
      const res = await fetch("http://localhost:4000/api/chatbots/ChatDify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${difyAuthToken}`,
        },
        body: JSON.stringify({
          session_id: selectedSessionId,
          message: input,
        }),
      });

      if (!res.ok) {
        throw new Error(`Lỗi API: ${res.status} - ${await res.text()}`);
      }

      const responseData = await res.json();

      if (!responseData || !Array.isArray(responseData.data)) {
        console.error("Dữ liệu API không hợp lệ:", responseData);
        setBotTyping(false);
        return;
      }

      const dataArray = responseData.data;
      const workflowEvent = dataArray.find((event: any) => event.event === "workflow_finished");

      if (!workflowEvent || !workflowEvent.data?.outputs?.answer) {
        console.error("Không tìm thấy câu trả lời từ chatbot:", responseData);
        setBotTyping(false);
        return;
      }

      const finalAnswer = workflowEvent.data.outputs.answer;

      const botMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: finalAnswer,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
      saveMessages(finalAnswer, "assistant", selectedSessionId);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    } finally {
      setBotTyping(false);
    }
  };

  const fetchMessages = async (sessionId: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/messages/session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (!res.ok) {
        throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
      }
      const data = await res.json();
      const mappedMessages = data.map((msg: any, index: number) => ({
        id: index,
        sender: msg.role === "assistant" ? "bot" : "user",
        text: msg.content,
        timestamp: new Date().toISOString(),
      }));
      setMessages(mappedMessages);
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn của phiên chat:", error);
    }
  };

  const saveMessages = async (content: string, role: string, sessionId: number) => {
    if (!token) {
      console.error("Không có token xác thực!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          session_id: sessionId,
          content: content,
          role: role,
        }),
      });

      if (!res.ok) {
        console.error("Lỗi khi lưu tin nhắn:", await res.text());
      }
    } catch (error) {
      console.error("Lỗi kết nối khi lưu tin nhắn:", error);
    }
  };

  const handleSelectSession = async (sessionId: number) => {
    if (selectedSessionId === sessionId) return;
    setSelectedSessionId(sessionId);
    setMessages([]);
    await fetchMessages(sessionId);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("dify_token");
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Render ChatSessions và gửi isOpen, setIsOpen */}
      {userId && (
        <ChatSessions
          token={token!}
          userId={userId.toString()}
          onSelectSession={handleSelectSession}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      )}

      {/* Khung chat chính */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-72" : "ml-14"} mr-8`}>
        <div className="w-full flex flex-col h-screen bg-white shadow-lg rounded-lg mx-4">
          {/* Header */}
          <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white rounded-t-lg relative">
            <h1 className="text-2xl font-bold">HealthSync</h1>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                {userName || "User"}
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Chat Box */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hidden">
            <div className="flex flex-col gap-2">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                  <div
                    className={`px-4 py-2 rounded-xl shadow-md max-w-[75%] break-words ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                      }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {botTyping && <div className="text-gray-500 animate-pulse">Bot đang nhập...</div>}
              <div ref={chatEndRef} />
            </div>
          </div>
          {/* Input */}
          <div className="flex items-center bg-gray-100 p-4 shadow-md rounded-b-lg">
            <input
              className="border p-2 flex-1 rounded-full px-4 focus:ring-2 focus:ring-blue-400 transition"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Nhập tin nhắn..."
            />
            <button className="ml-2 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition" onClick={sendMessage}>
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
