const mysql = require('mysql2/promise');
require('dotenv').config();
const settings = {
 host: process.env.DB_HOST || '127.0.0.1',
 port: Number(process.env.DB_PORT || 3306),
 user: process.env.DB_USER || 'root',
 password: process.env.DB_PASSWORD || '',
 database: process.env.DB_NAME || 'community_20504',
 waitForConnections: true,
 connectionLimit: 10
};
const db = mysql.createPool(settings);
async function initializeDatabase() {
 const connection = await mysql.createConnection({...settings, database: undefined});
 try {
  const name = settings.database;
  if (!/^[a-zA-Z0-9_]+$/.test(name) || !name.endsWith('_20504')) throw Error('DB 이름이 올바르지 않습니다');
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await connection.query(`USE \`${name}\``);
  await connection.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL UNIQUE, phone VARCHAR(20), password VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await connection.query(`CREATE TABLE IF NOT EXISTS posts (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, title VARCHAR(200) NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)`);
  await connection.query(`CREATE TABLE IF NOT EXISTS comments (id INT AUTO_INCREMENT PRIMARY KEY, post_id INT NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE)`);
  console.log('DB 및 테이블 준비 완료:', name);
 } finally {await connection.end();}
}
module.exports = db;
module.exports.initializeDatabase = initializeDatabase;
