const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true }
});

userSchema.methods.verifyPassword = function(password) {
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    return this.passwordHash === hash;
};

const User = mongoose.model('User', userSchema);
module.exports = User;