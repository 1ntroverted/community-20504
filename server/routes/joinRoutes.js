const express = require('express');
const router = express.Router();

const controller = require('../controllers/joinController');

router.get('/user-posts', controller.getUserPosts);
router.get('/post-comments', controller.getPostComments);

module.exports = router;