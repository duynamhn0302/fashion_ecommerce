const db = require('../utils/db');

module.exports = {
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
}