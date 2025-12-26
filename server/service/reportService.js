const { v4 } = require('uuid');
const reportSql = require('../sql/reportSql');
const fileService = require('./fileService');
// const authorSql = require('../sql/authorSql');
// const userService = require('./userService');
const serverError = require('../exceptions/error');

class reportService {

    async get(requestID) {
        const reports = await reportSql.findByRequestId(requestID);
        if (!reports.length) throw serverError.NotFound('Докладов нет');
        return reports;
    }

    async insert({report_title, report_form, scientific_direction, authors, requestID, file}) {
        const id = v4();
        const report_filename = file ? fileService.saveFile(file) : '';
        await reportSql.create(id, report_title, authors, report_form, report_filename, scientific_direction, requestID);
        return {id, report_title, report_form, scientific_direction, report_filename, authors, requestID};
    }

    // async update(id, changes, authors, file) {
    //     let findReport = await reportSql.findById(id);
    //     if (!findReport.length) throw serverError.NotFound('Доклад не найден!');
    //     if (file) {
    //         changes.report_filename = file.name;
    //         await fileService.deleteFile(findReport[0].report_filename);
    //         fileService.saveFile(file);
    //     }
    //     if (authors && authors.length) {
    //         await authorSql.removeByReportId(id);
    //         for (let i = 0; i < authors.length; i++) {
    //             const name = await userService.getName(authors[i]);
    //             await authorSql.create(id, authors[i], name);
    //         }
    //     }
    //     if (!Object.keys(changes).length) return findReport;
    //     await reportSql.update(id, changes);
    //     findReport = await reportSql.findById(id);
    //     findReport.authorNames = await authorSql.findByReportId(id);
    //     return findReport;
    // }

    async remove(id) {
        const findReport = await reportSql.findById(id);
        if (!findReport.length) throw serverError.NotFound('Доклад не найден!');
        await fileService.deleteFile(findReport[0].report_filename);
        await reportSql.removeById(id);
    }

}

module.exports = new reportService();