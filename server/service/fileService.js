const path = require('path');
const fs = require('fs/promises');
const serverError = require('../exceptions/error');
const { v4 } = require('uuid');

class fileService {

    saveFile(file) {
        const filename = file.name.split('.'),
        type = filename[filename.length - 1];
        file.name = [v4(), type].join('.');
        const filepath = path.resolve('.', 'files', file.name);
        console.log(file.name);
        console.log(file);
        file.mv(filepath, err => {
            if (err) throw serverError.BadRequest('Ошибка при сохранении файла!');
        });
        return file.name;
    }

    async deleteFile(filename) {
        fs.rm(path.resolve('.', 'files', filename))
        .catch(err => {
            if (err) throw serverError.NotFound('Ошибка при удалении файла!');
        });
    }
}

module.exports = new fileService();