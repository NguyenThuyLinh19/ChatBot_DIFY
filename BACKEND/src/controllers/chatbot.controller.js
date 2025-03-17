const Chatbots = require('../models/chatbot.model');
require("dotenv").config();

const DIFY_API_CHAT = process.env.DIFY_API_CHAT;


class ChatbotController {
    // Tạo chatbot mới
    async createChatbot(req, res) {
        try {
            const {
                user_id,
                name,
                description,
                dify_chatbot_id,
                status,
                configuration } = req.body;

            const chatbotId = await Chatbots.createChatbot(
                user_id,
                name,
                description,
                dify_chatbot_id,
                status,
                configuration
            );

            res.status(201).json({ message: 'Tạo chatbot thành công', chatbotId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Lấy thông tin chatbot theo ID
    async getChatbot(req, res) {
        try {
            const chatbot = await Chatbots.getChatbotById(req.params.id);
            if (!chatbot) {
                return res.status(404).json({ message: 'Không tìm thấy chatbot' });
            }
            res.json(chatbot);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Lấy danh sách chatbot của một người dùng
    async getChatbotsByUser(req, res) {
        try {
            const chatbots = await Chatbots.getChatbotsByUser(req.params.user_id);
            res.json(chatbots);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Cập nhật thông tin chatbot
    async updateChatbot(req, res) {
        try {
            const updateData = req.body; // Dữ liệu cập nhật như name, description, status, configuration, ... 
            const affectedRows = await Chatbots.updateChatbot(req.params.id, updateData);
            if (!affectedRows) {
                return res.status(404).json({ message: 'Chatbot not found' });
            }
            res.json({ message: 'Chatbot updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Xóa chatbot theo ID
    async deleteChatbot(req, res) {
        try {
            const affectedRows = await Chatbots.deleteChatbot(req.params.id);
            if (!affectedRows) {
                return res.status(404).json({ message: 'Chatbot not found' });
            }
            res.json({ message: 'Chatbot deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async ChatDify(req, res) {
        try {
            // Lấy token từ header
            const dify_token = req.headers.authorization?.split(" ")[1];

            if (!dify_token) {
                return res.status(401).json({ error: 'Unauthorized: Missing token' });
            }

            // Lấy dữ liệu từ body request
            const { message, session_id } = req.body;
            if (!message) {
                return res.status(400).json({ error: 'Message is required' });
            }

            // Gọi API Dify
            const response = await fetch(DIFY_API_CHAT, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${dify_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: '',
                    model_config: {},
                    query: message,
                    response_mode: 'streaming',
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                return res.status(response.status).json({ error: errorText });
            }

            // Xử lý streaming response từ Dify
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let chunks = []; // Mảng chứa từng phần dữ liệu

            async function readStream() {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });

                    // Phân tách dữ liệu theo dòng (mỗi dòng chứa một JSON)
                    const lines = chunk.split("\n").filter(line => line.trim() !== "");

                    lines.forEach(line => {
                        try {
                            // Parse JSON từng dòng và lưu vào mảng
                            const jsonData = JSON.parse(line.replace(/^data: /, ""));
                            chunks.push(jsonData);
                        } catch (e) {
                            console.error("Lỗi parse JSON:", e);
                        }
                    });
                }
                res.json({ data: chunks }); // Trả về danh sách các sự kiện riêng biệt
            }

            await readStream();

        } catch (error) {
            console.error('Lỗi khi gọi Dify API:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new ChatbotController();
