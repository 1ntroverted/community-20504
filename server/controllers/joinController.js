const db = require('../config/db');

// JOIN 1: 회원 + 게시글
exports.getUserPosts = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                u.id AS user_id,
                u.name,
                u.email,
                p.id AS post_id,
                p.title,
                p.content
            FROM users u
            INNER JOIN posts p
                ON u.id = p.user_id
            ORDER BY p.id DESC
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// JOIN 2: 게시글 + 댓글
exports.getPostComments = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                p.id AS post_id,
                p.title,
                c.id AS comment_id,
                c.content AS comment
            FROM posts p
            LEFT JOIN comments c
                ON p.id = c.post_id
            ORDER BY p.id DESC, c.id ASC
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};