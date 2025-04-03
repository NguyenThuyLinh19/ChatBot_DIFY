const FormData = require('form-data');
require('dotenv').config();
const fetch = require('node-fetch');

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Chuyển đổi encoding của tên file từ latin1 sang utf8
        const fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');

        // Log thông tin file nhận từ frontend
        console.log("Received file:", {
            originalname: fileName,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        // Tạo form-data để gửi đến API thứ hai
        const formData = new FormData();

        // Dữ liệu JSON cho trường 'data'
        const dataObject = {
            indexing_technique: "high_quality",
            process_rule: {
                rules: {
                    pre_processing_rules: [
                        { id: "remove_extra_spaces", enabled: true },
                        { id: "remove_urls_emails", enabled: true }
                    ],
                    segmentation: {
                        separator: "###",
                        max_tokens: 500
                    }
                },
                mode: "custom"
            }
        };

        // Thêm trường 'data' với nội dung JSON
        formData.append('data', JSON.stringify(dataObject), {
            contentType: 'application/json'
        });

        // Thêm trường 'file' với file nhận được từ client
        formData.append('file', req.file.buffer, {
            filename: fileName,
            contentType: req.file.mimetype
        });

        // Gọi API thứ hai để upload file kèm dữ liệu
        const apiUrl = 'http://localhost/v1/datasets/dec9386d-05a7-4941-9563-dc8196953247/document/create-by-file';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                ...formData.getHeaders(),
                Authorization: 'Bearer dataset-9BsVCS5Ufl6zYUmzMzURB1n5'
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", errorText);
            return res.status(response.status).json({ error: errorText });
        }

        const result = await response.json();

        // Trả về thông báo thành công
        res.json({ message: 'Thành công', result });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

module.exports = { uploadFile };
