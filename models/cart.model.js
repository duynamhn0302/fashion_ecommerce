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
        const [rows, fields] = await db.load(`select sanpham.ten, sanpham.giaban, sanpham.maso, sanpham.kichthuoc, sanpham.cuahang, chitietgiohang.soluong, chitietgiohang.giohang, sanpham.soluong as conlai
        from sanpham join chitietgiohang on sanpham.maso = chitietgiohang.sanpham join giohang on giohang.maso = chitietgiohang.giohang
        where taikhoan = '${userId}'`);
        return rows.length ? rows : null;
    },

    async getShopNameFromProductId(productId) {
        const [rows, fields] = await db.load(`SELECT cuahang.ten 
        FROM cuahang JOIN sanpham ON cuahang.maso = sanpham.cuahang
        WHERE sanpham.maso = '${productId}'`);
        return rows.length ? rows[0] : null;
    },

    async cartProductsAmountChanged(productId, amount, cartId, all, totalPrice) {
        const [rows, fields] = await db.load(`UPDATE chitietgiohang SET soluong = ${amount} WHERE sanpham = ${productId} and giohang = ${cartId}`);

        const [rows1, fields1] = await db.load(`UPDATE giohang SET tongsosanpham = ${all}, tonggiatien = ${totalPrice} WHERE maso = ${cartId}`);

        return rows.length && rows1.length ? rows : null;
    },

    async cartProductsRemoved(productId, cartId) {
        const [rows, fields] = await db.load(`DELETE FROM chitietgiohang WHERE sanpham = ${productId} and giohang = ${cartId}`);

        return rows.length ? rows : null;
    },

    async cartProductsUpdateAfterRemoving(all, totalPrice, cartId) {
        const [rows, fields] = await db.load(`UPDATE giohang SET tongsosanpham = ${all}, tonggiatien = ${totalPrice} WHERE maso = ${cartId}`);

        return rows.length ? rows : null;
    },

    async getProductsForPayment(cartId) {
        const [rows, fields] = await db.load(`SELECT * FROM chitietgiohang WHERE giohang = ${cartId}`);

        return rows.length ? rows : null;
    },

    async singleByCartId(cartId) {
        const [rows, fields] = await db.load(`SELECT * FROM giohang WHERE maso = ${cartId}`);

        return rows.length ? rows[0] : null;
    },

    async createNewBill(entity) {
        const [rows, fields] = await db.add(entity, 'donhang');

        return rows;
    },

    async createNewBillDetail(entity) {
        const [rows, fields] = await db.add(entity, 'chitietdonhang');

        return rows;
    },

    // async addToHistoryAfterPayment(entity) {
    //     //const [rows1, fields1] = await db.load('SET IDENTITY_INSERT lichsutinhtrangdon ON');

    //     const [rows, fields] = await db.add(entity, 'lichsutinhtrangdon');

    //     return rows;
    // },

    async removeCartAfterPayment(conditionForCart, conditionForCartDetail) {
        const [rows1, fields1] = await db.del(conditionForCartDetail, 'chitietgiohang');
        const [rows, fields] = await db.del(conditionForCart, 'giohang');

        return [rows, rows1];
    }
}