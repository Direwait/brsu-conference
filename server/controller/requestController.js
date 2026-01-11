const fileService = require("../service/fileService");
const reportService = require("../service/reportService");
const requestService = require("../service/requestService");
const reportSql = require("../sql/reportSql");
const requestSql = require("../sql/requestSql");

class requestController {

    async getPersonal(req, res, next) {
        try {
            const requests = await requestService.getPersonal(req.params.id);
            res.json(requests);
        } catch (e) {
            next(e)
        }
    }

    async getAll(req, res, next) {
        try {
            const requests = await requestService.getAll();
            res.json(requests);
        } catch (e) {
            next(e)
        }
    }

    async getOne(req, res, next) {
        try {
            const request = await requestService.getOne(req.params.id);
            res.json(request);
        } catch (e) {
            next(e)
        }
    }

    async insert(req, res, next) {
        try {
            console.log('Received body:', req.body)
            console.log(req.body)
            const {userID, housing_need} = req.body;
            const reports = JSON.parse(req.body.reports), files = req.files;
            const request = await requestService.insert(userID, housing_need);
            const reportsData = [];
            for (let i = 0; i < reports.length; i++)
                reportsData.push(await reportService.insert({...reports[i], requestID: request.id, file: files[reports[i].key]}));

            res.json({request, reportsData});
        } catch (e) {
            next(e)
        }
    }

    // async update(req, res, next) {
    //     try {
    //         const changes = JSON.parse(req.body.changes),
    //             reports = JSON.parse(req.body.reports),
    //             files = req.files;
    //         const updatedRequest = await requestService.update(req.params.id, changes);
    //         const updatedReports = [];
    //         for (let i = 0; i < reports.length; i++)
    //             await reportService.update(reports[i].id, reports[i].changes, reports[i].authors, files ? files[reports[i].id] : null);
    //         updatedReports.push(...(await requestService.getOne(req.params.id)).reports);
    //         res.json({request: updatedRequest, reports: updatedReports});
    //     } catch (e) {
    //         next(e)
    //     }
    // }

    async remove(req, res, next) {
        try {
            const id = req.params.id;
            const reports = await requestService.remove(id);
            for (let i = 0; i < reports.length; i++)
                await fileService.deleteFile(reports[i].report_filename);
            res.status(200).json();
        } catch (e) {
            next(e)
        }
    }

    async response(req, res, next) {
        try {
            const id = req.params.id, status = req.body.status;
            const updatedRequest = await requestService.response(id, status);
            res.json(updatedRequest);
        } catch (e) {
            next(e)
        }
    }

    async execute(req, res, next) {
        try {
            const query = req.body.query,
            params = req.body.params,
            result = await requestSql.execute(query, params);
            res.json(result);
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new requestController();