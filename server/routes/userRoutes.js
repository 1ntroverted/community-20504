const router=require('express').Router();
const c=require('../controllers/userController');
const {auth}=require('../middleware/auth');
router.post('/register',c.register);
router.post('/login',c.login);
router.get('/me',auth,c.me);
router.put('/me',auth,c.update);
router.delete('/me',auth,c.remove);
module.exports=router;
