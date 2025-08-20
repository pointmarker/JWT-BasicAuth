const express = require('express'),
controller = require('../controllers/auth.controller');
const { authorize } = require('../middleware/auth.middleware'),
router = express.Router();

router.route('/register').post(controller.register);
router.route('/login').post(controller.login);
router.route('/token').post(controller.token);
router.route('/users').get(authorize, controller.users);
router.route('/user/:username').get(authorize, controller.user)
router.route('/logout').post(authorize,controller.logout)

module.exports = router;