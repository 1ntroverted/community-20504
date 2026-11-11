const db = require('../config/db');

// 회원 전체 조회
exports.getUsers = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM users ORDER BY id DESC'
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 회원 상세 조회
exports.getUser = async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: '회원 없음' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 회원 등록
exports.createUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name?.trim() || !email?.trim()) {
            return res.status(400).json({
                message: '이름과 이메일은 필수입니다.'
            });
        }

        const [result] = await db.execute(
            'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)',
            [name.trim(), email.trim(), phone || null]
        );

        res.status(201).json({
            message: '회원 등록 성공',
            id: result.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: '이미 등록된 이메일입니다.'
            });
        }

        res.status(500).json({ message: error.message });
    }
};

// 회원 수정
exports.updateUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name?.trim() || !email?.trim()) {
            return res.status(400).json({
                message: '이름과 이메일은 필수입니다.'
            });
        }

        const [result] = await db.execute(
            `UPDATE users
             SET name = ?, email = ?, phone = ?
             WHERE id = ?`,
            [name.trim(), email.trim(), phone || null, req.params.id]
        );

        if (result.affectedRows === 0) {
            const [rows] = await db.execute(
                'SELECT id FROM users WHERE id = ?',
                [req.params.id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    message: '회원이 없습니다.'
                });
            }
        }

        res.json({ message: '회원 수정 성공' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: '이미 등록된 이메일입니다.'
            });
        }

        res.status(500).json({ message: error.message });
    }
};

// 회원 삭제
exports.deleteUser = async (req, res) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM users WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: '회원이 없습니다.'
            });
        }

        res.json({ message: '회원 삭제 성공' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};