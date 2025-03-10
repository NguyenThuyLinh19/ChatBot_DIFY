"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Dùng để lấy token từ cookie
import { log } from "console";

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [token, setToken] = useState("");

  // Kiểm tra token, nếu chưa đăng nhập thì quay lại trang login
  useEffect(() => {
    const difyToken = Cookies.get("dify_token"); // Lấy token từ cookie
    if (!difyToken) {
      router.push("/login");
    } else {
      setToken(difyToken);
    }
  }, [router]);

  const sendMessage = async () => {
    if (!input.trim() || !token) return;

    // Hiển thị tin nhắn của người dùng
    setMessages([...messages, { sender: "user", text: input }]);

    try {
      const res = await fetch("http://localhost/console/api/apps/0c186eef-a005-48c0-9808-c00764f8cbac/advanced-chat/workflows/draft/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Gửi token từ cookie
        },
        body: JSON.stringify({
          "response_mode": "blocking",
          "conversation_id": "",
          "files": [],
          "query": input,
          "inputs": {},
          "model_config": {}
        }),
      });

      const data = await res.json();
      console.log("data tra vè: ", data)
      setMessages([...messages, { sender: "user", text: input }, { sender: "bot", text: data.answer }]);
    } catch (error) {
      console.error("Lỗi gửi tin nhắn", error);
    }

    setInput("");
  };

  const handleLogout = () => {
    Cookies.remove("dify_token"); // Xóa token khỏi cookie
    router.push("/login"); // Quay lại trang đăng nhập
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Chatbot Dify</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
          Đăng xuất
        </button>
      </div>

      {/* Chat Box */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
            <span className={`px-3 py-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex bg-white p-4 shadow-md">
        <input
          className="border p-2 flex-1 rounded-lg"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
        />
        <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={sendMessage}>
          Gửi
        </button>
      </div>
    </div>
  );
}
