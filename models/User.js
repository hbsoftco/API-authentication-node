const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

//User Schema
const UserSchema = mongoose.Schema({
    // name: {
    //     type: String,
    //     required: true
    // },
    email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // username: {
    //     type: String,
    //     unique: true,
    //     required: true
    // },
    // contact: {
    //     type: String,
    //     required: true
    // },
});

UserSchema.plugin(uniqueValidator);

// Create model and export that
const User = module.exports = mongoose.model('User', UserSchema);

// Find the user by ID
module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}

// Find the user bu Its username
module.exports.getUserByUsername = (username, callback) => {
    const query = {
        username: username
    }
    User.findOne(query, callback);
}

// to register the user
module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

// Compare password
module.exports.comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}
