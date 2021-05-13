const express = require('express');
const productModel = require('../models/products.model');
const shopModel=require('../models/shop.model')
const multer = require('multer');
const router = express.Router();
const moment = require('moment');
const { paginate } = require('./../config/default.json');

//Xem màn hình shop
router.get('/', async function (req, res) {
    res.redirect('information');
});

router.get('/shops-information/1', async function (req, res) {

  res.render("vwShopInfo/shop_detail");
});

//Xem ds sản phẩm của shop
router.get('/products', async function (req, res) {
  
})
//Xem đơn hàng
router.get('/orders', async function (req, res) {
  
})

router.get('/incomes', async function (req, res) {
  let user = req.session.authUser;
  if (user==null)
  {
    res.redirect('/login');
  }
  let shopId=await shopModel.getShopID(+user.maso);
  let countProductSelling=await shopModel.countProductOfShop(+shopId.maso);
  let countReviewProduct=await shopModel.countStatusProduct(+shopId.maso,0);
  let countBlockProduct=await shopModel.countStatusProduct(+shopId.maso,3);;
  let countDiscardProduct=await shopModel.countStatusProduct(+shopId.maso,2);
  let countTravellingBill=await shopModel.countStatusBill(+shopId.maso,2);//Đơn hàng đang vận chuyển
  let countTravelledBill=await shopModel.countStatusBill(+shopId.maso,3);//Đơn hàng đã vận chuyển
  let countWatingBill=await shopModel.countStatusBill(+shopId.maso,0);//Đơn hàng chờ xác nhận
  let countConfirmingBill=await shopModel.countStatusBill(+shopId.maso,1);//Đơn hàng đang xác nhận
  let countRemoveBill=await shopModel.countStatusBill(+shopId.maso,4);//Đơn hàng đã hủy

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 
  
  if(mm<10) 
  {
      mm='0'+mm;
  }
  today = yyyy+'-'+mm+'-'+dd;

  let moneyToday=await shopModel.getMoneyToday(+shopId.maso,today);
  if (moneyToday.tongtien===null)
  {
    moneyToday.tongtien=0;
  }

  let countBillToday=await shopModel.countBillToday(+shopId.maso,today);
  let countAmountProductSellingToday=await shopModel.countAmountProductSellingToday(+shopId.maso,today);
  let getMoneyMonth=await shopModel.getMoneyMonth(+shopId.maso,today);

  if (countAmountProductSellingToday.tongSanPhamHomNay===null)
  {
    countAmountProductSellingToday.tongSanPhamHomNay=0;
  }

  if (getMoneyMonth.tongTienThang===null)
  {
    getMoneyMonth.tongTienThang=0;
  }

    res.render('vwShop/shop_income',{
      countProductSelling,
      countReviewProduct,
      countBlockProduct,
      countDiscardProduct,
      countTravellingBill,
      countTravelledBill,
      countWatingBill,
      countConfirmingBill,
      countRemoveBill,
      moneyToday,
      countBillToday,
      countAmountProductSellingToday,
      getMoneyMonth,
        layout: 'shop_manage.hbs'
      });
})

router.get('/bills', async function (req, res) {
  let user = req.session.authUser;
  if (user==null)
  {
    res.redirect('/login');
  }
  let shopId=await shopModel.getShopID(+user.maso);

//Tất cả đơn hàng

  let getInfoBill=await shopModel.getInfoBill(shopId.maso);

  var page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = getInfoBill.length;
  let nPages = Math.floor(total / paginate.limit);
  if (total % paginate.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
    });
  }

  const offset = (page - 1) * paginate.limit;

  let getInfoBillByOffset=await shopModel.getInfoBillByOffset(shopId.maso,offset);
  getInfoBillByOffset=await shopModel.addStatusFinished(getInfoBillByOffset);
  getInfoBillByOffset=await shopModel.addDateModified( getInfoBillByOffset);

