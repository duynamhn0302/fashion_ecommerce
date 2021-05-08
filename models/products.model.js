const db = require('../utils/db');

module.exports = {
    async getSingleProductById(id){
        const sql = `SELECT * FROM sanpham WHERE maso = ${id}`;
        const [rows, fields] = await db.load(sql);
        if(rows.length === 0) return null;
        return rows[0];
    },
}