const { v4 } = require('uuid');
const reportSql = require('../sql/reportSql');
const fileService = require('./fileService');
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

    async remove(id) {
        const findReport = await reportSql.findById(id);
        if (!findReport.length) throw serverError.NotFound('Доклад не найден!');
        await fileService.deleteFile(findReport[0].report_filename);
        await reportSql.removeById(id);
    }

}

module.exports = new reportService();