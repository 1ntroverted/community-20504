const db=require('../config/db');
exports.list=async(req,res)=>{
 try{const [rows]=await db.query('SELECT p.id,p.user_id,p.title,p.content,p.created_at,u.name AS writer FROM posts p JOIN users u ON p.user_id=u.id ORDER BY p.id DESC');res.json(rows);}
 catch(e){res.status(500).json({message:e.message});}
};
exports.create=async(req,res)=>{
 try{const {title,content}=req.body;
  if(typeof title!=='string'||!title.trim()||typeof content!=='string'||!content.trim())return res.status(400).json({message:'제목과 내용을 입력하세요.'});
  const [r]=await db.execute('INSERT INTO posts(user_id,title,content) VALUES(?,?,?)',[req.user.id,title.trim(),content.trim()]);res.status(201).json({id:r.insertId,message:'등록 완료'});
 }catch(e){res.status(500).json({message:e.message});}
};
async function owner(req,res){
 const [rows]=await db.execute('SELECT user_id FROM posts WHERE id=?',[req.params.id]);
 if(!rows.length){res.status(404).json({message:'게시글이 없습니다.'});return false;}
 if(rows[0].user_id!==req.user.id){res.status(403).json({message:'본인 게시글만 변경할 수 있습니다.'});return false;}
 return true;
}
exports.update=async(req,res)=>{
 try{if(!await owner(req,res))return;
 const {title,content}=req.body;
 if(typeof title!=='string'||!title.trim()||typeof content!=='string'||!content.trim())return res.status(400).json({message:'제목과 내용을 입력하세요.'});
 await db.execute('UPDATE posts SET title=?,content=? WHERE id=? AND user_id=?',[title.trim(),content.trim(),req.params.id,req.user.id]);res.json({message:'수정 완료'});
 }catch(e){res.status(500).json({message:e.message});}
};
exports.remove=async(req,res)=>{
 try{if(!await owner(req,res))return;await db.execute('DELETE FROM posts WHERE id=? AND user_id=?',[req.params.id,req.user.id]);res.json({message:'삭제 완료'});}
 catch(e){res.status(500).json({message:e.message});}
};
