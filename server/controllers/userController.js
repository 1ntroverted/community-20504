const db=require('../config/db');
const bcrypt=require('bcryptjs');
const {sign}=require('../middleware/auth');
const valid=(name,email)=>typeof name==='string'&&name.trim()&&typeof email==='string'&&/^\S+@\S+\.\S+$/.test(email.trim());
exports.register=async(req,res)=>{
 try{
  const {name,email,password,phone}=req.body;
  if(!valid(name,email)||typeof password!=='string'||password.length<6) return res.status(400).json({message:'이름, 이메일, 6자 이상 비밀번호를 입력하세요.'});
  const hash=await bcrypt.hash(password,10);
  const [r]=await db.execute('INSERT INTO users(name,email,password,phone) VALUES(?,?,?,?)',[name.trim(),email.trim().toLowerCase(),hash,phone||null]);
  res.status(201).json({message:'가입 성공',id:r.insertId});
 }catch(e){res.status(e.code==='ER_DUP_ENTRY'?409:500).json({message:e.code==='ER_DUP_ENTRY'?'이미 가입된 이메일입니다.':e.message});}
};
exports.login=async(req,res)=>{
 try{
  const [rows]=await db.execute('SELECT id,name,email,password FROM users WHERE email=?',[(req.body.email||'').trim().toLowerCase()]);
  if(!rows.length||!await bcrypt.compare(req.body.password||'',rows[0].password))return res.status(401).json({message:'이메일 또는 비밀번호가 틀렸습니다.'});
  res.json({token:sign(rows[0].id),user:{id:rows[0].id,name:rows[0].name,email:rows[0].email}});
 }catch(e){res.status(500).json({message:e.message});}
};
exports.me=(req,res)=>res.json(req.user);
exports.update=async(req,res)=>{
 try{
  const {name,email,phone,password}=req.body;
  if(!valid(name,email))return res.status(400).json({message:'이름과 이메일을 확인하세요.'});
  if(password && password.length<6)return res.status(400).json({message:'비밀번호는 6자 이상이어야 합니다.'});
  if(password){const hash=await bcrypt.hash(password,10);await db.execute('UPDATE users SET name=?,email=?,phone=?,password=? WHERE id=?',[name.trim(),email.trim().toLowerCase(),phone||null,hash,req.user.id]);}
  else await db.execute('UPDATE users SET name=?,email=?,phone=? WHERE id=?',[name.trim(),email.trim().toLowerCase(),phone||null,req.user.id]);
  res.json({message:'프로필 수정 완료'});
 }catch(e){res.status(e.code==='ER_DUP_ENTRY'?409:500).json({message:e.code==='ER_DUP_ENTRY'?'이미 등록된 이메일입니다.':e.message});}
};
exports.remove=async(req,res)=>{
 try{await db.execute('DELETE FROM users WHERE id=?',[req.user.id]);res.json({message:'탈퇴 완료'});}
 catch(e){res.status(500).json({message:e.message});}
};
