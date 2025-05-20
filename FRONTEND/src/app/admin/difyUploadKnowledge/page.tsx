"use client";

import { useEffect, useState } from "react";
import {
    X,
    FilePlus2,
    ClipboardList,
    Stethoscope,
    Hospital,
    FileText,
    FileCheck,
} from "lucide-react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "@/components/ui/button";

const api_key = "dataset-9BsVCS5Ufl6zYUmzMzURB1n5";

const datasetIdMap: Record<string, string> = {
    register: 'a59783c6-9f6b-4496-8132-1e81d51b5369',
    pricing: 'db42546c-86a0-48e9-9c01-bab296bb610b',
    referral: '6049f4aa-f3ad-4bcb-8279-025550ae734b',
    admission: '897e7925-f4be-4031-88d4-057ffaf43ee1',
    insurance: '4a83fc05-54d7-4998-8147-80dd32789f19',
    "medical-docs": '60021e7b-7648-4b22-a885-403d99d7edb1',
};

const categories = [
    {
        id: "register",
        name: "Đăng ký khám chữa bệnh",
        icon: <ClipboardList className="w-8 h-8 text-blue-500" />,
    },
    {
        id: "pricing",
        name: "Bảng giá dịch vụ",
        icon: <FileText className="w-8 h-8 text-yellow-500" />,
    },
    {
        id: "referral",
        name: "Chuyển tuyến, chuyển viện",
        icon: <Stethoscope className="w-8 h-8 text-green-500" />,
    },
    {
        id: "admission",
        name: "Nhập - xuất viện",
        icon: <Hospital className="w-8 h-8 text-purple-500" />,
    },
    {
        id: "insurance",
        name: "Bảo hiểm y tế",
        icon: <FileCheck className="w-8 h-8 text-teal-500" />,
    },
    {
        id: "medical-docs",
        name: "Giấy tờ y tế",
        icon: <FileText className="w-8 h-8 text-indigo-500" />,
    },
];

export default function KnowledgeUploadGrid() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [fetchingDocs, setFetchingDocs] = useState(false);

    useEffect(() => {
        if (!selectedCategory) {
            setUploadedFiles([]);
            return;
        }

        const dataset_id = datasetIdMap[selectedCategory];
        if (!dataset_id) {
            setUploadedFiles([]);
            return;
        }

        const fetchDocuments = async () => {
            setFetchingDocs(true);
            setErrorMessage("");
            try {
                const response = await fetch(
                    `http://localhost/v1/datasets/${dataset_id}/documents`,
                    {
                        headers: {
                            Authorization: `Bearer ${api_key}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Lỗi khi lấy tài liệu: ${response.statusText}`);
                }

                const data = await response.json();

                // Lấy tên tài liệu từ data.data
                const docs = data.data?.map((doc: any) => doc.name) || [];
                setUploadedFiles(docs);
            } catch (error: any) {
                setErrorMessage(error.message || "Lỗi khi lấy tài liệu");
                setUploadedFiles([]);
            } finally {
                setFetchingDocs(false);
            }
        };

        fetchDocuments();
    }, [selectedCategory]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setErrorMessage("");
            setSuccessMessage("");
        }
    };

    const handleUpload = async () => {
        if (!file || !selectedCategory) return;

        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1500)); // Giả delay

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("category", selectedCategory);

            const response = await fetch("http://localhost:4000/api/knowledge/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            setSuccessMessage("Tải lên thành công!");
            setUploadedFiles((prev) => [...prev, file.name]);
            setFile(null);
        } catch (err) {
            setErrorMessage("Lỗi khi tải tài liệu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-h-420px bg-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Danh mục thủ tục</h1>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`cursor-pointer p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center flex flex-col items-center gap-3
                            ${selectedCategory === cat.id ? "ring-2 ring-blue-500" : ""}
                        `}
                    >
                        {cat.icon}
                        <p className="font-semibold">{cat.name}</p>
                    </div>
                ))}
            </div>

            <Dialog
                open={selectedCategory !== null}
                onClose={() => {
                    setSelectedCategory(null);
                    setFile(null);
                    setErrorMessage("");
                    setSuccessMessage("");
                    setUploadedFiles([]);
                }}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
                        <DialogTitle className="text-lg font-semibold mb-4 text-center flex items-center gap-2 justify-center">
                            <FilePlus2 className="w-5 h-5 text-blue-600" />
                            Tải và xem tài liệu -{" "}
                            {categories.find((cat) => cat.id === selectedCategory)?.name}
                        </DialogTitle>

                        <div>
                            <h2 className="font-medium mb-2">📄 Danh sách các tài liệu</h2>

                            {fetchingDocs ? (
                                <p>Đang tải danh sách tài liệu...</p>
                            ) : (
                                <ul className="bg-gray-50 p-3 rounded-md max-h-60 overflow-y-auto text-sm mb-4">
                                    {uploadedFiles.length > 0 ? (
                                        uploadedFiles.map((name, idx) => (
                                            <li key={idx} className="py-1 border-b last:border-none">
                                                {name}
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">Chưa có tài liệu nào.</p>
                                    )}
                                </ul>
                            )}

                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="mb-4 w-full"
                            />

                            {file && (
                                <div className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md text-sm mb-3">
                                    <span className="truncate">{file.name}</span>
                                    <button onClick={() => setFile(null)}>
                                        <X className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            )}
                            {errorMessage && (
                                <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
                            )}
                            {successMessage && (
                                <p className="text-green-600 text-sm mb-2">{successMessage}</p>
                            )}
                            <div className="flex justify-end">
                                <Button onClick={handleUpload} disabled={!file || loading}>
                                    {loading ? "Đang tải..." : "Tải lên"}
                                </Button>
                            </div>
                        </div>

                        <div className="mt-6 text-right">
                            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                                Đóng
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
}
