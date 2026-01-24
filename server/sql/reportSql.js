const db = require('../db');

class reportSql {

    create(id, report_title, report_authors, report_form, report_filename, scientific_direction, requestID) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO reports VALUES (?, ?, ?, ?, ?, ?, ?);', [id, report_title, report_authors, report_form, report_filename, scientific_direction, requestID], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        })
    }

    findById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM reports WHERE id = ?;', [id], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        })
    }

    findByUserId(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT reports.id, reports.report_title, reports.report_authors, reports.report_form, reports.report_filename, reports.scientific_direction, reports.requestID FROM reports INNER JOIN requests ON reports.requestID = requests.id WHERE requests.userID = ?;', [id], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        })
    }

    findByRequestId(requestID) {
        return new Promise((resolve, reject) => {
            db.query('SELECT reports.id, reports.report_title, reports.report_authors, reports.report_form, reports.report_filename, reports.scientific_direction FROM reports INNER JOIN requests ON reports.requestID = requests.id WHERE requests.id = ?;', [requestID], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        })
    }

    removeById(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM reports WHERE id = ?;', [id], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        })
    }

}

module.exports = new reportSql();