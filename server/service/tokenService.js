const jwt = require('jsonwebtoken');
const tokenSql = require('../sql/tokenSql');

class tokenService {

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_KEY, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_KEY, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userID, refreshToken) {
        const tokenData = await tokenSql.findById(userID);
        if (tokenData.length) return await tokenSql.update(userID, refreshToken);
        const token = await tokenSql.create(userID, refreshToken);
        return token;
    }

    async removeToken(refreshToken) {
        return await tokenSql.remove(refreshToken);
    }

    validateAccess(token) {
        try {
            const userData = jwt.verify(token, process.env.ACCESS_KEY);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefresh(token) {
        try {
            const userData = jwt.verify(token, process.env.REFRESH_KEY);
            return userData;
        } catch (e) {
            return null;
        }
    }

}

module.exports = new tokenService();