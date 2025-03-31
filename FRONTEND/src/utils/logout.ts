"use client"
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export const logout = async () => {
    try {
        // Gọi API để hủy token trên server
        await fetch("http://localhost:4000/api/auth/logout", {
            method: "POST",
            credentials: "include", // Để gửi cookie HttpOnly
        });

        // Xóa token khỏi localStorage
        localStorage.removeItem("token");

        // Xóa cookie dify_token
        Cookies.remove("dify_token");

        // Chuyển hướng về trang đăng nhập
        window.location.href = "/login"; // Dùng window.location để đảm bảo redirect ngay lập tức
    } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
    }
};
