const db = require('../db');

class userSql {

    create(id, email, password, surname, name, fathername, academic_degree, academic_title, work_address, job_title) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO users (id, email, password, surname, name, fathername, academic_degree, academic_title, work_address, job_title) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, email, password, surname, name, fathername, academic_degree, academic_title, work_address, job_title], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?;', [email], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    findById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE id = ?;', [id], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    findAll() {
        return new Promise((resolve, reject) => {
            db.query('SELECT id, surname, name, fathername FROM users;', (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    update(id, changes) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE users SET ? WHERE id = ?', [changes, id], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    removeById(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    setCode(email, code) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE users SET reset_code = ? WHERE email = ?', [code, email], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    removeCode(id) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE users SET reset_code = NULL WHERE id = ?', [id], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

}

module.exports = new userSql();