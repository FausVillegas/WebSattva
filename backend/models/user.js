const db = require('../util/database');

module.exports = class User {
    constructor(name, email, password, role, googleId){
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
};