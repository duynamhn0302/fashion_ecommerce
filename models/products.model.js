const db = require('../utils/db');
module.exports = {
    async deleteProduct(id){
        await db.patch({'status' : 0}, {'maso' : id}, 'sanpham');
    },
    convertRating(n){
        var star = []
        for(var i = 0; i < n; i++){
            star.push(`<i class="fa fa-star-o"></i>`)
        }
        for(var i = n; i < 5; i++){
            star.push(`<i class="fa fa-star-o fa-fade"></i>`)
        }
        return star
    },
    async getLuotMua(id){
        const sql = `select sum(soluong) as soluong
        from donhang join chitietdonhang on donhang.maso = chitietdonhang.donhang
        where donhang.tinhtrangdon = 3 and chitietdonhang.sanpham = ${id}
        GROUP BY chitietdonhang.sanpham`;
        const [rows, fields] = await db.load(sql);
        if (rows.length == 0)
            return 0;
        return rows[0];
    },
    async getComment(id){
        const sql = `select taikhoan.*, danhgia.*
        from (sanpham join danhgia on sanpham.maso = danhgia.sanpham) join taikhoan on taikhoan.maso = danhgia.taikhoan
        WHERE sanpham.maso = ${id}`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },
    async getRelativeProduct(id){
        const sql = `SELECT *
        FROM (sanpham join danhmuccap2 on danhmuccap2.maso = sanpham.maso) join (select danhmuccap1.maso
                                            from (sanpham join danhmuccap2 on sanpham.danhmuccap2 = danhmuccap2.maso) join danhmuccap1 on danhmuccap1.maso = danhmuccap2.danhmuccap1
                                            where sanpham.maso = ${id}) dm on danhmuccap2.danhmuccap1 = dm.maso
        where sanpham.maso != ${id} and sanpham.status = 1`;
        const [rows, fields] = await db.load(sql);
        if(5<rows.length)
            return rows.slice(0, 5);
        return rows;
    },
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
    if (n < rows.length) return rows.slice(0, n);
    return rows;
  },
  async topNNew(n) {
    const sql = `select *
        from sanpham
        where sanpham.status = 1
        ORDER BY sanpham.ngaymo desc`;
    const [rows, fields] = await db.load(sql);
    if (n < rows.length) return rows.slice(0, n);
    return rows;
  },
  async topNCategories(n) {
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
        console.log(id)
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
        const sql = `select sanpham.*, cuahang.ten as tencuahang from sanpham join 
            cuahang on sanpham.cuahang = cuahang.maso where sanpham.status = 1`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },
    async addProduct(data){
        const [rows,fields] = await db.add(data,'sanpham');
        return rows;
    },
    async modifyProduct(newdata,condition){
        const [rows,fields] = await db.patch(newdata,condition,'sanpham');
        return rows;
    },
    async delProduct(productId){
        const condition = {maso:productId}
        const [rows,fields] = await db.del(condition,'sanpham');
        return rows;
    },
    async addPic(data){
        const [rows,fields] = await db.add(data,'hinhanhsanpham');
        return rows;
    },
    async delPic(productId){
        const condition = {sanpham:productId}
        const [rows,fields] = await db.del(condition,'hinhanhsanpham');
    },
    async reduceProductNumberAfterPayment(data, condition) {
        const [rows, fields] = await db.patch(data, condition, 'sanpham');
        return rows;
    }
}
