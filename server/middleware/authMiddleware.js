const serverError = require('../exceptions/error');
const tokenService = require('../service/tokenService');

module.exports = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) return next(serverError.UnauthorizedError());
        const accessToken = authorization.split(' ')[1];
        if (!accessToken) return next(serverError.UnauthorizedError());
        const userData = tokenService.validateAccess(accessToken);
        if (!userData) return next(serverError.UnauthorizedError());

        next();
    } catch (e) {
        return next(serverError.UnauthorizedError())
    }
}