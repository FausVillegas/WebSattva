const db = require('../util/database');

module.exports = class User {
    constructor(id, name, email, password, role, googleId){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.googleId = googleId;
    }

    static find(email){
        return db.execute('SELECT * FROM users WHERE email = ?', [email]);
    }

    static save(user) {
        if(!user.googleId) {
            return db.execute(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [user.name, user.email, user.password]
            );
        } else {
            return db.execute(
                'INSERT INTO users (name, email, googleId) VALUES (?, ?, ?)', [user.name, user.email, user.googleId]
            );
        }
    }

    static saveResetToken(userId, resetToken, resetTokenExpiry) {
        return db.execute(
            'UPDATE users SET resetPasswordToken = ?, resetPasswordExpiry = ? WHERE id = ?',
            [resetToken, resetTokenExpiry, userId]
        );
    }

    static findByResetToken(token) {
        return db.execute(
            'SELECT * FROM users WHERE resetPasswordToken = ?', [token]
        );
    }

    static updatePassword(userId, password) {
        return db.execute(
            'UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpiry = NULL WHERE id = ?',
            [password, userId]
        );
    }
};