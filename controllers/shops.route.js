const express = require('express');
const productModel = require('../models/products.model');
const productsModel = require("../models/products.model");
const shopModel=require('../models/shop.model')
const multer = require('multer');
const router = express.Router();
const moment = require('moment');
const fs = require('fs');
const { paginate } = require('./../config/default.json');
const { dirname } = require('path');
const { dir } = require('console');
const { allCategories } = require('../models/products.model');

//Xem màn hình shop
router.get('/', async function (req, res) {
    res.redirect('information');
});

router.get("/shops-information/:id", async function (req, res) {
  const shopID = +req.params.id;
  
  let listProductByShopID = await shopModel.getProductByShopID(shopID);

  let catList = await shopModel.getCatByShopID(shopID);
  let subCatList = await shopModel.getSubCatByShopID(shopID);
  let category = [];
  for (item of catList) {
    let allCat = {};
    allCat.tenCap1 = item.Cat;
    allCat.maCap1=item.danhmuccap1
    allCat.shopID=shopID;
    let arrSub = [];
    for (sub of subCatList) {
      if (item.danhmuccap1 === sub.danhmuccap1) {
        sub.shopID=shopID;
        arrSub.push(sub);
      }
    }
    allCat.tenCap2 = arrSub;
    category.push(allCat);
  }

  res.render("vwShopInfo/shop_detail", {
    listProductByShopID,
    category,
    totalProduct: listProductByShopID.length,
    shopID,
  });
});

//Search thep danh muc cap 1
router.get("/shops-information/:id/:idcat/byCat1", async function (req, res) {
  console.log("ok");
  let shopID = +req.params.id;
  let CatID= +req.params.idcat;
  let listProductByShopID = await shopModel.getProductByShopIDcat(shopID,CatID);

  let catList = await shopModel.getCatByShopID(shopID);
  let subCatList = await shopModel.getSubCatByShopID(shopID);
  console.log(catList);
  // console.log(subCatList);
  let category = [];
  for (item of catList) {
    let allCat = {};
    allCat.tenCap1 = item.Cat;
    allCat.maCap1=item.danhmuccap1
    allCat.shopID=shopID;
    let arrSub = [];
    for (sub of subCatList) {
      if (item.danhmuccap1 === sub.danhmuccap1) {
        sub.shopID=shopID;
        arrSub.push(sub);
      }
    }
    allCat.tenCap2 = arrSub;
    category.push(allCat);
  }
  console.log(category);

  res.render("vwShopInfo/shop_detail", {
    listProductByShopID,
    category,
    totalProduct: listProductByShopID.length,
    shopID,
  });
});

//Search thep danh muc cap 2
router.get("/shops-information/:id/:idCat/byCat2", async function (req, res) {
  let shopID = +req.params.id;
  let CatID= +req.params.idCat;
  let listProductByShopID = await shopModel.getProductByShopIDcatSub(shopID,CatID);

  let catList = await shopModel.getCatByShopID(shopID);
  let subCatList = await shopModel.getSubCatByShopID(shopID);
  console.log(catList);
  let category = [];
  for (item of catList) {
    let allCat = {};
    allCat.tenCap1 = item.Cat;
    allCat.maCap1=item.danhmuccap1
    allCat.shopID=shopID;
    let arrSub = [];
    for (sub of subCatList) {
      if (item.danhmuccap1 === sub.danhmuccap1) {
        sub.shopID=shopID;
        arrSub.push(sub);
      }
    }
    allCat.tenCap2 = arrSub;
    category.push(allCat);
  }
  console.log(category);

  res.render("vwShopInfo/shop_detail", {
    listProductByShopID,
    category,
    totalProduct: listProductByShopID.length,
    shopID,
  });
});

