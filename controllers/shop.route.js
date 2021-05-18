const express = require('express');
const productModel = require('../models/products.model');
const productsModel = require("../models/products.model");
const shopModel=require('../models/shop.model')
const multer = require('multer');
const router = express.Router();
const moment = require('moment');
const auth = require('./../middlewares/auth.mdw');
const fs = require('fs');
const { paginate } = require('./../config/default.json');
const { paginate_if } = require('./../config/default.json');
const { dirname } = require('path');
const { dir } = require('console');
const { allCategories } = require('../models/products.model');
const { getSLBill } = require('../models/shop.model');

//Xem màn hình shop
router.get('/', async function (req, res) {
    res.redirect('information');
});

//Xem danh sách theo giá tăng dần
router.get("/shops-information/:id/asc", async function (req, res) {
  const shopID = +req.params.id;

  let shopInfo = await shopModel.single(shopID);
  shopInfo.ngaymo = moment(shopInfo.ngaymo).format('DD-MM-YYYY');

  let listProductByShopID = await shopModel.getProductByShopIDByLow(shopID);

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

  let isLow=true;

  /*paginate*/
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = listProductByShopID.length;
  let nPages = Math.floor(total / paginate_if.limit);
  if (total % paginate_if.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
    });
  }

  const offset = (page - 1) * paginate_if.limit;

  /*paginate*/

  listProductByShopID = await shopModel.getProductByShopIDByOffsetByLow(shopID,offset);

  res.render("vwShopInfo/shop_detail", {
    listProductByShopID,
    category,
    totalProduct: total,
    shopID,
    shopInfo,
    isLow,
    maxpage: nPages,
  });
});

//Xem danh sách theo giá giảm dần
router.get("/shops-information/:id/des", async function (req, res) {
  const shopID = +req.params.id;

  let shopInfo = await shopModel.single(shopID);
  shopInfo.ngaymo = moment(shopInfo.ngaymo).format('DD-MM-YYYY');

  let listProductByShopID = await shopModel.getProductByShopIDByHigh(shopID);

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

  let isHigh=true;

  /*paginate*/
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = listProductByShopID.length;
  let nPages = Math.floor(total / paginate_if.limit);
  if (total % paginate_if.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
    });
  }

  const offset = (page - 1) * paginate_if.limit;

  /*paginate*/
  listProductByShopID = await shopModel.getProductByShopIDByOffsetByHigh(shopID,offset);


  res.render("vwShopInfo/shop_detail", {
    listProductByShopID,
    category,
    totalProduct: total,
    shopID,
    shopInfo,
    isHigh,
    maxpage: nPages,
  });
});


router.get("/shops-information/:id", async function (req, res) {
  const shopID = +req.params.id;

  let shopInfo = await shopModel.single(shopID);
  shopInfo.ngaymo = moment(shopInfo.ngaymo).format('DD-MM-YYYY');

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

  let isAll=true;

  /*paginate*/
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = listProductByShopID.length;
  let nPages = Math.floor(total / paginate_if.limit);
  if (total % paginate_if.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
    });
  }

  const offset = (page - 1) * paginate_if.limit;
  /*paginate*/
  listProductByShopID = await shopModel.getProductByShopIDByOffset(shopID,offset);

  res.render("vwShopInfo/shop_detail", {
    listProductByShopID,
    category,
    totalProduct: total,
    shopID,
    shopInfo,
    isAll,
    maxpage: nPages,
  });
});


router.get('/bills_discard.json/:id', async function(req, res) {
    const shopID = +req.params.id;

    let listProductByShopID = await shopModel.getProductByShopID(shopID);

    /*paginate*/
    var page = req.query.page || 1;
    if (page < 1) page = 1;
  
    console.log("Trang: "+page);
    const total = listProductByShopID.length;
    let nPages = Math.floor(total / paginate_if.limit);
    if (total % paginate_if.limit > 0) nPages++;
  
    const page_numbers = [];
    for (var i = 1; i <= nPages; i++) {
      page_numbers.push({
        value: i,
        isCurrentPage: i === +page,
      });
    }

    const offset = (page - 1) * paginate_if.limit;
    /*paginate*/
    listProductByShopID = await shopModel.getProductByShopIDByOffset(shopID,offset);
    console.log(listProductByShopID);
    res.json(listProductByShopID);
  });

  router.get('/bills_discard_low.json/:id', async function(req, res) {
    const shopID = +req.params.id;

    let listProductByShopID = await shopModel.getProductByShopIDByLow(shopID);

    /*paginate*/
    var page = req.query.page || 1;
    if (page < 1) page = 1;
  
    console.log("Trang: "+page);
    const total = listProductByShopID.length;
    let nPages = Math.floor(total / paginate_if.limit);
    if (total % paginate_if.limit > 0) nPages++;
  
    const page_numbers = [];
    for (var i = 1; i <= nPages; i++) {
      page_numbers.push({
        value: i,
        isCurrentPage: i === +page,
      });
    }

    const offset = (page - 1) * paginate_if.limit;
    /*paginate*/
    listProductByShopID = await shopModel.getProductByShopIDByOffsetByLow(shopID,offset);
    console.log(listProductByShopID);
    res.json(listProductByShopID);
  });

  router.get('/bills_discard_high.json/:id', async function(req, res) {
    const shopID = +req.params.id;

    let listProductByShopID = await shopModel.getProductByShopIDByHigh(shopID);

    /*paginate*/
    var page = req.query.page || 1;
    if (page < 1) page = 1;
  
    console.log("Trang: "+page);
    const total = listProductByShopID.length;
    let nPages = Math.floor(total / paginate_if.limit);
    if (total % paginate_if.limit > 0) nPages++;
  
    const page_numbers = [];
    for (var i = 1; i <= nPages; i++) {
      page_numbers.push({
        value: i,
        isCurrentPage: i === +page,
      });
    }

    const offset = (page - 1) * paginate_if.limit;
    /*paginate*/
    listProductByShopID = await shopModel.getProductByShopIDByOffsetByHigh(shopID,offset);
    console.log(listProductByShopID);
    res.json(listProductByShopID);
  });


