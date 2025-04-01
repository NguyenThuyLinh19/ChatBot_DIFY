"use client";
import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const KnowledgeUpload: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleUpload = (): void => {
        console.log("Uploading files:", files);
        // Gửi files lên backend xử lý
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-gray-100 min-h-screen">
            <Card className="w-full max-w-md p-4 text-center">
                <CardContent className="flex flex-col gap-4 items-center">
                    <label className="w-full p-6 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <Upload className="w-10 h-10 text-gray-500 mx-auto" />
                        <p className="text-sm text-gray-500">Kéo thả hoặc chọn file</p>
                    </label>
                    {files.length > 0 && (
                        <div className="w-full border-t pt-4">
                            <ul className="space-y-2">
                                {files.map((file, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center p-2 bg-gray-200 rounded-lg"
                                    >
                                        <span className="truncate w-4/5">{file.name}</span>
                                        <button onClick={() => removeFile(index)}>
                                            <X className="w-5 h-5 text-red-500" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <Button onClick={handleUpload} disabled={files.length === 0}>
                        Upload
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default KnowledgeUpload;
