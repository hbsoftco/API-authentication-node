const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

//User Schema
const UserSchema = mongoose.Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook', 'github', 'gitlab', 'bitbucket'],
        required: true,
    },
    local: {
        email: {
            type: String,
            // unique: true,
            // index: true,
            lowercase: true
        },
        password: {
            type: String
        }
    },
    bitbucket: {
        id: {
            type: String,
        },
        email: {
            type: String,
            // unique: true,
            index: true,
            lowercase: true
        }
    },
    gitlab: {
        id: {
            type: String,
        },
        email: {
            type: String,
            // unique: true,
            index: true,
            lowercase: true
        }
    },
    github: {
        id: {
            type: String,
        },
        email: {
            type: String,
            // unique: true,
            index: true,
            lowercase: true
        }
    },
    google: {
        id: {
            type: String,
        },
        email: {
            type: String,
            // unique: true,
            // index: true,
            lowercase: true
        }
    },
    facebook: {
        id: {
            type: String,
        },
        email: {
            type: String,
            // unique: true,
            // index: true,
            lowercase: true
        }
    },

});

UserSchema.plugin(uniqueValidator);

// Before save we can manage data like this
/*
UserSchema.pre('save', async (next) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwprdHash = await bcrypt.hash(this.password, salt);
        this.password = passwprdHash;
        next();
    } catch (error) {
        next(error);
    }
});
*/

// UserSchema.methods.isValidPassword = async (newPassword) => {
//     try {
//         return await bcrypt.compare(newPassword, this.password);

//     } catch (error) {
//         throw new Error(error);
//     }
// }

// Create model and export that
const User = module.exports = mongoose.model('User', UserSchema);

// Find the user by ID
module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}

// Find the user by Its username
module.exports.getUserByUsername = (email, callback) => {
    const query = { email }
    User.findOne(query, callback);
}

// to register the user
module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.local.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.local.password = hash;
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
