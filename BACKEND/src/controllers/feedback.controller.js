const feedBack = require('../models/feedback.model')

class FeedbackController {
    async getBadResponses(req, res) {
        try {
            const responses = await feedBack.getBadResponses();
            res.json(responses);
        } catch (error) {
            console.error('Lỗi khi lấy phản hồi không tốt:', error);
            res.status(500).json({ message: 'Lỗi máy chủ' });
        }
    }
}

module.exports = new FeedbackController();