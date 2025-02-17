"use client";
import { useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Đăng nhập với:", email, password);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Đăng nhập</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Ô nhập Email */}
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Ô nhập Mật khẩu */}
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Nút đăng nhập */}
                    <button className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all">
                        Đăng nhập
                    </button>
                </form>

                {/* Liên kết đăng ký */}
                <p className="text-center mt-4 text-sm">
                    Chưa có tài khoản?{" "}
                    <Link href="/register" className="text-blue-500 font-semibold hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}
