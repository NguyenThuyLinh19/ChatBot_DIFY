require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

const DIFY_API_CHAT = process.env.DIFY_API_CHAT;
const DIFY_TOKEN = process.env.DIFY_TOKEN; // Lấy token từ .env

//Route gửi tin nhắn đến Dify
router.post("/send-message", async (req, res) => {
    const { session_id, message } = req.body;
    console.log("123:", session_id, message)

    if (!message) {
        return res.status(400).json({ error: "Thiếu message" });
    }

    try {
        const response = await axios.post(
            DIFY_API_CHAT,
            {
                response_mode: "blocking",
                conversation_id: "",
                query: input,
                inputs: {},
                model_config: {}
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${DIFY_TOKEN}`
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Lỗi gọi API Dify:", error);
        res.status(500).json({ error: "Lỗi khi gửi tin nhắn đến Dify" });
    }
});

module.exports = router;
