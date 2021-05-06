const db = require('../utils/db');

module.exports = {
    async getCateMenuLV1(){
        const sql = `SELECT * FROM danhmuccap1`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },
    async getCateMenuLV2ById(idLv1){
        const sql = `SELECT * FROM danhmuccap2 WHERE danhmuccap1=${idLv1}`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },
}