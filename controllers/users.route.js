const express = require("express");
const cartModel = require("../models/cart.model");
const productsModel = require("../models/products.model");
const moment = require('moment');
const multer = require('multer');
const auth = require('./../middlewares/auth.mdw');
const shopModel=require('../models/shop.model');

const usersModel = require("../models/users.model");

const router = express.Router();

router.post("/rating-product/:id", async function (req, res) {
  let num_star=+req.body.rate;
  let comment=req.body.cmReview;
  let id_product=+req.body.id_product;

  await usersModel.insertReview(req.session.authUser.maso,id_product,comment,num_star);
  await usersModel.insertComment(req.session.authUser.maso,id_product,comment);

  res.redirect("/users/orders");
});

router.post('/add-to-cart', auth.auth,async function(req,res){
  const productId = +req.body.id;      // nhan vao hai bien la id,sl
  const productQuantity = +req.body.sl;

  const check = await cartModel.checkIfProductInCart(productId,req.session.cart.maso);
  const product = await productsModel.getSingleProductById(productId);
  if(product===null){res.json(false);}    //id cua product la khong hop le, hay khong truy xuat duoc thi coi nhu vut
  else{
      if(check === null){   //chua co sp trong gio hang
      const new_data = {
        sanpham: productId,
        giohang: req.session.cart.maso,
        soluong: productQuantity,
      };
      await cartModel.addToCartDetail(new_data);
    } else {
      //nguoi dung da co sp trong gio hang, nen cong them
      const new_data = {
        soluong: productQuantity + check.soluong,
      };
      const condition = {
        giohang: req.session.cart.maso,
        sanpham: productId,
      }
      console.log(new_data)
      console.log(check)
      await cartModel.modifyCartDetail2(new_data,condition);
    }
    req.session.cart["tongsosanpham"] =
      req.session.cart.tongsosanpham + productQuantity;
    req.session.cart["tonggiatien"] =
      req.session.cart.tonggiatien + productQuantity * product.giaban;
    const condition1 = {
      maso: req.session.cart.maso,
    };
    const modifyCart = {
      tongsosanpham: req.session.cart.tongsosanpham,
      tonggiatien: req.session.cart.tonggiatien,
    };
    await cartModel.modifyCartForCustomer(modifyCart, condition1);

    res.status(200).send({result: req.session.cart.tongsosanpham})
  }
});

router.post("/buy-now", async function (req, res) {});

//Xem thông tin cá nhân
router.get("/profile", auth.authUser, async function (req, res) {
  let user = req.session.authUser;

  res.render("../views/users_views/Profile.hbs", {
    layout: "main.hbs",
    user,
  });
});

router.post("/upload-avatar", async function (req, res) {
  var filepath = "/resources/images/";
  var filename = "user-" + req.session.authUser.maso + "-avatar.webp";
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "." + filepath);
    },
    filename: function (req, file, cb) {
      cb(null, filename);
    },
  });
  const upload = multer({ storage: storage });

  upload.single("avatar")(req, res, async function (err) {
    if (err) {
      console.log(err);
      res.json(false);
    } else {
      const success = await usersModel.modifyAvatar(
        filepath + filename,
        req.session.authUser.maso
      );
      res.json({
        link: filepath + filename,
      });
    }
  });
});

router.post("/change-profile", async function (req, res) {
  let new_hoten = req.body.hoten;
  let new_sdt = req.body.sdt;
  let email = req.body.email;
  let address = req.body.diachi;

  req.session.authUser.hoten = new_hoten;
  req.session.authUser.sdt = new_sdt;
  req.session.authUser.diachi = address;

  let updated_fields = { email, hoten: new_hoten, sdt: new_sdt, diachi: address };
  await usersModel.patch(updated_fields);
  return res.redirect("/users/profile");
});

router.post("/change-password", async function (req, res) {
  let current_password = req.body.current_password;
  let new_password = req.body.new_password;

  if (current_password !== req.session.authUser.password)
    return res.send({ success: false, failMessage: "Sai mật khẩu" });
  else
    res.send({ success: true, successMessage: "Thay đổi mật khẩu thành công" });

  req.session.authUser.password = new_password;

  let updated_field = {
    email: req.session.authUser.email,
    password: new_password,
  };
  await usersModel.patch(updated_field);
  return res.redirect("/users/profile");
});
//Xem giỏ hàng
router.get("/shopping-cart", async function (req, res) {
  let user = req.session.authUser;

  //get products details
  let products = await cartModel.getAllProductsWithUserId(user.maso);
  let empty = products === null ? true : false;
  let outOfProduct = false;
  //get product
  if (!empty) {
    for (let i = 0; i < products.length; i++) {
      let images = await productsModel.getImages(products[i].maso);
      let shop = await cartModel.getShopNameFromProductId(products[i].maso);
      products[i].hinhanh = images[0].link;
      products[i].cuahang = shop.ten;
      if (products[i].conlai === 0)
        outOfProduct = true;
    }
  }

  res.render("../views/users_views/Cart.hbs", {
    layout: "main.hbs",
    products,
    empty,
    outOfProduct
  });
});

