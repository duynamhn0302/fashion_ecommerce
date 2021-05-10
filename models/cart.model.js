const db = require('../utils/db');

module.exports = {
    async checkCustomerHaveCart(customerId){
        const sql = `SELECT * FROM giohang WHERE taikhoan = ${customerId}`;
        const [rows, fields] = await db.load(sql);
        if(rows.length === 0) return null;
        return rows[0];
    },

    async checkIfProductInCart(productId, cartId){
        const sql = `SELECT * FROM chitietgiohang WHERE giohang = ${cartId} AND sanpham = ${productId}`;
        const [rows, fields] = await db.load(sql);
        if(rows.length === 0) return null;
        return rows[0];
    },

    async addCartForCustomer(data){
        const [rows, fields] = await db.add(data,'giohang');
        console.log(rows[0]);
        if(rows.length === 0) return null;
        return rows;
    },

    async modifyCartForCustomer(data,condition){
        const [rows, fields] = await db.patch(data, condition, 'giohang');
        if(rows.length === 0) return null;
        return rows;
    },

    async addToCartDetail(data){
        const [rows, fields] = await db.add(data,'chitietgiohang');
        if(rows.length === 0) return null;
        return rows;
    },

    async modifyCartDetail(data, condition){
        const [rows, fields] = await db.patch(data, condition, 'chitietgiohang');
        if(rows.length === 0) return null;
        return rows;
    },

    async modifyCartDetail2(data, condition){
        const [rows, fields] = await db.load(`UPDATE chitietgiohang SET soluong=${data.soluong} WHERE giohang=${condition.giohang} AND sanpham=${condition.sanpham}`);
        if(rows.length === 0) return null;
        return rows;
    },

    async sumProductInCart(cartId){
        const [rows,fields] = await db.load(`SELECT SUM(c.soluong) as sl,SUM(c.soluong * c.giaban) as tonggia 
        FROM (SELECT a.*,b.giaban FROM chitietgiohang a JOIN sanpham b ON a.sanpham=b.maso WHERE a.giohang = ${cartId})as c `);
        if(rows.length === 0)   return null;
        return rows[0];
    },

    async getAllProductsWithUserId(userId) {
        const [rows, fields] = await db.load(`select sanpham.ten, sanpham.giaban, sanpham.maso, sanpham.kichthuoc, sanpham.cuahang, chitietgiohang.soluong
        from sanpham join chitietgiohang on sanpham.maso = chitietgiohang.sanpham join giohang on giohang.maso = chitietgiohang.giohang
        where taikhoan = '${userId}'`);
        return rows.length ? rows : null;
    },

    async getShopNameFromProductId(productId) {
        const [rows, fields] = await db.load(`SELECT cuahang.ten 
        FROM cuahang JOIN sanpham ON cuahang.maso = sanpham.cuahang
        WHERE sanpham.maso = '${productId}'`);
        return rows.length ? rows[0] : null;
    }
}