//Đơn hàng xác nhận

  let getConfirmBill=await shopModel.getInfoBillByStatus(shopId.maso,1);
  if (getConfirmBill==null)
  {
    getConfirmBill=[];
  }

  var pageC = req.query.page || 1;
  if (pageC < 1) pageC = 1;

  const totalC = getConfirmBill.length;
  let nPagesC = Math.floor(totalC / paginate.limit);
  if (totalC % paginate.limit > 0) nPagesC++;
  console.log("totalC: "+totalC);

  const page_numbersC = [];
  for (var i = 1; i <= nPagesC; i++) {
    page_numbersC.push({
      value: i,
      isCurrentPage: i === +pageC,
    });
  }

  const offsetC = (pageC - 1) * paginate.limit;

  let getConfirmBillByOffset=await shopModel.getInfoBillByStatus(shopId.maso,1,offsetC);
  getConfirmBillByOffset=await shopModel.addStatusFinished(getConfirmBillByOffset);
  getConfirmBillByOffset=await shopModel.addDateModified(getConfirmBillByOffset);

  //Đơn hàng đang vận chuyển
  let getTravellingBill=await shopModel.getInfoBillByStatus(shopId.maso,2);

  if (getTravellingBill==null)
  {
    getTravellingBill=[];
  }

  var pageT = req.query.page || 1;
  if (pageT < 1) pageT = 1;

  const totalT = getTravellingBill.length;
  let nPagesT = Math.floor(totalT / paginate.limit);
  if (totalT % paginate.limit > 0) nPagesT++;

  const page_numbersT = [];
  for (var i = 1; i <= nPagesT; i++) {
    page_numbersT.push({
      value: i,
      isCurrentPage: i === +pageT,
    });
  }

  const offsetT = (pageT - 1) * paginate.limit;


  let getTravellingBillByOffset=await shopModel.getInfoBillByStatusOffset(shopId.maso,2,offsetT);
  getTravellingBillByOffset=await shopModel.addStatusFinished(getTravellingBillByOffset);
  getTravellingBillByOffset=await shopModel.addDateModified(getTravellingBillByOffset);
  //Đờn hàng đã vận chuyển
  let getTravelledBill=await shopModel.getInfoBillByStatus(shopId.maso,3);

  if (getTravelledBill==null)
  {
    getTravelledBill=[];
  }

  var pageTe = req.query.page || 1;
  if (pageTe < 1) pageTe = 1;

  const totalTe = getTravelledBill.length;
  let nPagesTe = Math.floor(totalTe / paginate.limit);
  if (totalTe % paginate.limit > 0) nPagesTe++;

  const page_numbersTe = [];
  for (var i = 1; i <= nPagesTe; i++) {
    page_numbersTe.push({
      value: i,
      isCurrentPage: i === +pageTe,
    });
  }

  const offsetTe = (pageTe - 1) * paginate.limit;


  let getTravelledBillByOffset=await shopModel.getInfoBillByStatusOffset(shopId.maso,3,offsetTe);
  getTravelledBillByOffset=await shopModel.addStatusFinished(getTravelledBillByOffset);
  getTravelledBillByOffset=await shopModel.addDateModified(getTravelledBillByOffset);
  //getDiscardBill
  let getDiscardBill=await shopModel.getInfoBillByStatus(shopId.maso,4);

  if (getDiscardBill==null)
  {
    getDiscardBill=[];
  }

  var pageD = req.query.page || 1;
  if (pageD < 1) pageD = 1;

  const totalD = getDiscardBill.length;
  let nPagesD = Math.floor(totalD / paginate.limit);
  if (totalD % paginate.limit > 0) nPagesD++;

  const page_numbersD = [];
  for (var i = 1; i <= nPagesD; i++) {
    page_numbersD.push({
      value: i,
      isCurrentPage: i === +pageD,
    });
  }

  const offsetD = (pageD - 1) * paginate.limit;


  let getDiscardBillByOffset=await shopModel.getInfoBillByStatusOffset(shopId.maso,4,offsetD);
  getDiscardBillByOffset=await shopModel.addStatusFinished(getDiscardBillByOffset);
  getDiscardBillByOffset=await shopModel.addDateModified(getDiscardBillByOffset);

  res.render('vwShop/shop_bill',{
    getInfoBill,
    getConfirmBill,
    getTravellingBill,
    getTravelledBill,
    getDiscardBill,

    getInfoBillByOffset,
    totalRowAll: getInfoBill.length,
    totalPage: +nPages,
    prevPage: +page - 1,
    nextPage: +page + 1,

    getConfirmBillByOffset,
    totalRowC: getConfirmBill.length,
    totalPageC: +nPagesC,
    prevPageC: +pageC - 1,
    nextPageC: +pageC + 1,

    getTravellingBillByOffset,
    totalRowT: getTravellingBill.length,
    totalPageT: +nPagesT,
    prevPageT: +pageT - 1,
    nextPageT: +pageT + 1,

    getTravelledBillByOffset,
    totalRowTe: getTravelledBill.length,
    totalPageTe: +nPagesTe,
    prevPageTe: +pageTe - 1,
    nextPageTe: +pageTe + 1,

    getDiscardBillByOffset,
    totalRowD: getDiscardBill.length,
    totalPageD: +nPagesD,
    prevPageD: +pageD - 1,
    nextPageD: +pageD + 1,




      layout: 'shop_manage.hbs'
    });
})

router.get('/bills.json', async function(req, res) {
  let user = req.session.authUser;
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  let shopId=await shopModel.getShopID(+user.maso);

  let getInfoBill=await shopModel.getInfoBill(shopId.maso);
      
  const total = getInfoBill.length;
  let nPages = Math.floor(total / paginate.limit);
  if (total % paginate.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
    });
  }
  const offset = (page - 1) * paginate.limit;

  let getInfoBillByOffset=await shopModel.getInfoBillByOffset(shopId.maso,offset);
  getInfoBillByOffset=await shopModel.addStatusFinished(getInfoBillByOffset);
  getInfoBillByOffset=await shopModel.addDateModified( getInfoBillByOffset);
  console.log(total);

  res.json(getInfoBillByOffset);
});

