const express = require('express'),
authRoute = require('./auth.route')
router = express.Router();

router.use('/auth', authRoute)

module.exports = router;