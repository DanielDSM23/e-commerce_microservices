const router = require('express').Router();
const userController = require('./../controllers/user');
const { verifyUser } = require('../middlewares/jwt');

router.get('/me', verifyUser, userController.getUserInfos);

module.exports = router;
