const requestSql = require('../sql/requestSql');
const serverError = require('../exceptions/error');
const { v4 } = require('uuid');
const reportSql = require('../sql/reportSql');

class requestService {

    async getPersonal(id) {
        const findRequests = await requestSql.findByUserId(id);
        if (!findRequests.length) throw serverError.NotFound('Заявки отсутствуют');
        const requestsWithReports = [];
        for (let i = 0; i < findRequests.length; i++) {
            const findReports = await reportSql.findByRequestId(findRequests[i].id);
            requestsWithReports.push({
                request: {
                    id: findRequests[i].id,
                    housing_need: findRequests[i].housing_need,
                    status: findRequests[i].status
                },
                reports: findReports
            });
        }
        return requestsWithReports;
    }

    async getAll() {
        const requests = await requestSql.findPending();
        if (!requests.length) throw serverError.NotFound('Заявок на рассмотрении нет');
        return requests;
    }

    async getOne(id) {
        const findRequest = await requestSql.findById(id);
        if (!findRequest.length) throw serverError.NotFound('Заявка не найдена!');
        const findReports = await reportSql.findByRequestId(findRequest[0].id);
        return {
            request: {
                id: findRequest[0].id,
                housing_need: findRequest[0].housing_need,
                status: findRequest[0].status
            },
            reports: findReports
        }
    }

    async insert(userID, housing_need) {
        const id = v4();
        await requestSql.create(id, housing_need, userID);
        return {id, housing_need, status: 'pending'};
    }

    // async update(id, changes) {
    //     let findRequest = await requestSql.findById(id);
    //     if (!findRequest.length) throw serverError.NotFound('Заявка не найдена!');
    //     if (!Object.keys(changes).length) 
    //         return {
    //             id: findRequest[0].id, 
    //             housing_need: findRequest[0].housing_need, 
    //             status: findRequest[0].status, 
    //         };
    //     await requestSql.update(id, changes);
    //     findRequest = await requestSql.findById(id);
    //     return {
    //         id: findRequest[0].id, 
    //         housing_need: findRequest[0].housing_need, 
    //         status: findRequest[0].status, 
    //     }
    // }

    async remove(id) {
        const findRequest = await requestSql.findById(id),
            reports = reportSql.findByRequestId(id);
        if (!findRequest.length) throw serverError.NotFound('Заявка не найдена!');
        await requestSql.removeById(id);
        return reports;
    }

    async response(id, status) {
        let findRequest = await requestSql.findById(id);
        if (!findRequest.length) throw serverError.NotFound('Заявка не найдена!');
        await requestSql.response(id, status);
        findRequest = await requestSql.findById(id);
        return findRequest[0];
    }
}

module.exports = new requestService();