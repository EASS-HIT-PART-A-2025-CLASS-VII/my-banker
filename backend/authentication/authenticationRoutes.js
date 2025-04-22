/**
 * @file authenticationRoutes.js
 * @description Defines the routes for user authentication, including login and registration.
 * @module authenticationRoutes
 */

const express = require('express');
const router = express.Router();
const authenticationController = require('./authentication');

/**
 * Route to handle user login.
 * @name POST /login
 * @function
 * @memberof module:authenticationRoutes
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.post('/login', authentication.login);

/**
 * Route to handle user registration.
 * @name POST /register
 * @function
 * @memberof module:authenticationRoutes
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.post('/register', authentication.register);

module.exports = router;