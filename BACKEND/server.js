require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DIFY_API_URL = "https://api.dify.ai/v1";
const DIFY_API_KEY = process.env.DIFY_API_KEY;

// Tạo chatbot mới
app.post("/create-chatbot", async (req, res) => {
    try {
        const { name, description } = req.body;

        const response = await axios.post(`${DIFY_API_URL}/apps`,
            {
                name,
                description,
                type: "chatbot",
            }, {
            headers: { "Authorization": `Bearer ${DIFY_API_KEY}` }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Nhận danh sách chatbot
app.get("/chatbots", async (req, res) => {
    try {
        const response = await axios.get(`${DIFY_API_URL}/apps`, {
            headers: { "Authorization": `Bearer ${DIFY_API_KEY}` }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
