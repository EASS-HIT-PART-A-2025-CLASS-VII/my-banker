/**
 * @file authenticationModel.js
 * @description Defines the Mongoose schema and model for user authentication.
 * @module authenticationModel
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} User
 * @property {string} username - The username of the user. This field is required.
 * @property {string} password - The hashed password of the user. This field is required.
 */

/**
 * Mongoose schema for the User model.
 * @type {mongoose.Schema<User>}
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

/**
 * Mongoose model for the User schema.
 * @type {mongoose.Model<User>}
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
