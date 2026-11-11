const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 서버 확인
app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1');

        res.json({
            success: true,
            message: 'MySQL 연결 성공'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// API 연결
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/boards', require('./routes/boardRoutes'));
app.use('/api/join', require('./routes/joinRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});