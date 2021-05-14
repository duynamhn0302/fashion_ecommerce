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
    async getCateName1ById(cate1Id) {
        const [rows, fields] = await db.load(`select ten from danhmuccap1 where maso = ${cate1Id}`);
        return rows[0].ten;
    },
    async getCateName2ById(cate2Id) {
        const [rows, fields] = await db.load(`select ten from danhmuccap2 where maso = ${cate2Id}`);
        return rows[0].ten;
    },
    async getCate1IdFromCate2Id(cate2Id) {
        const [rows, fields] = await db.load(`select danhmuccap1.maso from danhmuccap1 join danhmuccap2 on danhmuccap1.maso = danhmuccap2.danhmuccap1 where danhmuccap2.maso = ${cate2Id}`);
        return rows[0].maso;
    }
}