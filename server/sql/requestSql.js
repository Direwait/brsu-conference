const db = require('../db');

class requestSql {
    create(id, housing_need, userID) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO requests (id, housing_need, userID) VALUES (?, ?, ?);', [id, parseInt(housing_need, 10), userID], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    findAll() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM requests;', (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    findById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM requests WHERE id = ?;', [id], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    findPending() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM requests WHERE status = "pending";', (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    findByStatus(status) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM requests WHERE status = ?;', [status], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    // update(id, changes) {
    //     return new Promise((resolve, reject) => {
    //         db.query('UPDATE requests SET ? WHERE id = ?;', [changes, id], (err, results) => {
    //             if (err) reject(new Error(err.message));
    //             else resolve(results);
    //         });
    //     });
    // }

    findByUserId(userID) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM requests WHERE userID = ?;', [userID], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    removeById(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM requests WHERE id = ?;', [id], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    response(id, status) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE requests SET status = ? WHERE id = ?;', [status, id], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    execute(query, params) {
        return new Promise((resolve, reject) => {
            db.query(query, params, (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }
}

module.exports = new requestSql();