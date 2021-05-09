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
    const shops = await shopModel.allShop()

    res.status(200).render("vwAdmin/admin-page", {
        layout: 'admin.hbs',
        accounts,
        shops,
    })
});
//view statistics
router.get('/statistics', auth.authAdmin,  async function (req, res, next){
    try {
        const shops = await shopModel.topNShop(30) // Top shop
        const customers = await usersModel.topNUser(30) // Top customer
        const countUserShop = await usersModel.users_shop_bytime(5) // So luong Shop, User 4 thang gan nhat
        console.log(customers)
        res.status(200).render("vwAdmin/admin-statistics", {
          csspath: "admin-page",
          layout: 'admin.hbs',
          shops,
          customers,
          countUserShop,
        })
      }
      catch (error) {
        console.log(error);
      }
});
//view products
router.get('/products', auth.authAdmin, async function (req, res, next){
    const products = await productsModel.allProduct()
    console.log(products)
    res.status(200).render("vwAdmin/admin-products", {
        layout: 'admin.hbs',
        products,
    })
});
  

router.post('/deleteAccount', async (req, res) =>{
    const id = req.body.id;
    console.log(id)
    const url = req.session.retUrl;
    res.redirect(url);
});
router.post('/deleteShop',  async (req, res) =>{
    const id = req.body.id;
    console.log(id)
    const url = req.session.retUrl;
    res.redirect(url);
});
router.post('/admin/deleteProduct', async (req, res)=>{
    const id = req.body.id;
    console.log(id)
    const url = req.session.retUrl;
    res.redirect(url);
});
module.exports = router;
