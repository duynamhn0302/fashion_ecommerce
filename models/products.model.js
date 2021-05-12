const db = require('../utils/db');

module.exports = {
    async getSingleProductById(id){
        const sql = `SELECT * FROM sanpham WHERE maso = ${id} and status = 1`;
        const [rows, fields] = await db.load(sql);
        if(rows.length === 0) return null;
        return rows[0];
    },
    async topNSeller(n){
        const sql = `select sanpham.*, sum(chitietdonhang.soluong) as sum
        from (chitietdonhang join donhang on donhang.maso = chitietdonhang.donhang)
                    join sanpham on sanpham.maso = chitietdonhang.sanpham
        where sanpham.status = 1
        group by sanpham.maso
        ORDER BY sum(chitietdonhang.soluong)  DESC`;
        const [rows, fields] = await db.load(sql);
        if(n<rows.length)
            return rows.slice(0, n);
        return rows;
    },
    async topNNew(n){
        const sql = `select *
        from sanpham
        where sanpham.status = 1
        ORDER BY sanpham.ngaymo desc`;
        const [rows, fields] = await db.load(sql);
        if(n<rows.length)
            return rows.slice(0, n);
        return rows;
    },
    async topNCategories(n){
        const sql = `select danhmuccap2.*, sum(sp.sum) as sum
        from danhmuccap2 join
                        (select sanpham.*, sum(chitietdonhang.soluong) as sum
                from (chitietdonhang join donhang on donhang.maso = chitietdonhang.donhang)
                            join sanpham on sanpham.maso = chitietdonhang.sanpham
                group by sanpham.maso
                ORDER BY sum(chitietdonhang.soluong)  DESC) 
                        sp	on danhmuccap2.maso = sp.danhmuccap2
        ORDER BY sum(sp.sum)  DESC`;
        const [rows, fields] = await db.load(sql);
        if(n<rows.length)
            return rows.slice(0, n);
        return rows;
    },
    async allCategories() {
        var sql = 'select * from danhmuccap1';
        var [cate1, fields1] = await db.load(sql);
        
        for(var i = 0; i < cate1.length; i++){
           sql = 'select * from danhmuccap2 where danhmuccap2.danhmuccap1 =  "' + cate1[i].maso + '"';
           var [cate2, fields2] = await db.load(sql);
           cate1[i].cate2 = cate2;
           cate1[i].existsCate2 = (cate2.length != 0);
        }
        return cate1;
    },
    async getImages(id){
        const sql = `select hinhanhsanpham.*
        from sanpham join hinhanhsanpham on sanpham.maso = hinhanhsanpham.sanpham
        where sanpham.status = 1 and sanpham.maso = ${id}`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },
    async single(id){
        const sql = `select * from sanpham where maso=${id} and status = 1`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    async allProduct(){
        const sql = `select * from sanpham where status = 1`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },
    async reduceProductNumberAfterPayment(data, condition) {
        const [rows, fields] = await db.patch(data, condition, 'sanpham');
        return rows;
    }
}