const db = require('../utils/db');

module.exports = {
    async allShop(){
        const sql = `select * from cuahang`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },
    async topNShop(n){
        const sql = `select cuahang.*, SUM(sp.tong) as soluong, SUM(sp.tonggiatien) as doanhso
        from (select chitietdonhang.sanpham , sum(chitietdonhang.soluong) as tong, donhang.tonggiatien
            from (donhang join chitietdonhang on donhang.maso = chitietdonhang.donhang)
            where donhang.tinhtrangdon = 3
            GROUP BY chitietdonhang.sanpham) sp join sanpham on sp.sanpham = sanpham.maso 
                join cuahang on sanpham.cuahang = cuahang.maso
        GROUP BY cuahang.maso
        LIMIT ${n}`;
        const [rows, fields] = await db.load(sql);
        return rows;
    }
}