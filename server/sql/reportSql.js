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

    // update(id, changes) {
    //     return new Promise((resolve, reject) => {
    //         db.query('UPDATE reports SET ? WHERE id = ?;', [changes, id], (err, results) => {
    //             if (err) reject(new Error(err.message));
    //             else resolve(results);
    //         });
    //     })
    // }

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
    
    // findRequests(id) {
    //     return new Promise((resolve, reject) => {
    //         db.query('SELECT reports.id, reports.report_title, reports.report_form, reports.report_filename, reports.scientific_direction FROM reports INNER JOIN reports_requests ON reports.id = reports_requests.reportID WHERE reports_requests.requestID != ? AND reports_requests.reportID = ?;', [requestID, reportID], (err, results) => {
    //             if (err) reject(new Error(err.message));
    //             else resolve(results);
    //         });
    //     })
    // }

    // findLinks(reportID, requestID) {
    //     return new Promise((resolve, reject) => {
    //         db.query('SELECT reports.id, reports.report_title, reports.report_form, reports.report_filename, reports.scientific_direction FROM reports INNER JOIN reports_requests ON reports.id = reports_requests.reportID WHERE reports_requests.requestID != ? AND reports_requests.reportID = ?;', [requestID, reportID], (err, results) => {
    //             if (err) reject(new Error(err.message));
    //             else resolve(results);
    //         });
    //     })
    // }

    // findAuthors(reportID, userID) {
    //     return new Promise((resolve, reject) => {
    //         db.query('SELECT authors.userID, authors.name FROM authors INNER JOIN reports ON reports.id = authors.reportID WHERE reports.id = ? AND authors.userID != ?;', [reportID, userID], (err, results) => {
    //             if (err) reject(new Error(err.message));
    //             else resolve(results);
    //         });
    //     })
    // }

    // linkRequest(reportID, requestID) {
    //     return new Promise((resolve, reject) => {
    //         db.query('INSERT INTO reports_requests VALUES (?, ?);', [reportID, requestID], (err, results) => {
    //             if (err) reject(new Error(err.message));
    //             else resolve(results);
    //         });
    //     })
    // }

    // unlinkRequest(requestID) {
    //     return new Promise((resolve, reject) => {
    //         db.query('DELETE FROM reports_requests WHERE requestID = ?;', [requestID], (err, results) => {
    //             if (err) reject(new Error(err.message));
    //             else resolve(results);
    //         });
    //     })
    // }

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