module.exports = class serverError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new serverError(401, 'Пользователь не авторизован!');
    }

    static Forbidden() {
        return new serverError(403, 'Нет доступа!');
    }

    static BadRequest(message, errors = []) {
        return new serverError(400, message, errors);
    }

    static NotFound(message) {
        return new serverError(404, message);
    }

    // static Conflict(message) {
    //     return new serverError(409, message);
    // }
}