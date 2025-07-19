require("dotenv").config();
const fetch = require("node-fetch");

exports.addChunk = async (req, res) => {
    try {
        const { question, answer, category } = req.body;

        if (!question || !answer || !category) {
            return res.status(400).json({
                success: false,
                message: "Thiếu dữ liệu đầu vào. Cần có question, answer và category."
            });
        }

        const normalizedKey = category
            .trim()
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "_");

        const datasetId = process.env[`DATASET_${normalizedKey}_ID`];
        const documentId = process.env[`DOCUMENT_${normalizedKey}`];
        const authToken = process.env.DATASET_TOKEN;

        if (!datasetId || !documentId) {
            return res.status(400).json({
                success: false,
                message: `Không tìm thấy cấu hình cho chuyên mục: ${category}.`
            });
        }

        if (!authToken) {
            return res.status(500).json({
                success: false,
                message: "Thiếu token xác thực. Kiểm tra biến môi trường DATASET_TOKEN."
            });
        }

        // Gửi đúng dạng segments
        const difyResponse = await fetch(
            `http://localhost/v1/datasets/${datasetId}/documents/${documentId}/segments`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    segments: [
                        {
                            content: `Question: ${question.trim()};Answer: ${answer.trim()}`,
                            keywords: [category.trim()]
                        }
                    ]
                }),
            }
        );

        const responseData = await difyResponse.json();

        if (!difyResponse.ok) {
            console.error("Dify API Error:", responseData);
            return res.status(difyResponse.status).json({
                success: false,
                message: responseData.message || "Không thể thêm chunk vào Dify.",
                error: responseData
            });
        }

        res.status(201).json({
            success: true,
            message: "Thêm chunk vào knowledge base thành công!",
            data: {
                chunkId: responseData?.data?.[0]?.id || null,
                question: question.trim(),
                answer: answer.trim(),
                category: category,
                createdAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi xử lý yêu cầu.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
