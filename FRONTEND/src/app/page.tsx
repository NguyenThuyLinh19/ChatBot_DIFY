"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-blue-600 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">HealthChatbot</h1>
          <nav>
            <Link href="/login" className="mr-4 hover:underline">Đăng nhập</Link>
            <Link href="/register" className="hover:underline">Đăng ký</Link>
          </nav>
        </div>
      </header>

      {/* Main Content - căn giữa nội dung */}
      <main className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="max-w-2xl w-full text-center">
          <h2 className="text-4xl font-bold text-gray-800">
            Chào mừng đến với <span className="text-blue-600">HealthChatbot</span>
          </h2>
          <p className="mt-4 text-gray-600">
            Trợ lý ảo thông minh giúp bạn giải đáp mọi thắc mắc một cách nhanh chóng và chính xác.
          </p>
          <Link href="/login">
            <button className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600">
              Tạo chatbot
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
