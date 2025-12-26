const serverError = require('../exceptions/error');
const userService = require('../service/userService');
const { validationResult } = require('express-validator');

class userController {

    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(serverError.BadRequest('Ошибка при валидации!', errors.array()))
            const userData = await userService.registration(req.body);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const userData = await userService.login(req.body);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData)
        } catch (e) {
            next(e) 
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200).json();
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async update(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return next(serverError.BadRequest('Ошибка при валидации!', errors.array()))
            const userData = await userService.update({ ...req.body, ...req.params });
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.json(userData);
        } catch (e) {
            next(e)
        }
    }

    async sendCode(req, res, next) {
        try {
            const email = req.body.email;
            const userID = await userService.sendCode(email);
            res.json(userID);
        } catch (e) {
            next(e)
        }
    }

    async resetPassword(req, res, next) {
        try {
            const {id, code, password} = req.body;
            await userService.resetPassword(id, code, password);
            res.status(200).json();
        } catch (e) {
            next(e)
        }
    }

    async remove(req, res, next) {
        try {
            await userService.remove(req.params.id);
            res.clearCookie('refreshToken');
            return res.status(200).json();
        } catch (e) {
            next(e)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getUsers();
            res.json(users);
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new userController();