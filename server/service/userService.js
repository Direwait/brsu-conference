const { v4 } = require('uuid');
const bcrypt = require('bcrypt');
const userSql = require('../sql/userSql');
const tokenService = require('./tokenService');
const serverError = require('../exceptions/error');
const tokenSql = require('../sql/tokenSql');
const mailService = require('./mailService');
const reportSql = require('../sql/reportSql');
const fileService = require('../service/fileService');

class userService {

    async registration({email, password, surname, name, fathername, academic_degree, academic_title, work_address, job_title}) {
        const findUser = await userSql.findByEmail(email);
        if (findUser.length) throw serverError.BadRequest('Пользователь с таким email уже зарегистрирован!');
        const userID = v4();
        const role = 'user';
        const hashPassword = await bcrypt.hash(password, 4);
        await userSql.create(userID, email, hashPassword, surname, name, fathername, academic_degree, academic_title, work_address, job_title);
        const tokens = tokenService.generateTokens({ id: userID, email, role });
        await tokenService.saveToken(userID, tokens.refreshToken);
        return {
            ...tokens,
            user: {
                id: userID,
                email,
                surname,
                name,
                fathername,
                academic_degree,
                academic_title,
                work_address,
                job_title,
                role
            }
        }
    }

    async login({email, password}) {
        const findUser = await userSql.findByEmail(email);
        if (!findUser.length) throw serverError.BadRequest('Пользователь с таким email не был найден!');
        const passEquals = await bcrypt.compare(password, findUser[0].password);
        if (!passEquals) throw serverError.BadRequest('Неправильный пароль!');
        const tokens = tokenService.generateTokens({ id: findUser[0].id, email: findUser[0].email, role: findUser[0].role });
        await tokenService.saveToken(findUser[0].id, tokens.refreshToken);
        return {
            ...tokens,
            user: {
                id: findUser[0].id,
                email: findUser[0].email,
                surname: findUser[0].surname,
                name: findUser[0].name,
                fathername: findUser[0].fathername,
                academic_degree: findUser[0].academic_degree,
                academic_title: findUser[0].academic_title,
                work_address: findUser[0].work_address,
                job_title: findUser[0].job_title,
                role: findUser[0].role
            }
        }
    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw serverError.UnauthorizedError();
        const userData = tokenService.validateRefresh(refreshToken);
        const tokenFromDB = await tokenSql.findByToken(refreshToken);
        if (!tokenFromDB.length || !userData) throw serverError.UnauthorizedError();

        const findUser = await userSql.findById(userData.id);
        const tokens = tokenService.generateTokens({ id: findUser[0].id, email: findUser[0].email, role: findUser[0].role });
        await tokenService.saveToken(findUser[0].id, tokens.refreshToken);
        return {
            ...tokens,
            user: {
                id: findUser[0].id,
                email: findUser[0].email,
                surname: findUser[0].surname,
                name: findUser[0].name,
                fathername: findUser[0].fathername,
                academic_degree: findUser[0].academic_degree,
                academic_title: findUser[0].academic_title,
                work_address: findUser[0].work_address,
                job_title: findUser[0].job_title,
                role: findUser[0].role
            }
        }
    }

    async update({id, changes, oldPassword}) {
        if (changes.password) {
            const findUser = await userSql.findById(id);
            const passEquals = await bcrypt.compare(oldPassword, findUser[0].password);
            if (!passEquals) throw serverError.BadRequest('Неправильный пароль!');
            changes.password = await bcrypt.hash(changes.password, 4);
        }

        await userSql.update(id, changes);
        const findUser = await userSql.findById(id);
        const tokens = tokenService.generateTokens({ id: findUser[0].id, email: findUser[0].email, role: findUser[0].role });
        await tokenService.saveToken(findUser[0].id, tokens.refreshToken);
        return {
            ...tokens,
            user: {
                id: findUser[0].id,
                email: findUser[0].email,
                surname: findUser[0].surname,
                name: findUser[0].name,
                fathername: findUser[0].fathername,
                academic_degree: findUser[0].academic_degree,
                academic_title: findUser[0].academic_title,
                work_address: findUser[0].work_address,
                job_title: findUser[0].job_title,
                role: findUser[0].role
            }
        }
    }

    async remove(id) {
        const findUser = await userSql.findById(id);
        if (!findUser.length) throw serverError.NotFound('Пользователь не найден!');
        const reports = await reportSql.findByUserId(id);
        await userSql.removeById(id);
        for (let i = 0; i < reports.length; i++)
            if (reports[i].report_filename) fileService.deleteFile(reports[i].report_filename);
    }

    async getName(id) {
        const findUser = await userSql.findById(id);
        if (!findUser.length) throw serverError.NotFound('Пользователь не найден!');
        return [findUser[0].surname, findUser[0].name, findUser[0].fathername].join(' ');
    }

    async sendCode(email) {
        const findUser = await userSql.findByEmail(email);
        if (!findUser.length) throw serverError.NotFound('Пользователь с данной электронной почтой не зарегистрирован!');
        const code = new Date().getTime().toString();
        await userSql.setCode(email, code);
        await mailService.sendResetMail(email, code);
        return findUser[0].id;
    }

    async resetPassword(id, code, password) {
        const findUser = await userSql.findById(id);
        if (!findUser.length) throw serverError.NotFound('Пользователь не найден!');
        if (code !== findUser[0].reset_code) throw serverError.BadRequest('Неправильный код!');
        await userSql.update(id, {password});
        await userSql.removeCode(id);
    }

    async getUsers() {
        const users = await userSql.findAll();
        if (!users.length) throw serverError.NotFound('Пользователи отсутствуют');
        return users;
    }

}

module.exports = new userService();