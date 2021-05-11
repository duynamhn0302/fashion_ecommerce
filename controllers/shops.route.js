const express = require('express');
const productModel = require('../models/products.model');
const router = express.Router();
//Xem màn hình shop
router.get('/', async function (req, res) {
    res.redirect('information');
});
//Xem ds sản phẩm của shop
router.get('/products', async function (req, res) {
  
})
//Xem đơn hàng
router.get('/orders', async function (req, res) {
  
})

router.get('/incomes', async function (req, res) {
    res.render('vwShop/shop_income',{
        layout: 'shop_manage.hbs'
      });
})

router.get('/bills', async function (req, res) {
  res.render('vwShop/shop_bill',{
      layout: 'shop_manage.hbs'
    });
})

router.get('/new', async function (req, res) {
  res.render('vwShop/shop_create_product',{
      layout: 'shop_manage.hbs'
    });
})


//Xem thông tin shop
router.get('/information', async function (req, res) {
    res.render('vwShop/shop_info',{
      layout: 'shop_manage.hbs'
    //   acc: req.session.authUser,
    //   nam: req.session.authUser.gender==='Nam' ,
    //   nu: req.session.authUser.gender==="Nữ",
    //   else: req.session.authUser.gender==="Nam" || req.session.authUser.gender==="Nữ",
    });
  })

//Search sản phẩm nằm trong shop
router.post('/search', async function (req, res) {
  
});

router.post('/cat-1',async function(req,res){
  const names = await productModel.allCategories();
  res.json(names);
})

module.exports = router;