router.post("/change-amount-cart", async function (req, res) {
  await cartModel.cartProductsAmountChanged(
    +req.body.masanpham,
    +req.body.soluong,
    +req.body.magiohang,
    +req.body.tongsanpham,
    req.body.tongiatien
  );
});

router.post("/remove-from-cart", async function (req, res) {
  await cartModel.cartProductsRemoved(+req.body.masanpham, +req.body.magiohang);
  let tonggia = await cartModel.sumProductInCart(+req.body.magiohang);
  req.body.tongiatien = tonggia.tonggia;
  await cartModel.cartProductsUpdateAfterRemoving(
    +req.body.tongsanpham - +req.body.soluong,
    req.body.tongiatien,
    req.body.magiohang
  );

  console.log(+req.body.tongsanpham)
  console.log(+req.body.tongsanpham - +req.body.soluong)

  if (!(+req.body.tongsanpham - +req.body.soluong)) res.send({ empty: true });
});

router.post("/pay-cart", async function (req, res) {
  let productsInCart = await cartModel.getProductsForPayment(
    +req.body.cartId
  );
  let cart = await cartModel.singleByCartId(+req.body.cartId);
  let createBillResult = await cartModel.createNewBill({
    tonggiatien: cart.tonggiatien,
    taikhoan: cart.taikhoan,
    tongsosanpham: cart.tongsosanpham,
    tinhtrangdon: 1,
    diachinguoinhan: req.body.address,
    sdtnguoinhan: req.body.sdt
  });
  let newBillId = createBillResult.insertId;

  let newDate = new Date();
  await cartModel.addToHistoryAfterPayment({
    donhang: newBillId,
    tinhtrang: 1,
    ngaythang: moment(newDate).format("YYYY-MM-DD"),
  });

  await Promise.all(
    productsInCart.map(async (product) => {
      let productDetail = await productsModel.getSingleProductById(
        +product.sanpham
      );
      let newProductDetail = {
        donhang: +newBillId,
        sanpham: product.sanpham,
        dongia: productDetail.giaban,
        soluong: product.soluong,
      };
      await cartModel.createNewBillDetail(newProductDetail);
      await cartModel.removeCartAfterPayment(
        { maso: +req.body.cartId },
        { giohang: +req.body.cartId }
      );
      let productNumber = await productsModel.single(product.sanpham);
      let productNumberLeft = productNumber.soluong - product.soluong;

      await productsModel.reduceProductNumberAfterPayment(
        { soluong: productNumberLeft },
        { maso: product.sanpham }
      );
    })
  );

  res.redirect("/users/shopping-cart");
});

router.get("/payment-preview/:id", async (req, res) => {
  let cartId = +req.params.id;
  let productsResult = await cartModel.getProductsForPayment(cartId);
  let products = [];
  let cart = await cartModel.singleByCartId(cartId);

  for (let i = 0; i < productsResult.length; i++) {
    let productDetail = await productsModel.getSingleProductById(productsResult[i].sanpham);
    let images = await productsModel.getImages(productsResult[i].sanpham);
    let shop = await cartModel.getShopNameFromProductId(productsResult[i].sanpham);
    let product = {
      tensanpham: productDetail.ten,
      soluong : productsResult[i].soluong,
      hinhanh : images[0].link,
      cuahang : shop.ten,
      dongia: +productDetail.giaban,
      gia: +productDetail.giaban * +productsResult[i].soluong,
    }
    products.push(product);
  }

  res.render("../views/users_views/Payment_preview.hbs", {
    layout: 'main.hbs',
    user: req.session.authUser,
    products,
    cart,
  });
});

