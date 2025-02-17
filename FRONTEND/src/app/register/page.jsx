"use client"
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Import icons
import Link from 'next/link';

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate form data (e.g., check if passwords match)
        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp!"); // Or display error message in UI
            return;
        }

        // Xử lý logic đăng ký ở đây, ví dụ: gửi dữ liệu lên server
        console.log(name, email, password);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Đăng ký</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Ô nhập Họ và Tên */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Nhập họ và tên"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-3 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            required
                        />
                    </div>

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

                    {/* Ô nhập Xác nhận Mật khẩu */}
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            required
                        />
                    </div>


                    {/* Nút đăng ký */}
                    <button className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all">
                        Đăng ký
                    </button>
                </form>

                {/* Liên kết đăng nhập */}
                <p className="text-center mt-4 text-sm">
                    Đã có tài khoản?{" "}
                    <Link href="/login" className="text-blue-500 font-semibold hover:underline">
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}