import { useState, useEffect } from 'react';

interface User {
    id: number;
    email: string;
    full_name: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

    // Fetch danh sách người dùng
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/users/getAllUser');
            if (!response.ok) throw new Error('Không thể lấy danh sách người dùng');
            const data: User[] = await response.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý khi nhấn nút "Sửa"
    const handleEdit = (user: User) => {
        setEditingUser({ ...user });
    };

    // Cập nhật thông tin người dùng
    const handleSave = async () => {
        if (!editingUser?.id || !editingUser.full_name || !editingUser.email) return;

        try {
            const response = await fetch(`http://localhost:4000/api/users/updateUser/${editingUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: editingUser.full_name,
                    email: editingUser.email,
                }),
            });

            if (!response.ok) throw new Error('Cập nhật thất bại');

            // Cập nhật danh sách hiển thị
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === editingUser.id ? { ...user, ...editingUser } : user
                )
            );

            setEditingUser(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Xóa người dùng
    const handleDelete = async (id: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) return;

        try {
            const response = await fetch(`http://localhost:4000/api/users/deleteUser/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Xóa người dùng thất bại');

            // Cập nhật danh sách hiển thị sau khi xóa
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p className="text-red-500">Lỗi: {error}</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">ID</th>
                        <th className="border border-gray-300 px-4 py-2">Email</th>
                        <th className="border border-gray-300 px-4 py-2">Tên người dùng</th>
                        <th className="border border-gray-300 px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="text-center">
                            <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {editingUser?.id === user.id ? (
                                    <input
                                        type="text"
                                        className="border p-1"
                                        value={editingUser.email}
                                        onChange={(e) =>
                                            setEditingUser({ ...editingUser, email: e.target.value })
                                        }
                                    />
                                ) : (
                                    user.email
                                )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {editingUser?.id === user.id ? (
                                    <input
                                        type="text"
                                        className="border p-1"
                                        value={editingUser.full_name}
                                        onChange={(e) =>
                                            setEditingUser({ ...editingUser, full_name: e.target.value })
                                        }
                                    />
                                ) : (
                                    user.full_name
                                )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {editingUser?.id === user.id ? (
                                    <button
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                                        onClick={handleSave}
                                    >
                                        Lưu
                                    </button>
                                ) : (
                                    <button
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                                        onClick={() => handleEdit(user)}
                                    >
                                        Sửa
                                    </button>
                                )}
                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
