"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleRegister } from "./handle_register";
import Link from "next/link";
export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const result = await handleRegister(formData);

        if (result.error) {
            setError(result.error);
        } else {
            router.push("/dashboard"); // Chuyển hướng khi đăng ký thành công
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Đăng ký</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <input name="name" type="text" placeholder="Nhập họ và tên" required className="w-full p-2 border rounded-lg" />
                    <input name="email" type="email" placeholder="Nhập email" required className="w-full p-2 border rounded-lg" />
                    <input name="password" type="password" placeholder="Nhập mật khẩu" required className="w-full p-2 border rounded-lg" />
                    <input name="confirmPassword" type="password" placeholder="Xác nhận mật khẩu" required className="w-full p-2 border rounded-lg" />

                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all">
                        Đăng ký
                    </button>

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>

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
