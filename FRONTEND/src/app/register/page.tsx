"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleRegister } from "./handle_register";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const result = await handleRegister(formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-500 relative">
            {/* Nút quay lại */}
            <button
                onClick={() => router.push("/")}
                className="absolute top-6 left-6 bg-white p-3 rounded-full shadow-lg hover:bg-gray-200 transition"
            >
                <IoArrowBack className="text-blue-500 text-2xl" />
            </button>

            <div className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96">
                <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Đăng ký</h2>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Họ và tên */}
                    <div className="flex items-center border rounded-lg p-2 bg-gray-100">
                        <FaUser className="text-gray-500 mr-2" />
                        <input
                            name="name"
                            type="text"
                            placeholder="Nhập họ và tên"
                            required
                            className="w-full bg-transparent focus:outline-none"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex items-center border rounded-lg p-2 bg-gray-100">
                        <FaEnvelope className="text-gray-500 mr-2" />
                        <input
                            name="email"
                            type="email"
                            placeholder="Nhập email"
                            required
                            className="w-full bg-transparent focus:outline-none"
                        />
                    </div>

                    {/* Mật khẩu */}
                    <div className="flex items-center border rounded-lg p-2 bg-gray-100">
                        <FaLock className="text-gray-500 mr-2" />
                        <input
                            name="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            required
                            className="w-full bg-transparent focus:outline-none"
                        />
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="flex items-center border rounded-lg p-2 bg-gray-100">
                        <FaLock className="text-gray-500 mr-2" />
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            required
                            className="w-full bg-transparent focus:outline-none"
                        />
                    </div>

                    {/* Nút đăng ký */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all disabled:bg-gray-400"
                    >
                        {loading ? <ImSpinner2 className="animate-spin" /> : "Đăng ký"}
                    </button>

                    {error && <p className="text-red-500 text-center">{error}</p>}
                </form>

                <p className="text-center mt-4 text-sm">
                    Đã có tài khoản?{" "}
                    <Link href="/login" className="text-indigo-500 font-semibold hover:underline">
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}
