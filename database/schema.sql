CREATE DATABASE IF NOT EXISTS community_20504
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE community_20504;

-- 회원 테이블
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 게시글 테이블
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- 댓글 테이블
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (post_id)
    REFERENCES posts(id)
    ON DELETE CASCADE
);

-- 테스트 회원
INSERT INTO users (name, email, phone) VALUES
('홍길동', 'hong@test.com', '010-1111-1111'),
('김철수', 'kim@test.com', '010-2222-2222'),
('이영희', 'lee@test.com', '010-3333-3333');

-- 테스트 게시글
INSERT INTO posts (user_id, title, content) VALUES
(1, '첫 번째 게시글', '홍길동의 게시글입니다.'),
(2, '두 번째 게시글', '김철수의 게시글입니다.'),
(1, '세 번째 게시글', '홍길동의 두 번째 게시글입니다.');

-- 테스트 댓글
INSERT INTO comments (post_id, content) VALUES
(1, '첫 번째 댓글입니다.'),
(1, '좋은 글입니다.'),
(2, '잘 읽었습니다.'),
(3, '감사합니다.');

USE community_20504;

-- 회원 비밀번호 컬럼 추가
ALTER TABLE users
ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT '';

-- 이메일 중복 방지
ALTER TABLE users
ADD UNIQUE KEY unique_user_email (email);