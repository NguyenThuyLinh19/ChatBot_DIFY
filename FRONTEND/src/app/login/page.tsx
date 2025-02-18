"use client";
import { useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from 'axios';
import { useRouter } from "next/navigation"; // Điều hướng sau khi đăng nhập

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter(); // Dùng để chuyển trang sau khi đăng nhập

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8081/api/login", {
                username: username,
                password,
            });

            if (response.status === 200) {
                localStorage.setItem("token", response.data.token); // Lưu token để xác thực
                router.push("/dashboard"); // Chỉ chuyển hướng nếu đăng nhập thành công
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Đăng nhập thất bại!");
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Đăng nhập</h2>

                {error && <p className="text-red-500 text-center mb-2">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Ô nhập Email */}
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Nhập username"
                            // value={username}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
