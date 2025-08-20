const express = require('express'),
controller = require('../controllers/auth.controller');
const { authorize } = require('../middleware/auth.middleware'),
router = express.Router();

router.route('/current-user').get(authorize,controller.currentUser);

module.exports = router;