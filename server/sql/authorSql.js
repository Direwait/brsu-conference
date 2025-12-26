const db = require('../db');

class authorSql {

    create(reportID, userID, name) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO authors VALUES (?, ?, ?);', [reportID, userID, name], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    findByReportId(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT authors.userID, authors.name FROM reports INNER JOIN authors ON reports.id = authors.reportID WHERE authors.reportID = ?;', [id], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

    removeByReportId(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM authors WHERE reportID = ?;', [id], (err, results) => {
                if (err) reject(new Error(err.message));
                else resolve(results);
            });
        });
    }

}

module.exports = new authorSql();