router.post("/shops-information/:id/search", async function (req, res) {
  let search_term = req.body.search_term;
  let shopID = req.params.id;
  req.session.search_term = search_term;
  if (search_term === "" || search_term.length < 3)
    return res.redirect(`/shops/shops-information/${shopID}`);
  res.redirect(`/shops/products/${shopID}`);
});
router.get("/products", async function (req, res) {
  let user = req.session.authUser;
  if (user==null)
  {
    res.redirect('/login');
  }
  let shopID=await shopModel.getShopID(+user.maso);
  let listProductByShopID = await shopModel.getProductByShopID(shopID.maso);
  res.render('vwShop/shop_products',{
    layout: 'shop_manage.hbs',
    listProductByShopID
  })
});
//Xem ds sản phẩm của shop
router.get("/products/:id", async function (req, res) {
  let shopID = req.params.id;
  let search_term = req.session.search_term;

  let listProductByShopID = await productsModel.searchRelevantForShop(
    search_term,
    shopID
  );

  if (listProductByShopID !== null)
    for (let i = 0; i < listProductByShopID.length; i++) {
      let img = await productsModel.getImages(+listProductByShopID[i].maso);
      listProductByShopID[i].link = img[0].link;
    }

  let catList = await shopModel.getCatByShopID(shopID);
  let subCatList = await shopModel.getSubCatByShopID(shopID);
  // console.log(catList);
  // console.log(subCatList);
  let category = [];
  for (item of catList) {
    let allCat = {};
    allCat.tenCap1 = item.Cat;
    let arrSub = [];
    for (sub of subCatList) {
      if (item.danhmuccap1 === sub.danhmuccap1) {
        arrSub.push(sub);
      }
    }
    allCat.tenCap2 = arrSub;
    category.push(allCat);
  }

  res.render("vwShopInfo/shop_detail_for_search", {
    listProductByShopID,
    category,
    totalProduct: listProductByShopID.length,
    shopID,
  });
});



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

  var toString = (dateObj) => {
      var mm = parseInt(dateObj.substring(5, 7) )
      var yyyy = parseInt(dateObj.substring(0, 4))
      mm = mm.toString();
      yyyy = yyyy.toString(); 
      return "Tháng " + mm + ", " + yyyy;
  }

  var today = new Date()
  var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  var tomonth = new Date(y, m + 1, 0);
  var last7Months = []
  var last7Days = []
  var i = 0;
  var n = 7;
  last7Days.push(today)
  last7Months.push(tomonth)
  var last7daysIncome = []
  var last7monthIncome  = []
  i = 0;
  var timeDate = last7Days[i].toISOString().substring(0, 10)
  var timeMonth = last7Months[i].toISOString().substring(0, 10)
  last7daysIncome.push({id: i, x: timeDate, y: await shopModel.incomePreDate(shopId.maso, timeDate)})
  last7monthIncome.push({id: i, x: timeMonth, y: await shopModel.incomePreDate(shopId.maso,timeMonth)})
  for( i = 1; i < n; i++){
    last7Days.push(new Date(last7Days[i-1].getTime() - 24*60*60*1000))
    last7Months.push(prevMonth(last7Months[i-1]))
    timeDate = last7Days[i].toISOString().substring(0, 10)
    timeMonth = last7Months[i].toISOString().substring(0, 10)
    last7daysIncome.push({id: i, x: timeDate, y: await shopModel.incomePreDate(shopId.maso, timeDate)})
    last7monthIncome.push({id: i, x: timeMonth, y: await shopModel.incomePreDate(shopId.maso,timeMonth)})
  }
  console.log(last7daysIncome)
  console.log(last7monthIncome)

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
    last7daysIncome,
    last7monthIncome,
    getMoneyMonth,
      layout: 'shop_manage.hbs'
    });
})
//Xem đơn hàng
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
  await shopModel.rowProperties(getInfoBillByOffset);
  console.log(getInfoBillByOffset);

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
  await shopModel.rowProperties(getConfirmBillByOffset);

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
  await shopModel.rowProperties(getTravellingBillByOffset);
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
  await shopModel.rowProperties(getTravelledBillByOffset);
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
  await shopModel.rowProperties(getDiscardBillByOffset);

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
  await shopModel.rowProperties(getInfoBillByOffset);

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
  await shopModel.rowProperties(getConfirmBillByOffset);

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
  await shopModel.rowProperties(getTravellingBillByOffset);

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
  await shopModel.rowProperties(getTravelledBillByOffset);

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
  await shopModel.rowProperties(getDiscardBillByOffset);

  res.json(getDiscardBillByOffset);
});

//Chi tiết đơn hàng
router.get('/bills-detail/:id', async function (req, res) {
  let id=+req.params.id;
  let listBillDetail=await shopModel.getDetailBillInfo(id);

  let listSanPham=await shopModel.getListProductByBill(id);

  for (item of listSanPham)
  {
    item.giaban=productModel.formatPrice(item.giaban);
    item.dongia=productModel.formatPrice(item.dongia);
  }
  listBillDetail.listSanPham=listSanPham;
  listBillDetail.isNotAvailableUpdate=(listBillDetail.tinhtrangdon===3 || listBillDetail.tinhtrangdon===4);
  listBillDetail.tonggiatien=productModel.formatPrice(listBillDetail.tonggiatien);
  console.log(listBillDetail);

  res.render('vwShop/shop_bill_detail',{
    listBillDetail,
    layout: 'shop_manage.hbs'
    });
})

