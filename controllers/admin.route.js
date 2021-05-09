const express = require('express');
const router = express.Router();
const shopModel = require('../models/shop.model');
const usersModel = require('../models/users.model');
const auth = require('../middlewares/routes.mdw');
const productsModel = require('../models/products.model');
const authAdmin = auth.authAdmin
//Admin
  //admin channel
//view account info
router.get('/',   async function (req, res, next){
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
router.get('/statistics',   async function (req, res, next){
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
router.get('/products',  async function (req, res, next){
    const products = await productsModel.allProduct()
    console.log(products)
    res.status(200).render("vwAdmin/admin-products", {
        layout: 'admin.hbs',
        products,
    })
});
  

router.post('/admin/deleteAccount', async (req, res) =>{
    const id = req.body.id;
    console.log(id)
    res.redirect(url);
});
router.post('/admin/deleteShop',  async (req, res) =>{
    const id = req.body.id;
    console.log(id)
    res.redirect(url);
});
router.post('/admin/deleteProduct', async (req, res)=>{
    const id = req.body.id;
    console.log(id)
    res.redirect(url);
});
module.exports = router;