//Search thep danh muc cap 1
router.get("/shops-information/:id/:idcat/byCat1", async function (req, res) {
  console.log("ok");
  let shopID = +req.params.id;
  let CatID= +req.params.idcat;
  let listProductByShopID = await shopModel.getProductByShopIDcat(shopID,CatID);

  let shopInfo = await shopModel.single(shopID);
  shopInfo.ngaymo = moment(shopInfo.ngaymo).format('DD-MM-YYYY');

  let catList = await shopModel.getCatByShopID(shopID);
  let subCatList = await shopModel.getSubCatByShopID(shopID);
  console.log(catList);
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
  let isCap1=true;

    /*paginate*/
    var page = req.query.page || 1;
    if (page < 1) page = 1;
  
    console.log("Trang: "+page);
    const total = listProductByShopID.length;
    let nPages = Math.floor(total / paginate_if.limit);
    if (total % paginate_if.limit > 0) nPages++;
  
    const page_numbers = [];
    for (var i = 1; i <= nPages; i++) {
      page_numbers.push({
        value: i,
        isCurrentPage: i === +page,
      });
    }

    const offset = (page - 1) * paginate_if.limit;
    /*paginate*/
    listProductByShopID = await shopModel.getProductByShopIDcatOffset(shopID,CatID,offset)

  res.render("vwShopInfo/shop_detail", {
    listProductByShopID,
    category,
    totalProduct: total,
    shopInfo,
    shopID,
    CatID,
    isCap1,
    maxpage: nPages,
  });
});

router.get('/bills_discard_cap1.json/:id/:idcat', async function(req, res) {
  const shopID = +req.params.id;
  let CatID= +req.params.idcat;

  let listProductByShopID = await shopModel.getProductByShopIDcat(shopID,CatID);

  /*paginate*/
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  console.log("Trang: "+page);
  const total = listProductByShopID.length;
  let nPages = Math.floor(total / paginate_if.limit);
  if (total % paginate_if.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
    });
  }

  const offset = (page - 1) * paginate_if.limit;
  /*paginate*/
  listProductByShopID = await shopModel.getProductByShopIDcatOffset(shopID,CatID,offset);
  console.log(listProductByShopID);
  res.json(listProductByShopID);
});



//Search thep danh muc cap 2
router.get("/shops-information/:id/:idCat/byCat2", async function (req, res) {
  let shopID = +req.params.id;
  let CatID= +req.params.idCat;
  let listProductByShopID = await shopModel.getProductByShopIDcatSub(shopID,CatID);

  let shopInfo = await shopModel.single(shopID);
  shopInfo.ngaymo = moment(shopInfo.ngaymo).format('DD-MM-YYYY');

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
  let isCap2=true;

  /*paginate*/
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  console.log("Trang: "+page);
  const total = listProductByShopID.length;
  let nPages = Math.floor(total / paginate_if.limit);
  if (total % paginate_if.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
    });
  }

  const offset = (page - 1) * paginate_if.limit;
  /*paginate*/
  listProductByShopID = await shopModel.getProductByShopIDcatSubOffset(shopID,CatID,offset);
  

  res.render("vwShopInfo/shop_detail", {
    listProductByShopID,
    category,
    totalProduct: total,
    shopInfo,
    shopID,
    isCap2,
    CatID,
    maxpage: nPages,
  });
});

router.get('/bills_discard_cap2.json/:id/:idcat', async function(req, res) {
  const shopID = +req.params.id;
  let CatID= +req.params.idcat;

  let listProductByShopID = await shopModel.getProductByShopIDcatSub(shopID,CatID);

  /*paginate*/
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  console.log("Trang: "+page);
  const total = listProductByShopID.length;
  let nPages = Math.floor(total / paginate_if.limit);
  if (total % paginate_if.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
    });
  }

  const offset = (page - 1) * paginate_if.limit;
  /*paginate*/
  listProductByShopID = await shopModel.getProductByShopIDcatSubOffset(shopID,CatID,offset);
  console.log(listProductByShopID);
  res.json(listProductByShopID);
});

router.post("/shops-information/:id/search", async function (req, res) {
  let search_term = req.body.search_term;
  let shopID = req.params.id;
  req.session.search_term = search_term;
  if (search_term === "" || search_term.length < 3)
    return res.redirect(`/shops/shops-information/${shopID}`);
  res.redirect(`/shops/products/${shopID}`);
});

router.post("/edit-shop/:id/", async function (req, res) {
  let shopID = req.params.id;
  console.log(req.body);
  await shopModel.updateShopInfo(shopID,req.body.ten,req.body.sdt,req.body.email,req.body.diachi);
  res.redirect(`/shops/products/`);
});


module.exports = router;