const tableNames = require('../../constants/tableNames');
const db = require('../../db');

module.exports = {
    find() {
        return db(tableNames.subnationalDivision);
    },
};