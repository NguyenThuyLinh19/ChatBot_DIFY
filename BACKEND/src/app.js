const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/user.routes')
const authRoutes = require('./routes/auth.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const chatSessionRoutes = require('./routes/chatSession.routes');
const messageRoutes = require('./routes/message.routes');
const statsRoutes = require('./routes/stats.routes');
const knowledgeRoutes = require('./routes/knowledge.routes')
const feedbackRoutes = require('./routes/feedback.routes')
const difyRoutes = require('./routes/dify.routes')

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000', // Chỉ định origin cụ thể của frontend
    credentials: true,               // Cho phép gửi credentials (cookie, authorization header, TLS client certificate)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chatbots', chatbotRoutes);
app.use('/api/chat-sessions', chatSessionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', statsRoutes)
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/feedback', feedbackRoutes)
app.use("/api/dify", difyRoutes);

// Error handling middlewares
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;