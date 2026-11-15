const db=require('../config/db');
exports.getUserPosts=async(req,res)=>{
 try{const [rows]=await db.query('SELECT u.id AS user_id,u.name,u.email,p.id AS post_id,p.title FROM users u JOIN posts p ON u.id=p.user_id ORDER BY p.id DESC');res.json(rows);}
 catch(e){res.status(500).json({message:e.message});}
};
exports.getPostComments=async(req,res)=>{
 try{const [rows]=await db.query('SELECT p.id AS post_id,p.title,c.id AS comment_id,c.content AS comment FROM posts p LEFT JOIN comments c ON p.id=c.post_id ORDER BY p.id DESC,c.id');res.json(rows);}
 catch(e){res.status(500).json({message:e.message});}
};
