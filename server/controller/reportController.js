const reportService = require("../service/reportService");

class reportController {

    async get(req, res, next) {
        try {
            const id = req.params.id;
            const reports = await reportService.get(id);
            res.json(reports);
        } catch (e) {
            next(e)
        }
    }

    async remove(req, res, next) {
        try {
            const id = req.params.id;
            await reportService.remove(id);
            res.status(200).json();
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new reportController();