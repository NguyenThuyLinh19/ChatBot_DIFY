const StatsModel = require('../models/stats.model')

const getStats = async (req, res) => {
    try {
        const stats = await StatsModel.getStats();
        res.json(stats);
    } catch (error) {
        console.error('Lỗi lấy thống kê:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { getStats };
