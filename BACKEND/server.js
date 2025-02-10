const express = require('express');
const cors = require('cors');
require('dotenv').config();  // Đọc biến môi trường từ file .env
const authRoutes = require('./controller/authController'); // Đường dẫn đến các controller

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Cấu hình CORS
app.use(express.json()); // Middleware để xử lý body request dạng JSON

// Các route liên quan đến đăng ký và đăng nhập
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
