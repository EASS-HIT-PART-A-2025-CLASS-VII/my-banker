const express = require('express');
const router = express.Router();
const {
    loginController,
    registerController,
    updateUserController,
    deleteUserController,
} = require('../controllers/authenticationController');
const verifyToken = require('../middlewares/verifyToken');

/**
 * @description Handle user login requests
 */
router.post('/login', loginController);

/**
 * @description Handle new user registration
 */
router.post('/register', registerController);

/**
 * @description Handle user information updates
 */
router.patch('/update', verifyToken, updateUserController);

/**
 * @description Handle user account deletion
 */
router.delete('/delete', verifyToken, deleteUserController);

module.exports = router;