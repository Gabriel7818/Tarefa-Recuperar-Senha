const router = require('express').Router();

// Route in users
const usersRoutes = require('./users.routes');
router.use('/user', usersRoutes);

module.exports = router;