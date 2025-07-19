import { useEffect, useState } from "react";

type BadResponse = {
    user_msg_id: number;
    assistant_msg_id: number;
    user_question: string;
    assistant_answer: string;
    session_id: number;
    time: string;
};

const categories = [
    { label: "Đăng ký khám chữa bệnh", value: "register" },
    { label: "Bảng giá dịch vụ", value: "pricing" },
    { label: "Chuyển tuyến", value: "referral" },
    { label: "Nhập-xuất viện", value: "admission" },
    { label: "Bảo hiểm y tế", value: "insurence" },
    { label: "Giấy tờ y tế", value: "medicaldocs" },
];

export default function BadResponsesPage() {
    const [responses, setResponses] = useState<BadResponse[]>([]);
    const [editedAnswers, setEditedAnswers] = useState<Record<number, string>>({});
    const [selectedItem, setSelectedItem] = useState<BadResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch("http://localhost:4000/api/feedback/bad-responses")
            .then((res) => res.json())
            .then((data: BadResponse[]) => {
                setResponses(data);
                const initialEdits: Record<number, string> = {};
                data.forEach((item) => {
                    initialEdits[item.user_msg_id] = item.assistant_answer; // ✅ Dùng user_msg_id làm key
                });
                setEditedAnswers(initialEdits);
            })
            .catch((err) => console.error("Error fetching responses:", err));
    }, []);

    const handleEditChange = (user_msg_id: number, value: string) => {
        setEditedAnswers((prev) => ({
            ...prev,
            [user_msg_id]: value,
        }));
    };

    const openModal = (item: BadResponse) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleAddChunk = async (categoryValue: string) => {
        if (!selectedItem) return;

        const question = selectedItem.user_question;
        const answer = editedAnswers[selectedItem.user_msg_id] ?? selectedItem.assistant_answer;
        const session_id = selectedItem.session_id;

        try {
            const res = await fetch("http://localhost:4000/api/dify/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question,
                    answer,
                    category: categoryValue,
                }),
            });

            const result = await res.json();

            if (res.ok) {
                const deleteRes = await fetch("http://localhost:4000/api/messages/delete", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        session_id,
                        user_content: question,
                        assistant_content: answer,
                    }),
                });

                if (!deleteRes.ok) {
                    const err = await deleteRes.json();
                    alert("Đã thêm vào Dify nhưng lỗi khi xóa tin nhắn: " + err.message);
                    return;
                }

                setResponses((prev) =>
                    prev.filter(
                        (item) =>
                            !(
                                item.session_id === session_id &&
                                item.user_msg_id === selectedItem.user_msg_id &&
                                item.user_question === question &&
                                (editedAnswers[item.user_msg_id] ?? item.assistant_answer) === answer
                            )
                    )
                );

                alert("Thêm vào Dify và xóa tin nhắn thành công!");
                setIsModalOpen(false);
                setSelectedItem(null);
            } else {
                alert("Lỗi từ server Dify: " + result.message);
            }
        } catch (error) {
            console.error("Lỗi khi xử lý:", error);
            alert("Gặp lỗi khi thêm vào Dify hoặc xóa tin nhắn");
        }
    };

    return (
        <div className="p-6">
            <div className="max-h-[490px] overflow-auto border border-gray-300 rounded-md">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="border px-2 py-2">#</th>
                            <th className="border px-2 py-2">Câu hỏi</th>
                            <th className="border px-2 py-2">Chỉnh sửa câu trả lời</th>
                            <th className="border px-2 py-2">Thời gian</th>
                            <th className="border px-2 py-2">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responses.map((item, index) => (
                            <tr key={`${item.user_msg_id}-${item.assistant_msg_id}`}>
                                <td className="border px-2 py-1">{index + 1}</td>
                                <td className="border px-2 py-1 whitespace-pre-wrap">{item.user_question}</td>
                                <td className="border px-2 py-1">
                                    <textarea
                                        className="w-full p-1 border rounded"
                                        rows={4}
                                        value={editedAnswers[item.user_msg_id] ?? item.assistant_answer}
                                        onChange={(e) => handleEditChange(item.user_msg_id, e.target.value)}
                                    />
                                </td>
                                <td className="border px-2 py-1">{new Date(item.time).toLocaleString()}</td>
                                <td className="border px-2 py-1">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                                        onClick={() => openModal(item)}
                                    >
                                        Thêm
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-[400px]">
                        <h2 className="text-lg font-bold mb-4">Chọn chuyên mục để thêm vào Dify</h2>
                        <div className="flex flex-col gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
                                    onClick={() => handleAddChunk(cat.value)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                        <button
                            className="mt-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
