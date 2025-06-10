const express = require('express');
const router = express.Router();
const getUserPreferencesController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/preferences/:username', verifyToken, getUserPreferencesController);

module.exports = router;