const db = require('../utils/db');

module.exports = {
    async allUser(){
        const sql = `select * from taikhoan `;
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

    // async singleByEmail(email){
    //     const sql = `select * from user where email= '${email}'`;
    //     const [rows, fields] = await db.load(sql);
    //     if(rows.length === 0)
    //         return null;
    //     return rows[0];
    // },

    // async singleById(id){
    //     const sql = `select * from user where user_id= '${id}'`;
    //     const [rows, fields] = await db.load(sql);
    //     if(rows.length === 0)
    //         return null;
    //     return rows[0];
    // },

    async add(user){
        const [result, fields] = await db.add(user,'taikhoan');
        return result;
    },

    // async patch(user){
    //     var condition={user_id: user.user_id};
    //     //delete (user.user_id);
    //     const [result, fields] = await db.patch(user,condition,'user');
    //     return result;
    // },

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