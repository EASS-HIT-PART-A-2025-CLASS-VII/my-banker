/**
 * @file authenticationRoutes.js
 * @description Defines the routes for user authentication, including login and registration.
 * @module authenticationRoutes
 */

const express = require('express');
const router = express.Router();
const login = require('./authenticationModules/loginModule');
const register = require('./authenticationModules/registerModule');


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
router.post('/login', login);

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
router.post('/register', register);

/**
 * Route to handle user deletion.
 * @name DELETE /delete
 * @function
 * @memberof module:authenticationRoutes
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.delete('/delete', deleteUser);

/**
 * Route to handle updating user credentials.
 * @name PUT /update
 * @function
 * @memberof module:authenticationRoutes
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.put('/update', update);

module.exports = router;