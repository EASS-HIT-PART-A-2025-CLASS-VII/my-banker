/**
 * @file authenticationRoutes.js
 * @description Defines the routes for user authentication, including login and registration.
 * @module authenticationRoutes
 */

const express = require('express');
const router = express.Router();
const login = require('./authenticationModules/loginModule');
const register = require('./authenticationModules/registerModule');
const deleteUser = require('./authenticationModules/deleteModule');
const update = require('./authenticationModules/updateModule');


/**
 * Route to handle user login.
 * @name POST /login
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.post('/login', login);

/**
 * Route to handle user registration.
 * @name POST /register
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.post('/register', register);

/**
 * Route to handle user deletion.
 * @name DELETE /delete
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.delete('/delete', deleteUser);

/**
 * Route to handle updating user credentials.
 * @name PUT /update
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.put('/update', update);

module.exports = router;