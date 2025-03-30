export async function handleRegister(formData: FormData) {
    const full_name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
        return { error: 'Mật khẩu không khớp!' }
    }

    try {
        const response = await fetch('http://localhost:4000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                full_name,
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message || 'Đăng ký thất bại' };
        }
        return { success: true }; // Trả về success để xử lý client-side
    } catch (error: any) {
        return { error: error.message || 'Có lỗi xảy ra trong quá trình đăng ký' };
    }
}