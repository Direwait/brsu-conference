const serverError = require("../exceptions/error");
const tokenService = require("../service/tokenService");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userData = tokenService.validateAccess(token);
        if (userData.role != 'admin') return next(serverError.Forbidden());

        next();
    } catch (e) {
        return next(serverError.UnauthorizedError());
    }
}