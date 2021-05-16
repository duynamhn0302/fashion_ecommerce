const db = require('../utils/db');

module.exports = {
    async lockUser(id){
        await db.patch({'status' : 0}, {'maso' : id}, 'taikhoan');
    },
    async allUser(){
        const sql = `select * from taikhoan where status = 1` ;
        const [rows, fields] = await db.load(sql);
        return rows;
    },
    async singleByUsername(username){
        const sql = `select * from taikhoan where username = '${username}'`;
        const [rows, fields] = await db.load(sql);
        if(rows.length === 0)
            return null;
        return rows[0];
    },

    async add(user){
        const [result, fields] = await db.add(user,'taikhoan');
        return result;
    },

    async modifyAvatar(new_avatar,userId){
        const new_data = {
            avatar: new_avatar,
        }
        const condition = {
            maso: userId,
        }
        const [rows, fields] = await db.patch(new_data,condition,'taikhoan');
        return rows;
    },

    async patch(user){
        var condition={email: user.email};
        //delete (user.user_id);
        const [result, fields] = await db.patch(user, condition,'taikhoan');
        return result;
    },

    async upgradeToShop(userId){
        var condition = {maso: userId};
        var new_data = {vaitro: 1};
        const [rows,fields] = await db.patch(new_data,condition,'taikhoan');
        return rows;
    },

    async getAllBillsFromUserId(userId) {
        const [rows, fields] = await db.load(`select distinct donhang.maso, donhang.tinhtrangdon, donhang.tonggiatien
        from donhang join chitietdonhang on chitietdonhang.donhang = donhang.maso
        where donhang.taikhoan = ${userId}`)

        return rows.length ? rows : null;
    },

    async getAllYetConfirmedBillsFromUserId(userId) {
        const [rows, fields] = await db.load(`select distinct donhang.maso, donhang.tinhtrangdon, donhang.tonggiatien
        from donhang join chitietdonhang on chitietdonhang.donhang = donhang.maso
        where donhang.taikhoan = ${userId} and donhang.tinhtrangdon = 1`)

        return rows.length ? rows : null;
    },

    async getAllTravelingBillsFromUserId(userId) {
        const [rows, fields] = await db.load(`select distinct donhang.maso, donhang.tinhtrangdon, donhang.tonggiatien
        from donhang join chitietdonhang on chitietdonhang.donhang = donhang.maso
        where donhang.taikhoan = ${userId} and donhang.tinhtrangdon = 2`)

        return rows.length ? rows : null;
    },

    async getAllTraveledBillsFromUserId(userId) {
        const [rows, fields] = await db.load(`select distinct donhang.maso, donhang.tinhtrangdon, donhang.tonggiatien
        from donhang join chitietdonhang on chitietdonhang.donhang = donhang.maso
        where donhang.taikhoan = ${userId} and donhang.tinhtrangdon = 3`)

        return rows.length ? rows : null;
    },

    async getAllCanceledBillsFromUserId(userId) {
        const [rows, fields] = await db.load(`select distinct donhang.maso, donhang.tinhtrangdon, donhang.tonggiatien
        from donhang join chitietdonhang on chitietdonhang.donhang = donhang.maso
        where donhang.taikhoan = ${userId} and donhang.tinhtrangdon = 4`)

        return rows.length ? rows : null;
    },

    async getBillDetail(userId, billId) {
        const [rows, fields] = await db.load(`select donhang.tongsosanpham, donhang.tonggiatien, donhang.tinhtrangdon, chitietdonhang.sanpham, sanpham.ten, sanpham.kichthuoc, sanpham.giaban, cuahang.ten as cuahang, taikhoan.email, taikhoan.hoten, taikhoan.maso, taikhoan.sdt, chitietdonhang.soluong
        from donhang join chitietdonhang on donhang.maso = chitietdonhang.donhang join lichsutinhtrangdon on lichsutinhtrangdon.donhang = donhang.maso
        join sanpham on sanpham.maso = chitietdonhang.sanpham join cuahang on cuahang.maso = sanpham.cuahang join taikhoan on taikhoan.maso = donhang.taikhoan
        where donhang.taikhoan = ${userId} and donhang.maso = ${billId}
        group by chitietdonhang.sanpham`)

        return rows.length ? rows : null;
    },

    // async changeInfo(user) {
    //     let condition = {email: user.email};
    //     const [rows, fields] = await db.patch(user, condition, 'user');
    //     return true;
    // },

    // async changePassword(userID, newPassword) {
    //     const sql = `update user set password = '${newPassword}' where user_id = '${userID}'`;
    //     const [rows, fields] = await db.load(sql);
    //     return true;
    // },

    // async brief(){
    //     const sql = `select user_id,name,email from user where role = 0`;
    //     const [rows, fields] = await db.load(sql);
    //     if(rows.length === 0)
    //         return null;
    //     return rows;
    // },

    // async lock(){
    //     const sql = `select user_id,name,email from user where role = 3`;
    //     const [rows, fields] = await db.load(sql);
    //     if(rows.length === 0)
    //         return null;
    //     return rows;
    // },

    // async briefLect(){
    //     const sql = `select user_id,name,email from user where role = 1`;
    //     const [rows, fields] = await db.load(sql);
    //     if(rows.length === 0)
    //         return null;
    //     return rows;
    // },

    // async lockLect(){
    //     const sql = `select user_id,name,email from user where role = 4`;
    //     const [rows, fields] = await db.load(sql);
    //     if(rows.length === 0)
    //         return null;
    //     return rows;
    // },

    // async cat(){
    //     const sql = 'select a.*,count from (SELECT * from db.category) a LEFt JOIN (select categoty_id,count(categoty_id) as count from db.course GROUP BY categoty_id) b ON a.category_id=b.categoty_id';
    //     const [rows, fields] = await db.load(sql);
    //     if(rows.length === 0)   return null;
    //     return rows;
    // },

    // async addCat(cat){
    //     const [rows, fields] = await db.add(cat,'category');
    //     return rows;
    // }

    async checkShop(userId){
        const [rows, fields] = await db.load(`SELECT * FROM cuahang WHERE taikhoan = ${userId}`);
        console.log(rows);
        if(rows.length===0) return true;
        return false;
    },

    async addShop(data){
        const [rows,fields] = await db.add(data,'cuahang');
        return rows;
    },
    async topNUser(n){
        const sql = `select taikhoan.*, count(donhang.maso) as soluongdon, SUM(donhang.tonggiatien) as tienmua
        from  donhang join taikhoan on donhang.taikhoan = taikhoan.maso
        WHERE donhang.tinhtrangdon = 3
        GROUP BY taikhoan.maso
        LIMIT ${n}`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },
    
    async countUserOnMonth(month){
        const sql = `select COUNT(maso) as numberUser
        from taikhoan
        where taikhoan.ngaymo < "${month}"`;
        const [rows, fields] = await db.load(sql);
        if (rows.length===0) 
            return 0;
        return rows[0].numberUser;
    },
    async countShopOnMonth(month){
        const sql = `select COUNT(maso) as numberShop
        from cuahang
        where cuahang.ngaymo < "${month}"`;
        const [rows, fields] = await db.load(sql);
        if (rows.length===0) 
            return 0;
        return rows[0].numberShop;
    }
    ,
    async users_shop_bytime(n){
 
        var prevMonth = function (dateObj) {
            console.log(dateObj)
            var mm = parseInt(dateObj.substring(5, 7))
            var dd = dateObj.substring(8, 10)
            var yyyy = parseInt(dateObj.substring(0, 4)) 
            if (mm > 1) {
                mm -= 1;
            } else {
              mm = 12;
              yyyy -= 1;
            }
            dd = dd.toString();
            if (mm >= 10)
                mm = mm.toString();
            else
                mm = "0" + mm.toString();
            yyyy = yyyy.toString(); 
            return yyyy + "-" + mm + "-" + dd
          };
        var toString = (dateObj) => {
            var mm = parseInt(dateObj.substring(5, 7) )
            var yyyy = parseInt(dateObj.substring(0, 4))
            mm = mm.toString();
            yyyy = yyyy.toString(); 
            return "Tháng " + mm + ", " + yyyy;
        }
        
        var countUserShop = []
        var today = new Date().toISOString().substring(0, 10)
        var months = []
        var i = 0;
        months.push(prevMonth(today))
        var countUser = await this.countUserOnMonth( months[i])
        var countShop = await this.countShopOnMonth( months[i])
        countUserShop.push({ time: toString(months[i]), users: countUser, shops: countShop })
        for(i = 1; i < n; i++){
            months.push(prevMonth(months[i-1]))
            countUser = await this.countUserOnMonth( months[i])
            countShop = await this.countShopOnMonth( months[i])
            countUserShop.push({ time: toString(months[i]), users: countUser, shops: countShop })
        }
        return countUserShop;
    }
}