'use server';

export async function handleLogin(formData: FormData) {
    const emailDify = "ntthuylinh201910@gmail.com";
    const passwordDify = "Thuylinh@1910";
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        // Gửi request đăng nhập đến backend của bạn
        const response = await fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("Backend response:", data);

        if (!response.ok) {
            return { error: data.message || "Đăng nhập thất bại" };
        }

        // Gọi API đăng nhập Dify sau khi xác thực thành công
        const difyResponse = await fetch("http://localhost/console/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: emailDify,
                password: passwordDify,
            }),
        });

        const difyData = await difyResponse.json();
        console.log("Dify response:", difyData);

        return {
            success: true,
            token: difyData.data.access_token, // ✅ Trả về token để lưu vào cookie
        };
    } catch (error: any) {
        return { error: error.message || "Có lỗi xảy ra trong quá trình đăng nhập" };
    }
}
