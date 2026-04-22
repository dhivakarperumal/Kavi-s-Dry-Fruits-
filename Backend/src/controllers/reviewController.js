const db = require('../config/db');
const crypto = require('crypto');

const createReviewId = () => {
    return 'REV-' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

exports.getReviews = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM reviews ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addReview = async (req, res) => {
    try {
        const { userName, comment, image, selected, userId, orderId, rating } = req.body;
        const reviewId = createReviewId();
        
        const [result] = await db.query(
            'INSERT INTO reviews (reviewId, userName, comment, image, selected, userId, orderId, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [reviewId, userName, comment, image || null, selected || false, userId || null, orderId || null, rating || 0]
        );

        res.status(201).json({ id: result.insertId, reviewId, message: 'Review added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { userName, comment, image, selected, rating } = req.body;

        await db.query(
            'UPDATE reviews SET userName = ?, comment = ?, image = ?, selected = ?, rating = ? WHERE id = ?',
            [userName, comment, image || null, selected || false, rating || 0, id]
        );

        res.json({ message: 'Review updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM reviews WHERE id = ?', [id]);
        res.json({ message: 'Review deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
