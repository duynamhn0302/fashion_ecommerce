const express = require('express');
const router = express.Router();
const shopModel = require('../models/shop.model');
const usersModel = require('../models/users.model');
const auth = require('../middlewares/auth.mdw');
const productsModel = require('../models/products.model');
//Admin
  //admin channel
//view account info
router.get('/',  auth.authAdmin, async function (req, res, next){
    let user = res.locals.authUser;
    const accounts = await usersModel.allUser()
    for (const acc of accounts) {
        acc.ngaymo = acc.ngaymo.toISOString().substring(0, 10)
    }
    const shops = await shopModel.allShop()
    const products = await productsModel.allProductAdmin()
    for(var i = 0; i < products.length; i++){
        const luot = await productsModel.getLuotMua(products[i].maso)
        if (luot === 0)
            products[i].luotmua = 0
        else
            products[i].luotmua = luot.soluong
    }
    res.status(200).render("vwAdmin/admin-page-t", {
        layout: 'admin2.hbs',
        accounts,
        shops,
        products,
    })
});
//view statistics
router.get('/statistics', auth.authAdmin,  async function (req, res, next){
    try {
        const shops = await shopModel.topNShop(30) // Top shop
        const customers = await usersModel.topNUser(30) // Top customer
        const countUserShop = await usersModel.users_shop_bytime(5) // So luong Shop, User 4 thang gan nhat
        var prevMonth = function(dateObj) {
            var tempDateObj = new Date(dateObj);
          
            if(tempDateObj.getMonth) {
              tempDateObj.setMonth(tempDateObj.getMonth() - 1);
            } else {
              tempDateObj.setYear(tempDateObj.getYear() - 1);
              tempDateObj.setMonth(12);
            }
          
            return tempDateObj
          };
        
          var today = new Date()
          var date = new Date(), y = date.getFullYear(), m = date.getMonth();
          var tomonth = new Date(y, m + 1, 0);
          var last7Months = []
          var i = 0;
          last7Months.push(tomonth)
          var last7monthUsers = []
          var last7monthShops  = []
          var timeMonth = last7Months[i].toISOString().substring(0, 10)
          last7monthUsers.push({id: i, x: timeMonth, y: await usersModel.countUserOnMonth(timeMonth)})
          last7monthShops.push({id: i, x: timeMonth, y: await usersModel.countShopOnMonth(timeMonth)})
          for( i = 1; i < 7; i++){
            last7Months.push(prevMonth(last7Months[i-1]))
            timeMonth = last7Months[i].toISOString().substring(0, 10)
            last7monthUsers.push({id: i, x: timeMonth, y: await usersModel.countUserOnMonth(timeMonth)})
              last7monthShops.push({id: i, x: timeMonth, y: await usersModel.countShopOnMonth(timeMonth)})
          }
        res.status(200).render("vwAdmin/admin-statistics2", {
      
          layout: 'admin2.hbs',
          shops,
          customers,
          last7monthUsers,
          last7monthShops
        })
      }
      catch (error) {
        console.log(error);
      }
});
//view products
router.get('/products', auth.authAdmin, async function (req, res, next){
    const products = await productsModel.allProductAdmin()
    for(var i = 0; i < products.length; i++){
        const luot = await productsModel.getLuotMua(products[i].maso)
        if (luot === 0)
            products[i].luotmua = 0
        else
            products[i].luotmua = luot.soluong
    }
    res.status(200).render("vwAdmin/admin-products", {
        layout: 'admin.hbs',
        products,
    })
});
  

router.post('/deleteAccount', async (req, res) =>{
    console.log(req.body.id)
    if (typeof req.body.id !== 'undefined')
        await usersModel.lockUser(+req.body.id);
    res.redirect('/admin/')
});
router.post('/deleteShop',  async (req, res) =>{
    const id = req.body.id;
    console.log(id)
    const url = req.session.retUrl;
    res.redirect(url);
});
router.post('/deleteProduct', async (req, res)=>{
    console.log(req.body.id)
    if (typeof req.body.id !== 'undefined')
        await productsModel.deleteProduct(+req.body.id);
    res.redirect('/admin/')
});
module.exports = router;