//Xem đơn hàng
router.get("/orders", async function (req, res) {
  let userId = req.session.authUser.maso;
  let allBills = await usersModel.getAllBillsFromUserId(userId);
  let allYetConfirmed = await usersModel.getAllYetConfirmedBillsFromUserId(
    userId
  );
  let allTraveling = await usersModel.getAllTravelingBillsFromUserId(userId);
  let allTraveled = await usersModel.getAllTraveledBillsFromUserId(userId);
  let allCanceled = await usersModel.getAllCanceledBillsFromUserId(userId);

  if (allBills !== null) {
    for (let i = 0; i < allBills.length; i++) {
      let paidDate = await productsModel.getPaidDate(allBills[i].maso, userId);
      allBills[i].ngaymua = moment(paidDate).format("DD-MM-YYYY");

      let products = await productsModel.getAllProductsByBillId(allBills[i].maso, userId);
      allBills[i].sanpham = '';
      for (let j=0; j<products.length; j++) {
        if (j === products.length-1)
          allBills[i].sanpham += products[j].ten;
        else
          allBills[i].sanpham += products[j].ten + ', ';
      }
    }
  }

  if (allYetConfirmed !== null) {
    for (let i = 0; i < allYetConfirmed.length; i++) {
      let paidDate = await productsModel.getPaidDate(allYetConfirmed[i].maso, userId);
      allYetConfirmed[i].ngaymua = moment(paidDate).format("DD-MM-YYYY");

      let products = await productsModel.getAllProductsByBillId(allYetConfirmed[i].maso, userId);
      allYetConfirmed[i].sanpham = '';
      for (let j=0; j<products.length; j++) {
        if (j === products.length-1)
          allYetConfirmed[i].sanpham += products[j].ten;
        else
          allYetConfirmed[i].sanpham += products[j].ten + ', ';
      }
    }
  }

  if (allTraveling !== null) {
    for (let i = 0; i < allTraveling.length; i++) {
      let paidDate = await productsModel.getPaidDate(allTraveling[i].maso, userId);
      allTraveling[i].ngaymua = moment(paidDate).format("DD-MM-YYYY");

      let products = await productsModel.getAllProductsByBillId(allTraveling[i].maso, userId);
      allTraveling[i].sanpham = '';
      for (let j=0; j<products.length; j++) {
        if (j === products.length-1)
          allTraveling[i].sanpham += products[j].ten;
        else
          allTraveling[i].sanpham += products[j].ten + ', ';
      }
    }
  }

  if (allTraveled !== null) {
    for (let i = 0; i < allTraveled.length; i++) {
      let paidDate = await productsModel.getPaidDate(allTraveled[i].maso, userId);
      allTraveled[i].ngaymua = moment(paidDate).format("DD-MM-YYYY");

      let products = await productsModel.getAllProductsByBillId(allTraveled[i].maso, userId);
      allTraveled[i].sanpham = '';
      for (let j=0; j<products.length; j++) {
        if (j === products.length-1)
          allTraveled[i].sanpham += products[j].ten;
        else
          allTraveled[i].sanpham += products[j].ten + ', ';
      }
    }
  }

  if (allCanceled !== null) {
    for (let i = 0; i < allCanceled.length; i++) {
      let paidDate = await productsModel.getPaidDate(allCanceled[i].maso, userId);
      allCanceled[i].ngaymua = moment(paidDate).format("DD-MM-YYYY");

      let products = await productsModel.getAllProductsByBillId(allCanceled[i].maso, userId);
      allCanceled[i].sanpham = '';
      for (let j=0; j<products.length; j++) {
        if (j === products.length-1)
          allCanceled[i].sanpham += products[j].ten;
        else
          allCanceled[i].sanpham += products[j].ten + ', ';
      }
    }
  }

  res.render("../views/users_views/Order.hbs", {
    layout: "main.hbs",
    allBills,
    allYetConfirmed,
    allTraveled,
    allTraveling,
    allCanceled,
  });
});

router.get("/bill-detail/:id", async (req, res) => {
  let billId = req.params.id;
  let idUser=req.session.authUser.maso;
  let result = await usersModel.getBillDetail(req.session.authUser.maso, billId);
  console.log(result);
  let tinhtrangdon = 0;
  switch (result[0].tinhtrangdon) {
    case 1:
      tinhtrangdon = "Đang xác nhận";
      break;
    case 2:
      tinhtrangdon = "Đang giao";
      break;
    case 3:
      tinhtrangdon = "Đã giao";
      break;
    case 4:
      tinhtrangdon = "Đã huỷ";
      break;
  }

  console.log(billId)

//Code phúc
  let listBillDetail=await shopModel.getDetailBillInfo(billId);

  let listSanPham=await shopModel.getListProductByBill(billId);
  listBillDetail.DuocDanhGia=listBillDetail.tinhtrangdon==3
  for (item of listSanPham)
  {
    item.giaban=productsModel.formatPrice(item.giaban);
    item.dongia=productsModel.formatPrice(item.dongia);
    item.checkReview=await usersModel.checkedReviewProduct(idUser,item.maso)!=null;
    item.checkDuocReview=listBillDetail.DuocDanhGia;
  }
  listBillDetail.listSanPham=listSanPham;
  listBillDetail.tonggiatien=productsModel.formatPrice(listBillDetail.tonggiatien);
  console.log(listBillDetail);
  //Code phúc

  let sanpham = [];
  for (let i = 0; i < result.length; i++)
    sanpham[i] = {
      masanpham: result[i].sanpham,
      ten: result[i].ten,
      soluong: result[i].soluong,
      giaban: result[i].giaban,
    };

  bill = {
    email: result[0].email,
    hoten: result[0].hoten,
    maso: result[0].maso,
    sdt: result[0].sdt,
    cuahang: result[0].cuahang,
    tongsosanpham: result[0].tongsosanpham,
    tonggiatien: result[0].tonggiatien,
    tinhtrangdon,
    sanpham,

    listBillDetail
  }
  res.render('../views/users_views/Bill-detail.hbs', {
    bill,
    billId,
  });
});

module.exports = router;
