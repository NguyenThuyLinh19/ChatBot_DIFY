"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, LogOut, CircleUser } from "lucide-react";
import ChatSessions from "@/app/HistoryChat/page";
import { logout } from "@/utils/logout";
import { motion } from "framer-motion";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

  const userMenuRef = useRef<HTMLDivElement>(null);
  const userContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userContainerRef.current && !userContainerRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      const response = await fetch("http://localhost/v1/chat-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer app-sxuABRps1LUgPhehxBseTYOM",
        },
        body: JSON.stringify({
          "inputs": {},
          "query": input,
          "response_mode": "streaming",
          "user": "abc-123"
        }),
      });

      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status} - ${await response.text()}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Không thể đọc response stream');
      }

      // Tạo message ban đầu cho bot
      const botMessageId = Date.now() + 1;
      const botMessage: Message = {
        id: botMessageId,
        sender: "bot",
        text: "",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Lưu trữ tất cả các event nhận được từ API
      const eventsList: any[] = [];
      console.log(eventsList);

      // Đọc stream data từ response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Chuyển đổi dữ liệu binary thành text
        const chunk = decoder.decode(value, { stream: true });

        try {
          // Xử lý các dòng dữ liệu từ server-sent events
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.substring(6).trim();  // Bỏ 'data: ' prefix

              if (jsonStr === '[DONE]') continue;

              try {
                const eventData = JSON.parse(jsonStr);

                // Lưu event vào danh sách
                eventsList.push(eventData);

                // Nếu là event workflow_finished, lấy câu trả lời và hiển thị
                if (eventData.event === "workflow_finished" &&
                  eventData.data &&
                  eventData.data.outputs &&
                  eventData.data.outputs.answer) {

                  const answer = eventData.data.outputs.answer;
                  console.log("answer: ", answer);

                  // Cập nhật tin nhắn bot
                  setMessages((prevMessages) =>
                    prevMessages.map(msg =>
                      msg.id === botMessageId
                        ? { ...msg, text: answer }
                        : msg
                    )
                  );

                  // Lưu câu trả lời vào database
                  saveMessages(answer, "assistant", selectedSessionId);
                }
              } catch (e) {
                console.error("Lỗi khi parse JSON từ stream:", e, jsonStr);
              }
            }
          }
        } catch (e) {
          console.error("Lỗi khi xử lý chunk:", e);
        }
      }

      // Double-check xem đã tìm thấy workflow_finished event chưa
      if (!eventsList.some(e => e.event === "workflow_finished")) {
        // Nếu không tìm thấy, thử tìm từ tất cả events đã nhận
        const workflowFinished = eventsList.find(e => e.event === "workflow_finished");

        if (workflowFinished &&
          workflowFinished.data &&
          workflowFinished.data.outputs &&
          workflowFinished.data.outputs.answer) {

          const answer = workflowFinished.data.outputs.answer;

          // Cập nhật tin nhắn bot
          setMessages((prevMessages) =>
            prevMessages.map(msg =>
              msg.id === botMessageId
                ? { ...msg, text: answer }
                : msg
            )
          );

          // Lưu câu trả lời vào database
          saveMessages(answer, "assistant", selectedSessionId);
        } else {
          console.error("Không tìm thấy event workflow_finished hoặc không có câu trả lời");
        }
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);

      // Thêm tin nhắn lỗi cho người dùng
      const errorMessage: Message = {
        id: Date.now() + 2,
        sender: "bot",
        text: "Xin lỗi, đã xảy ra lỗi khi xử lý tin nhắn của bạn. Vui lòng thử lại sau.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setBotTyping(false);
    }
  };

  const fetchMessages = async (sessionId: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/messages/session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
    logout();
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Render ChatSessions và truyền isOpen, setIsOpen, selectedSessionId */}
      {userId && (
        <ChatSessions
          token={token!}
          userId={userId.toString()}
          selectedSessionId={selectedSessionId}
          onSelectSession={handleSelectSession}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      )}
      {/* Sidebar toggle button */}
      <button
        className="absolute top-4 left-4 z-50 bg-white shadow-lg rounded-full p-2 hover:scale-105 transition-transform"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isSidebarOpen ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.div>
      </button>

      {/* Khung chat chính */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-72" : "ml-14"} mr-8`}>
        <div className="w-full flex flex-col h-screen bg-white shadow-lg rounded-lg mx-4">
          {/* Header */}
          <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white rounded-t-lg relative">
            <h1 className="text-2xl font-bold">HealthSync</h1>

            <div ref={userContainerRef} className="relative">
              {/* Nút User Icon */}
              <button
                onClick={(event) => {
                  event.stopPropagation(); // Ngăn sự kiện lan ra ngoài
                  setShowUserMenu((prev) => !prev);
                }}
                className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                title="Tài khoản người dùng"
              >
                <CircleUser size={20} /> {/* Icon người dùng */}
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div ref={userMenuRef} className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg p-2">
                  {/* Hiển thị tên người dùng */}
                  <div className="px-4 py-2 text-gray-800 font-semibold border-b">{userName}</div>

                  {/* Nút Đăng xuất */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    <LogOut size={18} />
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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl shadow-md max-w-[75%] break-words prose prose-sm max-w-full dark:prose-invert ${msg.sender !== "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                      }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}

              {botTyping && (
                <motion.div
                  className="text-gray-500 flex gap-1 items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="dot-flashing" />
                  <span className="dot-flashing" />
                  <span className="dot-flashing" />
                </motion.div>
              )}
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
