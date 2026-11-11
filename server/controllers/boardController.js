const db = require('../config/db');

// 게시글 목록 조회 + 회원 JOIN
exports.getBoards = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                p.id,
                p.user_id,
                p.title,
                p.content,
                p.created_at,
                u.name AS writer
            FROM posts p
            INNER JOIN users u
                ON p.user_id = u.id
            ORDER BY p.id DESC
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 게시글 상세 조회
exports.getBoard = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT
                p.*,
                u.name AS writer,
                u.email
            FROM posts p
            INNER JOIN users u
                ON p.user_id = u.id
            WHERE p.id = ?
        `, [req.params.id]);

        if (!rows.length) {
            return res.status(404).json({
                message: '게시글이 없습니다.'
            });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 게시글 등록
exports.createBoard = async (req, res) => {
    try {
        const { user_id, title, content } = req.body;

        if (!user_id || !title?.trim() || !content?.trim()) {
            return res.status(400).json({
                message: '작성자, 제목, 내용을 입력하세요.'
            });
        }

        const [result] = await db.execute(
            `INSERT INTO posts (user_id, title, content)
             VALUES (?, ?, ?)`,
            [user_id, title.trim(), content.trim()]
        );

        res.status(201).json({
            message: '게시글 등록 성공',
            id: result.insertId
        });
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                message: '존재하지 않는 회원입니다.'
            });
        }

        res.status(500).json({ message: error.message });
    }
};

// 게시글 수정
exports.updateBoard = async (req, res) => {
    try {
        const { user_id, title, content } = req.body;

        if (!user_id || !title?.trim() || !content?.trim()) {
            return res.status(400).json({
                message: '작성자, 제목, 내용을 입력하세요.'
            });
        }

        const [result] = await db.execute(
            `UPDATE posts
             SET user_id = ?, title = ?, content = ?
             WHERE id = ?`,
            [user_id, title.trim(), content.trim(), req.params.id]
        );

        if (result.affectedRows === 0) {
            const [rows] = await db.execute(
                'SELECT id FROM posts WHERE id = ?',
                [req.params.id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    message: '게시글이 없습니다.'
                });
            }
        }

        res.json({ message: '게시글 수정 성공' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 게시글 삭제
exports.deleteBoard = async (req, res) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM posts WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: '게시글이 없습니다.'
            });
        }

        res.json({ message: '게시글 삭제 성공' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};