const express = require('express');
const productModel = require('../models/products.model');
const multer = require('multer');
const router = express.Router();
const moment = require('moment');

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
  var fakedata;
    req.session.fakeProduct = {   //du lieu gia
      ten: '',
      noisx: '',
      mota:'',
      kichthuoc:'',
      gioitinhsudung: true,
      giaban: 0,
      soluong: 0,
      diemdanhgia: 0,
      luotdanhgia: 0,
      danhmuccap2: 1,
      cuahang:1,
      status:1,
      ngaymo: null,
    };
    fakedata = await productModel.addProduct(req.session.fakeProduct);
    req.session.fakeProduct['maso'] = fakedata.insertId;
  res.json(names);
})

router.post('/unloadFakeProduct',async function(req,res){
  await productModel.delPic(req.session.fakeProduct.maso);
  await productModel.delProduct(req.session.fakeProduct.maso);
  req.session.fakeProduct = null;
  res.json(true);
})

router.post('/add-product',async function(req,res){
  var date = Date.now();
  var update = moment(date).format("YYYY-MM-DD");

  const new_data = {
    danhmuccap2: +req.body.danhmuccap2,
    giaban: +req.body.giaban,
    gioitinhsudung: (req.body.gioitinhsudung==="Nam"),
    kichthuoc: req.body.kichthuoc,
    mota: req.body.mota,
    noisx: req.body.noisanxuat,
    soluong: +req.body.soluong,
    ten: req.body.tensanpham,
    cuahang: req.session.shop.maso,
    ngaymo: update,
  }
  const condition = {maso:req.session.fakeProduct.maso};
  await productModel.modifyProduct(new_data,condition);
  res.json(true);
})

router.post('/upload-product-images',async function(req,res){
  await productModel.delPic(req.session.fakeProduct.maso);
  const storage = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, './resources/images/')
    },
    filename: function(req,file,cb){
      cb(null, file.originalname)
    }
  })

  const upload = multer({storage: storage});
  
  upload.array('input-image',8)(req, res,async function(err){
    if(err){
      console.log(err);
    } else{
      const fakePic = {
        sanpham: req.session.fakeProduct.maso,
        link: "/resources/images/"+req.files[0].originalname
      }
      await productModel.addPic(fakePic);
      res.json(true);
    }
  })
})

module.exports = router;