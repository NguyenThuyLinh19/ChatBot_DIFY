"use client";
import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const KnowledgeUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            if (event.target.files.length > 1) {
                setErrorMessage("Chỉ được up 1 file 1 lúc.");
                setFile(null);
            } else {
                setErrorMessage("");
                setSuccessMessage("");
                setFile(event.target.files[0]);
            }
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setErrorMessage("");
    };

    const handleUpload = async (): Promise<void> => {
        if (!file) return;

        // Bật hiệu ứng loading
        setLoading(true);

        // Giả lập hiệu ứng load 2 giây
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:4000/api/knowledge/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                setErrorMessage("Upload failed: " + errorText);
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log("Upload success:", data);
            setSuccessMessage("Upload thành công!");
            setFile(null);
        } catch (error) {
            console.error("Error uploading file:", error);
            setErrorMessage("Error uploading file: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-gray-100 min-h-screen">
            <Card className="w-full max-w-md p-4 text-center">
                <CardContent className="flex flex-col gap-4 items-center">
                    <label className="w-full p-6 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
                        <input type="file" className="hidden" onChange={handleFileChange} />
                        <Upload className="w-10 h-10 text-gray-500 mx-auto" />
                        <p className="text-sm text-gray-500">Kéo thả hoặc chọn file</p>
                    </label>
                    {file && (
                        <div className="w-full border-t pt-4 flex justify-between items-center">
                            <span className="truncate">{file.name}</span>
                            <button onClick={handleRemoveFile}>
                                <X className="w-5 h-5 text-red-500" />
                            </button>
                        </div>
                    )}
                    <p className="text-sm text-gray-500">
                        Chỉ hỗ trợ định dạng: TXT, Markdown, MDX, PDF, HTML, XLSX, XLS, DOCX, CSV, MD, HTM.
                    </p>
                    {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
                    {successMessage && <p className="text-sm text-green-500">{successMessage}</p>}
                    <Button onClick={handleUpload} disabled={!file || loading}>
                        {loading ? "Loading..." : "Upload"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default KnowledgeUpload;
