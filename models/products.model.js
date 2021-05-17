const db = require('../utils/db');
const { paginate } = require("./../config/default.json");

module.exports = {
    async informationForListProduct(list){
      if (typeof(list) != typeof([]))
        return list;
        for(var i = 0; i < list.length; i++){
          const reImages = await this.getImages(list[i].maso)
          list[i].avatar = reImages[0].link
          list[i].luotmua = await this.getLuotMua(list[i].maso)
          list[i].star = this.convertRating(list[i].diemdanhgia)
          list[i].giaban = this.formatPrice(list[i].giaban)
          list[i].isNewest = await this.isNewest(list[i].maso)
          list[i].isBestSeller = await this.isBestSeller(list[i].maso)
      }
      return list
    },
    async isNewest(id){
      const sql = `select *
          FROM sanpham
          ORDER BY sanpham.ngaymo DESC`;
      const [rows,fields] = await db.load(sql);
      if(rows[0].maso === id)
        return true;
      return false;
    },
    async isBestSeller(id){ //sua lai
      const sql = `select *
          FROM sanpham
          ORDER BY sanpham.ngaymo DESC`;
      const [rows,fields] = await db.load(sql);
      if(rows[0].maso === id)
        return true;
      return false;
    },
    async getShopFromIdProduct(id){
      const sql = `select cuahang.*, taikhoan.avatar
      from (cuahang join sanpham on cuahang.maso = sanpham.cuahang) join taikhoan on cuahang.maso = taikhoan.maso
      where sanpham.maso = ${id}`;
      const [rows,fields] = await db.load(sql);
      if(rows.length===0) return null;
      return rows[0];
    },
    formatPrice(price){
      return new Intl.NumberFormat('vi-VI', { style: 'currency', currency: 'VND' }).format(price);
    },
    async deleteProduct(id){
        await db.patch({'status' : 0}, {'maso' : id}, 'sanpham');
    },
    async getCat1ofCat2(cat2){
      const sql = `SELECT danhmuccap1 FROM danhmuccap2 WHERE maso = ${cat2}`;
      const [rows,fields] = await db.load(sql);
      if(rows.length===0) return null;
      return rows[0];
    },
    convertRating(n){
        var star = []
        for(var i = 0; i < n; i++){
            star.push(`<i class="fa fa-star"></i>`)
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
        return rows[0].soluong;
    },
    async getComment(id){
        const sql = `select taikhoan.*, danhgia.*
        from (sanpham join danhgia on sanpham.maso = danhgia.sanpham) join taikhoan on taikhoan.maso = danhgia.taikhoan
        WHERE sanpham.maso = ${id}`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },
    async getRelativeProduct(id){
        const sql = `SELECT sanpham.*
        FROM (sanpham join danhmuccap2 on danhmuccap2.maso = sanpham.maso) join (select danhmuccap1.maso
                                            from (sanpham join danhmuccap2 on sanpham.danhmuccap2 = danhmuccap2.maso) join danhmuccap1 on danhmuccap1.maso = danhmuccap2.danhmuccap1
                                            where sanpham.maso = ${id}) dm on danhmuccap2.danhmuccap1 = dm.maso
        where sanpham.maso != ${id} and sanpham.status = 1`;
        const [rows, fields] = await db.load(sql);
        var relativeProduct =  await this.informationForListProduct(rows)
        if(5<relativeProduct.length)
            return relativeProduct.slice(0, 5);
        return relativeProduct;
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
    var topSeller =  await this.informationForListProduct(rows)
   
    if (n < rows.length) return topSeller.slice(0, n);
    return topSeller;
  },
  async topNNew(n) {
    const sql = `select *
        from sanpham
        where sanpham.status = 1
        ORDER BY sanpham.ngaymo desc`;
    const [rows, fields] = await db.load(sql);
    var topNew =  await this.informationForListProduct(rows)
    if (n < rows.length) return topNew.slice(0, n);
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
    async allProductAdmin(){
      const sql = `select sanpham.*, cuahang.ten as tencuahang from sanpham join 
          cuahang on sanpham.cuahang = cuahang.maso where sanpham.status = 1`;
      var [rows, fields] = await db.load(sql);
      rows =  await this.informationForListProduct(rows)
      return rows;
  },
    async allProduct(offset, sort){
        const sql = `select sanpham.*, cuahang.ten as tencuahang from sanpham join 
            cuahang on sanpham.cuahang = cuahang.maso where sanpham.status = 1 order by giaban ${sort} limit ${paginate.limit} offset ${offset}`;
        var [rows, fields] = await db.load(sql);
        rows =  await this.informationForListProduct(rows)
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
    async getPic(productId){
      const sql = `SELECT link FROM hinhanhsanpham WHERE sanpham=${productId}`;
      const [rows,fields] = await db.load(sql);
      if(rows.length===0) return null;
      return rows;
    },
    async delPic(productId){
        const condition = {sanpham:productId}
        const [rows,fields] = await db.del(condition,'hinhanhsanpham');
    },
    async reduceProductNumberAfterPayment(data, condition) {
        const [rows, fields] = await db.patch(data, condition, 'sanpham');
        return rows;
    },
    async getAllProductsByCate1Id(cate1Id, offset, sort) {
        var [rows, fields] = await db.load(
          `select sanpham.* from (danhmuccap1 left join danhmuccap2 on danhmuccap1.maso = danhmuccap2.danhmuccap1) join sanpham on danhmuccap2.maso = sanpham.danhmuccap2
           where sanpham.status = 1 and danhmuccap1.maso = ${cate1Id} order by sanpham.giaban ${sort} limit ${paginate.limit} offset ${offset}`
        );
        rows =  await this.informationForListProduct(rows)
        return rows;
      },
      async getAllProductsByCate2Id(cate2Id, offset, sort) {
        var [rows, fields] = await db.load(
          `select sanpham.* from (danhmuccap1 left join danhmuccap2 on danhmuccap1.maso = danhmuccap2.danhmuccap1) join sanpham on danhmuccap2.maso = sanpham.danhmuccap2 
          where sanpham.status = 1 and danhmuccap2.maso = ${cate2Id} order by sanpham.giaban ${sort} limit ${paginate.limit} offset ${offset}`
        );
        rows =  await this.informationForListProduct(rows)
        return rows;
      },
      async countAllByCate1(cate1ID) {
        const sql = `select COUNT(*) as total from (danhmuccap1 join danhmuccap2 on danhmuccap1.maso = danhmuccap2.danhmuccap1) join sanpham on danhmuccap2.maso = sanpham.danhmuccap2 WHERE sanpham.status = 1 and danhmuccap1.maso = ${cate1ID}`;
        const [rows, fields] = await db.load(sql);
        return rows[0].total;
      },
      async countAllByCate2(cate2ID) {
        const sql = `select COUNT(*) as total from (danhmuccap1 join danhmuccap2 on danhmuccap1.maso = danhmuccap2.danhmuccap1) join sanpham on danhmuccap2.maso = sanpham.danhmuccap2 WHERE sanpham.status = 1 and danhmuccap2.maso = ${cate2ID}`;
        const [rows, fields] = await db.load(sql);
        return rows[0].total;
      },
      async searchRelevant(offset, text, sort) {
        const sql = `select sanpham.*
            from sanpham join danhmuccap2 on sanpham.danhmuccap2 = danhmuccap2.maso join danhmuccap1 on danhmuccap2.danhmuccap1 = danhmuccap1.maso join cuahang on sanpham.cuahang = cuahang.maso
            where sanpham.status = 1 and
            (match(sanpham.ten) against ('${text}' IN NATURAL LANGUAGE MODE)
            or match(danhmuccap1.ten) against ('${text}' IN NATURAL LANGUAGE MODE)
            or match(danhmuccap2.ten) against ('${text}' IN NATURAL LANGUAGE MODE)
            or match(cuahang.ten) against ('${text}' IN NATURAL LANGUAGE MODE)) order by sanpham.giaban ${sort}  limit ${paginate.limit} offset ${offset}`;
        var [rows, fields] = await db.load(sql);
        rows =  await this.informationForListProduct(rows)
        return rows;
      },
      async countSearchRelevant(text) {
        const sql = `select count(*) as c from sanpham where sanpham.status = 1 and match(ten) against ('${text}' IN NATURAL LANGUAGE MODE)`;
        const [rows, fields] = await db.load(sql);
        return rows[0].c;
      },
      async getPaidDate(billId, userId) {
        const sql = `select lichsutinhtrangdon.ngaythang
        from donhang join lichsutinhtrangdon on lichsutinhtrangdon.donhang = donhang.maso
        where donhang.taikhoan = ${userId} and lichsutinhtrangdon.tinhtrang = 1 and donhang.maso = ${billId}`;
        const [rows, fields] = await db.load(sql);
        return rows.length ? rows[0].ngaythang : null;
      },
      async countAllProducts() {
        const sql = `select COUNT(*) as total from sanpham WHERE sanpham.status = 1`;
        const [rows, fields] = await db.load(sql);
        return rows[0].total;
      },
      async allProductWithOffset(offset) {
        const sql = `select * from sanpham where status = 1 limit ${paginate.limit} offset ${offset}`;
        var [rows, fields] = await db.load(sql);
        rows =  await this.informationForListProduct(rows)
        return rows;
      },
      async allCategoriesWithQuantity() {
        var sql = "select * from danhmuccap1";
        var [cate1, fields1] = await db.load(sql);
        for (var i = 0; i < cate1.length; i++) {
          sql =
            'select * from danhmuccap2 where danhmuccap2.danhmuccap1 =  "' +
            cate1[i].maso +
            '"';
          var [cate2, fields2] = await db.load(sql);
          for (var j = 0; j < cate2.length; j++) {
            sql =
              "select COUNT(sanpham.maso) as quantity from (danhmuccap1 join danhmuccap2 on danhmuccap1.maso = danhmuccap2.danhmuccap1) left join sanpham on danhmuccap2.maso = sanpham.danhmuccap2 where danhmuccap2.maso = " +
              cate2[j].maso;
            var [quantities, fields] = await db.load(sql);
            cate2[j].quantity = quantities[0].quantity;
          }
          cate1[i].cate2 = cate2;
          cate1[i].existsCate2 = cate2.length != 0;
        }
        return cate1;
      },
      async getAllProductsByBillId(billID, userId) {
        const sql = `select sanpham.ten
        from donhang join chitietdonhang on chitietdonhang.donhang = donhang.maso join sanpham on sanpham.maso = chitietdonhang.sanpham
        where donhang.taikhoan = ${userId} and donhang.maso = ${billID}`;
        const [rows, fields] = await db.load(sql);
        return rows;
      }
}