router.get('/bills_confirm.json', async function(req, res) {
  let user = req.session.authUser;
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  let shopId=await shopModel.getShopID(+user.maso);

  let getConfirmBill=await shopModel.getInfoBillByStatus(shopId.maso,1);
  if (getConfirmBill==null)
  {
    getConfirmBill=[];
  }

  var pageC = req.query.page || 1;
  if (pageC < 1) pageC = 1;

  const totalC = getConfirmBill.length;
  let nPagesC = Math.floor(totalC / paginate.limit);
  if (totalC % paginate.limit > 0) nPagesC++;

  const page_numbersC = [];
  for (var i = 1; i <= nPagesC; i++) {
    page_numbersC.push({
      value: i,
      isCurrentPage: i === +pageC,
    });
  }

  const offsetC = (pageC - 1) * paginate.limit;

  let getConfirmBillByOffset=await shopModel.getInfoBillByStatus(shopId.maso,1,offsetC);
  getConfirmBillByOffset=await shopModel.addStatusFinished(getConfirmBillByOffset);
  getConfirmBillByOffset=await shopModel.addDateModified(getConfirmBillByOffset);

  res.json(getConfirmBillByOffset);
});

router.get('/bills_travelling.json', async function(req, res) {
  let user = req.session.authUser;
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  let shopId=await shopModel.getShopID(+user.maso);

  let getTravellingBill=await shopModel.getInfoBillByStatus(shopId.maso,2);

  if (getTravellingBill==null)
  {
    getTravellingBill=[];
  }

  var pageT = req.query.page || 1;
  if (pageT < 1) pageT = 1;

  const totalT = getTravellingBill.length;
  let nPagesT = Math.floor(totalT / paginate.limit);
  if (totalT % paginate.limit > 0) nPagesC++;

  const page_numbersT = [];
  for (var i = 1; i <= nPagesT; i++) {
    page_numbersT.push({
      value: i,
      isCurrentPage: i === +pageT,
    });
  }

  const offsetT = (pageT - 1) * paginate.limit;


  let getTravellingBillByOffset=await shopModel.getInfoBillByStatusOffset(shopId.maso,2,offsetT);
  getTravellingBillByOffset=await shopModel.addStatusFinished(getTravellingBillByOffset);
  getTravellingBillByOffset=await shopModel.addDateModified(getTravellingBillByOffset);

  res.json(getTravellingBillByOffset);
});

router.get('/bills_travelled.json', async function(req, res) {
  let user = req.session.authUser;
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  let shopId=await shopModel.getShopID(+user.maso);

  let getTravelledBill=await shopModel.getInfoBillByStatus(shopId.maso,3);

  if (getTravelledBill==null)
  {
    getTravelledBill=[];
  }

  var pageTe = req.query.page || 1;
  if (pageTe < 1) pageTe = 1;

  const totalTe = getTravelledBill.length;
  let nPagesTe = Math.floor(totalTe / paginate.limit);
  if (totalTe % paginate.limit > 0) nPagesTe++;

  const page_numbersTe = [];
  for (var i = 1; i <= nPagesTe; i++) {
    page_numbersTe.push({
      value: i,
      isCurrentPage: i === +pageTe,
    });
  }

  const offsetTe = (pageTe - 1) * paginate.limit;


  let getTravelledBillByOffset=await shopModel.getInfoBillByStatusOffset(shopId.maso,3,offsetTe);
  getTravelledBillByOffset=await shopModel.addStatusFinished(getTravelledBillByOffset);
  getTravelledBillByOffset=await shopModel.addDateModified(getTravelledBillByOffset);

  console.log(getTravelledBillByOffset);
  res.json(getTravelledBillByOffset);
});

router.get('/bills_discard.json', async function(req, res) {
  let user = req.session.authUser;
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  let shopId=await shopModel.getShopID(+user.maso);

  let getDiscardBill=await shopModel.getInfoBillByStatus(shopId.maso,4);

  if (getDiscardBill==null)
  {
    getDiscardBill=[];
  }

  var pageD = req.query.page || 1;
  if (pageD < 1) pageD = 1;

  const totalD = getDiscardBill.length;
  let nPagesD = Math.floor(totalD / paginate.limit);
  if (totalD % paginate.limit > 0) nPagesD++;

  const page_numbersD = [];
  for (var i = 1; i <= nPagesD; i++) {
    page_numbersD.push({
      value: i,
      isCurrentPage: i === +pageD,
    });
  }

  const offsetD = (pageD - 1) * paginate.limit;


  let getDiscardBillByOffset=await shopModel.getInfoBillByStatusOffset(shopId.maso,4,offsetD);
  getDiscardBillByOffset=await shopModel.addStatusFinished(getDiscardBillByOffset);
  getDiscardBillByOffset=await shopModel.addDateModified(getDiscardBillByOffset);

  res.json(getDiscardBillByOffset);
});

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