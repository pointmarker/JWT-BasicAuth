const express = require('express'),
authRoute = require('./auth.route'),
apiRoute = require('./api.route')
router = express.Router();

router.use('/auth', authRoute)
router.use('/api',apiRoute)

module.exports = router;