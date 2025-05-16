const express = require('express');
const router = express.Router();
const {
    loginController,
    registerController,
    updateUserController,
    deleteUserController,
} = require('../controllers/authenticationController');
const verifyToken = require('../middlewares/verifyToken');

// POST /api/auth/login
router.post('/login', loginController);

// POST /api/auth/register
router.post('/register', registerController);

router.patch('/update', verifyToken, updateUserController);
router.delete('/delete', verifyToken, deleteUserController);

module.exports = router;
