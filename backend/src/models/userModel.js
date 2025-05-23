const mongoose = require('mongoose');

/**
 * @schema UserSchema
 * @description Schema definition for user authentication data
 */
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    }
});

// Create User model from schema
const User = mongoose.model('User', userSchema);

module.exports = User;