"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "./handle_login";
import Link from "next/link";
import Cookies from "js-cookie";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            const result = await handleLogin(formData);
            console.log("Kết quả đăng nhập:", result); // Debug

            if (result.error) {
                setError(result.error);
            } else if (result.success) {
                // Lưu token vào cookie với tên "dify_token"
                Cookies.set("dify_token", result.token, { expires: 1 });
                // Chuyển hướng sang dashboard
                router.push("/dashboard");
            }
        });
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Đăng nhập</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <input name="email" type="email" placeholder="Nhập email" required className="w-full p-2 border rounded-lg" />
                    <input name="password" type="password" placeholder="Nhập mật khẩu" required className="w-full p-2 border rounded-lg" />

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-400"
                    >
                        {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>

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
