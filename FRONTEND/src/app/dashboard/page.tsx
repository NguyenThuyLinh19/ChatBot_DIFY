"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, LogOut, Menu } from "lucide-react";

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [token, setToken] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State để điều khiển sidebar
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const difyToken = Cookies.get("dify_token");
    if (!difyToken) {
      router.push("/login");
    } else {
      setToken(difyToken);
    }
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const [botTyping, setBotTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || !token) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setBotTyping(true);

    try {
      const res = await fetch("http://localhost/console/api/apps/0c186eef-a005-48c0-9808-c00764f8cbac/advanced-chat/workflows/draft/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          response_mode: "blocking",
          conversation_id: "",
          query: input,
          inputs: {},
          model_config: {},
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      let finalAnswer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        if (doneReading) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (let line of lines) {
          let trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith("data:")) {
            trimmed = trimmed.substring(5).trim();
          }

          try {
            const event = JSON.parse(trimmed);
            if (event.event === "workflow_finished") {
              finalAnswer = event.data?.outputs?.answer || "";
              done = true;
              break;
            }
          } catch (err) {
            console.error("Parse error:", trimmed, err);
          }
        }
      }

      setMessages((prev) => [...prev, { sender: "bot", text: finalAnswer }]);
    } catch (error) {
      console.error("Lỗi gửi tin nhắn", error);
    } finally {
      setBotTyping(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("dify_token");
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-200 p-4 overflow-y-auto h-screen fixed top-0 transition-transform ${isSidebarOpen ? "w-64 left-0" : "-translate-x-full w-0"
          }`}
      >
        <h2 className="text-lg font-semibold mb-4 text-right">Lịch sử trò chuyện</h2>
        <ul>
          <li className="p-2 bg-white rounded-md shadow-md mb-2 cursor-pointer hover:bg-gray-100">
            Lần trò chuyện 1
          </li>
          <li className="p-2 bg-white rounded-md shadow-md mb-2 cursor-pointer hover:bg-gray-100">
            Lần trò chuyện 2
          </li>
        </ul>
      </div>

      {/* Nút Toggle Sidebar */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-md shadow-lg z-50"
      >
        {isSidebarOpen ? "❮" : "❯"}
      </button>

      {/* Khung chat chính */}
      <div className={`flex-1 flex justify-center transition-all ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <div className="w-3/5 flex flex-col h-screen bg-white shadow-lg rounded-lg mx-4">
          {/* Header */}
          <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white rounded-t-lg">
            <h1 className="text-2xl font-bold">HealthSync</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>

          {/* Chat Box */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hidden">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                {msg.sender === "bot" && <img src="/bot-avatar.png" alt="Bot" className="w-8 h-8 rounded-full mr-2" />}
                <div
                  className={`px-4 py-2 rounded-xl shadow-md max-w-[75%] break-words ${msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white"
                    : "bg-white border border-gray-300 text-gray-800"
                    }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                </div>
                {msg.sender === "user" && <img src="/user-avatar.png" alt="User" className="w-8 h-8 rounded-full ml-2" />}
              </div>
            ))}

            {botTyping && (
              <div className="flex items-center space-x-2">
                <img src="/bot-avatar.png" alt="Bot" className="w-8 h-8 rounded-full mr-2" />
                <div className="bg-gray-200 px-3 py-1 rounded-full text-gray-600">Đang nhập...</div>
              </div>
            )}
            <div ref={chatEndRef} />
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