//Trang cập nhật đơn hàng
router.get('/update-bills-detail/:id', async function (req, res) {
  let id=+req.params.id;
  let listBillDetail=await shopModel.getDetailBillInfo(id);

  let listSanPham=await shopModel.getListProductByBill(id);

  for (item of listSanPham)
  {
    item.giaban=productModel.formatPrice(item.giaban);
    item.dongia=productModel.formatPrice(item.dongia);
  }

  listBillDetail.listSanPham=listSanPham;
  listBillDetail.tonggiatien=productModel.formatPrice(listBillDetail.tonggiatien);

  res.render('vwShop/update_shop_bill',{
    listBillDetail,
      layout: 'shop_manage.hbs'
    });
})

//Trang cập nhật đơn hàng post
router.post('/update-bills-detail/:id', async function (req, res) {
  let id=+req.params.id;
  let status=+req.body.status_bill;

  let listBillDetail=await shopModel.getDetailBillInfo(id);

  if (listBillDetail.tinhtrangdon != status)
  {
    await shopModel.updateStatusBill(id,status);

    await shopModel.insertStatusBill(id,status);
  }
  
  res.redirect("/shops/bills");
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

router.get('/new', async function (req, res) {
  res.render('vwShop/shop_create_product',{
      layout: 'shop_manage.hbs'
    });
})

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
  
  var sex = 0;
  if(req.body.gioitinhsudung === "Nữ"){
    sex=1;
  }else if(req.body.gioitinhsudung === "Unisex"){
    sex=2;
  }

  const new_data = {
    danhmuccap2: +req.body.danhmuccap2,
    giaban: +req.body.giaban,
    gioitinhsudung: sex,
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
  const link = await productModel.getPic(req.session.fakeProduct.maso);
  if(link !== null){
    for(var i=0;i<link.length;i++){
      var smalllink = link[i].link.split('/').join('\\');
      smalllink = __dirname.replace('\\controllers',smalllink);
      fs.access(smalllink, fs.F_OK, (err) => {
        if (err) {
          return;
        }
        //file exists
        fs.unlink(smalllink,(err)=>{
          if(err){
            return;
          }
        })
      })
    }
  }
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

router.get('/edit-product/:id',async function(req,res){
  const product = await productModel.getSingleProductById(req.params.id);
  const cat1Num = await productModel.getCat1ofCat2(product.danhmuccap2);
  const pics = await productModel.getPic(req.params.id);
  req.session.edit_product_id = req.params.id;
  var link = []; 
  for(var i=0;i<pics.length;i++){
    link.push(pics[i].link);
  }
  if(product === null)  res.json(false);
  else{
    var isFemale = false;
    var isUnisex = false;
    if(product.gioitinhsudung===1){
      isFemale = true;
    }else if(product.gioitinhsudung===2){
      isUnisex = true;
    }
    if(req.session.shop.maso === product.cuahang){
      res.render('vwShop/shop_create_product',{
        layout: 'shop_manage.hbs',
        product: product,
        cat1Num: cat1Num.danhmuccap1,
        isFemale: isFemale,
        isUnisex: isUnisex,
        link: link,
        pictures: null,
      });
    }else{
      res.render('404',{
        err_name : '401 UNAUTHORIZED',
        err_description: 'You don\'t own this product',
      })
    }
  }
})

router.post('/edit-product',async function(req,res){
  var sex = 0;
  if(req.body.gioitinhsudung === "Nữ"){
    sex=1;
  }else if(req.body.gioitinhsudung === "Unisex"){
    sex=2;
  }

  const new_data = {
    danhmuccap2: +req.body.danhmuccap2,
    giaban: +req.body.giaban,
    gioitinhsudung: sex,
    kichthuoc: req.body.kichthuoc,
    mota: req.body.mota,
    noisx: req.body.noisanxuat,
    soluong: +req.body.soluong,
    ten: req.body.tensanpham,
    cuahang: req.session.shop.maso,
  }
  const condition = {maso:req.session.edit_product_id};
  await productModel.modifyProduct(new_data,condition);
  req.session.edit_product_id = null;
  res.json(true);
})

module.exports = router;