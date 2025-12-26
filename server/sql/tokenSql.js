const db = require('../db')

class tokenSql {

    create(userID, refreshToken) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO tokens VALUES (?, ?);', [userID, refreshToken], (err, results) => {
                if (err) reject(new Error(err.message))
                else resolve(refreshToken);
            });
        });
    }

    findById(userID) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM tokens WHERE userID = ?;', [userID], (err, results) => {
                if (err) reject(new Error(err.message))
                else resolve(results);
            });
        });
    }

    findByToken(token) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM tokens WHERE refreshToken = ?;', [token], (err, results) => {
                if (err) reject(new Error(err.message))
                else resolve(results);
            });
        });
    }

    update(userID, refreshToken) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE tokens SET refreshToken = ? WHERE userID = ?;', [refreshToken, userID], (err, results) => {
                if (err) reject(new Error(err.message))
                else resolve(results);
            })
        })
    }

    remove(refreshToken) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM tokens WHERE refreshToken = ?;', [refreshToken], (err, results) => {
                if (err) reject(new Error(err.message))
                else resolve(results);
            })
        })
    }

}

module.exports = new tokenSql();