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
    const [searchQuery, setSearchQuery] = useState<string>('');

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

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchUsers(); // Nếu ô tìm kiếm rỗng, tải lại danh sách gốc
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/api/users/search?query=${searchQuery}`);
            if (!response.ok) throw new Error('Lỗi khi tìm kiếm người dùng');
            const data: User[] = await response.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Khi người dùng xóa hết nội dung trong ô tìm kiếm => Tự động hiển thị lại danh sách gốc
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value.trim() === '') {
            fetchUsers(); // Nếu ô tìm kiếm rỗng, tải lại danh sách gốc
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser({ ...user });
    };

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

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) return;

        try {
            const response = await fetch(`http://localhost:4000/api/users/deleteUser/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Xóa người dùng thất bại');

            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p className="text-red-500">Lỗi: {error}</p>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm người dùng"
                    className="border p-3 rounded-lg w-3/4 mr-4 shadow-md"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
                <button
                    onClick={handleSearch}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                >
                    Tìm kiếm
                </button>
            </div>
            {/* Bọc bảng trong div có thể cuộn */}
            <div className="overflow-y-auto max-h-[420px]">
                <table className="w-full table-auto border-collapse shadow-md">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-700">ID</th>
                            <th className="px-6 py-3 text-left text-gray-700">Email</th>
                            <th className="px-6 py-3 text-left text-gray-700">Tên người dùng</th>
                            <th className="px-6 py-3 text-center text-gray-700">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="border-b px-6 py-4">{user.id}</td>
                                <td className="border-b px-6 py-4">
                                    {editingUser?.id === user.id ? (
                                        <input
                                            type="text"
                                            className="border p-2 rounded-md w-full"
                                            value={editingUser.email}
                                            onChange={(e) =>
                                                setEditingUser({ ...editingUser, email: e.target.value })
                                            }
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td className="border-b px-6 py-4">
                                    {editingUser?.id === user.id ? (
                                        <input
                                            type="text"
                                            className="border p-2 rounded-md w-full"
                                            value={editingUser.full_name}
                                            onChange={(e) =>
                                                setEditingUser({ ...editingUser, full_name: e.target.value })
                                            }
                                        />
                                    ) : (
                                        user.full_name
                                    )}
                                </td>
                                <td className="border-b px-6 py-4 text-center">
                                    {editingUser?.id === user.id ? (
                                        <button
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mr-2"
                                            onClick={handleSave}
                                        >
                                            Lưu
                                        </button>
                                    ) : (
                                        <button
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
                                            onClick={() => handleEdit(user)}
                                        >
                                            Sửa
                                        </button>
                                    )}
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
        </div>

    );
};

export default UserManagement;
