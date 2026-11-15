const crypto = require('crypto');
const db = require('../config/db');
const secret = process.env.AUTH_SECRET || 'local-classroom-development-secret-change-me';
function sign(userId) {
  const payload = Buffer.from(JSON.stringify({ id:userId, exp:Date.now()+24*60*60*1000 })).toString('base64url');
  const sig = crypto.createHmac('sha256',secret).update(payload).digest('base64url');
  return payload+'.'+sig;
}
async function auth(req,res,next) {
  try {
    const token=(req.headers.authorization||'').replace(/^Bearer /i,'');
    const [payload,sig]=token.split('.');
    if(!payload||!sig) return res.status(401).json({message:'로그인이 필요합니다.'});
    const expected=crypto.createHmac('sha256',secret).update(payload).digest('base64url');
    if(sig.length!==expected.length || !crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected))) throw Error('invalid');
    const data=JSON.parse(Buffer.from(payload,'base64url').toString());
    if(data.exp<Date.now()) throw Error('expired');
    const [rows]=await db.execute('SELECT id,name,email,phone FROM users WHERE id=?',[data.id]);
    if(!rows.length) throw Error('deleted');
    req.user=rows[0]; next();
  } catch {res.status(401).json({message:'로그인이 만료되었거나 유효하지 않습니다.'});}
}
module.exports={auth,sign};
