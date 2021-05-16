const express = require("express");
const cartModel = require("../models/cart.model");
const productsModel = require("../models/products.model");
const moment = require('moment');
const auth = require('../middlewares/auth.mdw');
const usersModel = require("../models/users.model");

const router = express.Router();

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
      }
      await cartModel.addToCartDetail(new_data);
    }else{    //nguoi dung da co sp trong gio hang, nen cong them
      const new_data = {
        soluong: productQuantity+check.soluong,
      }
      const condition = {
        giohang: req.session.cart.maso,
        sanpham: productId,
      }
      console.log(new_data)
      console.log(check)
      await cartModel.modifyCartDetail2(new_data,condition);
    }
    req.session.cart['tongsosanpham']= req.session.cart.tongsosanpham + productQuantity;
    req.session.cart['tonggiatien']= req.session.cart.tonggiatien + productQuantity*product.giaban;
    const condition1 = {
      maso: req.session.cart.maso,
    }
    const modifyCart = {
      tongsosanpham: req.session.cart.tongsosanpham,
      tonggiatien: req.session.cart.tonggiatien,
    }
    await cartModel.modifyCartForCustomer(modifyCart,condition1);

    res.status(200).send({result: req.session.cart.tongsosanpham})
  }
})

router.post('/buy-now',async function(req,res){
  
})

//Xem thông tin cá nhân
router.get("/profile", async function (req, res) {
  let user = req.session.authUser;

  res.render("../views/users_views/Profile.hbs", {
    layout: "main.hbs",
    user,
  });
});

router.post("/change-profile", async function(req, res) {
  let new_hoten = req.body.hoten;
  let new_sdt = req.body.sdt;
  let email = req.body.email;

  req.session.authUser.hoten = new_hoten;
  req.session.authUser.sdt = new_sdt;

  let updated_fields = { email, hoten: new_hoten, sdt: new_sdt };
  await usersModel.patch(updated_fields);
  return res.redirect('/users/profile');
});

router.post("/change-password", async function(req, res) {
  let current_password = req.body.current_password;
  let new_password = req.body.new_password;

  if(current_password !== req.session.authUser.password)
    return res.send({success: false, failMessage: "Sai mật khẩu"});
  else
    res.send({success: true, successMessage: "Thay đổi mật khẩu thành công"});

  req.session.authUser.password = new_password;

  let updated_field = { email: req.session.authUser.email, password: new_password };
  await usersModel.patch(updated_field);
  return res.redirect('/users/profile');
});
//Xem giỏ hàng
router.get("/shopping-cart", async function (req, res) {
  let user = req.session.authUser;

  //get products details
  let products = await cartModel.getAllProductsWithUserId(user.maso);
  let empty = products === null ? true : false;
  //get product
  if (!empty) {
    for (let i=0; i<products.length; i++) {
      let images = await productsModel.getImages(products[i].maso);
      let shop = await cartModel.getShopNameFromProductId(products[i].maso);
      products[i].hinhanh = images[0].link;
      products[i].cuahang = shop.ten;
    }
  }

  res.render("../views/users_views/Cart.hbs", {
    layout: "main.hbs",
    products,
    empty
  });
});

router.post('/change-amount-cart', async function (req, res) {
  await cartModel.cartProductsAmountChanged(+req.body.masanpham, +req.body.soluong, +req.body.magiohang, +req.body.tongsanpham, req.body.tongiatien);
})

router.post('/remove-from-cart', async function (req, res) {
  await cartModel.cartProductsRemoved(+req.body.masanpham, +req.body.magiohang);
  let tonggia = await cartModel.sumProductInCart(+req.body.magiohang);
  req.body.tongiatien = tonggia.tonggia;
  await cartModel.cartProductsUpdateAfterRemoving(+req.body.tongsanpham - +req.body.soluong, req.body.tongiatien, req.body.magiohang);

  if (!(req.body.tongsanpham - req.body.soluong))
    res.send({ empty: true })
})

router.post('/pay-cart', async function (req, res) {
  let productsInCart = await cartModel.getProductsForPayment(+req.body.magiohang);
  let cart = await cartModel.singleByCartId(+req.body.magiohang);
  let createBillResult = await cartModel.createNewBill({ tonggiatien: cart.tonggiatien, taikhoan: cart.taikhoan, tongsosanpham: cart.tongsosanpham, tinhtrangdon: 1 });
  let newBillId = createBillResult.insertId;

  await Promise.all(productsInCart.map(async product => {
    let productDetail = await productsModel.getSingleProductById(+product.sanpham);
    let newProductDetail = { donhang: +newBillId, sanpham: product.sanpham, dongia: productDetail.giaban, soluong: product.soluong };
    await cartModel.createNewBillDetail(newProductDetail);
    let newDate = new Date();
    await cartModel.addToHistoryAfterPayment({ ngaythang: newDate.toISOString() })
    await cartModel.removeCartAfterPayment({ maso: +req.body.magiohang }, { giohang: +req.body.magiohang });
    let productNumber = await productsModel.single(product.sanpham);
    let productNumberLeft = productNumber.soluong - product.soluong;

    await productsModel.reduceProductNumberAfterPayment({ soluong: productNumberLeft }, { maso: product.sanpham });
  }))

  res.send({ empty: true });
});


//Xem đơn hàng
router.get("/orders", async function (req, res) {
  let userId = req.session.authUser.maso;
  let allBills = await usersModel.getAllBillsFromUserId(userId);
  let allYetConfirmed = await usersModel.getAllYetConfirmedBillsFromUserId(userId);
  let allTraveling = await usersModel.getAllTravelingBillsFromUserId(userId);
  let allTraveled = await usersModel.getAllTraveledBillsFromUserId(userId);
  let allCanceled = await usersModel.getAllCanceledBillsFromUserId(userId);

  if (allBills !== null)
    for (let i = 0; i < allBills.length; i++) {
      let product = await productsModel.single(allBills[i].sanpham);
      let paidDate = await productsModel.getPaidDate(allBills[i].maso, userId);
      allBills[i].sanpham = product.ten;
      allBills[i].ngaymua = moment(paidDate).format("YYYY-MM-DD");
    }

  if (allYetConfirmed !== null)
    for (let i = 0; i < allYetConfirmed.length; i++) {
      let product = await productsModel.single(allYetConfirmed[i].sanpham);
      let paidDate = await productsModel.getPaidDate(allYetConfirmed[i].maso, userId);
      allYetConfirmed[i].sanpham = product.ten;
      allYetConfirmed[i].ngaymua = moment(paidDate).format("YYYY-MM-DD");
    }

  if (allTraveling !== null)
    for (let i = 0; i < allTraveling.length; i++) {
      let product = await productsModel.single(allTraveling[i].sanpham);
      let paidDate = await productsModel.getPaidDate(allTraveling[i].maso, userId);
      allTraveling[i].sanpham = product.ten;
      allTraveling[i].ngaymua = moment(paidDate).format("YYYY-MM-DD");
    }

  if (allTraveled !== null)
    for (let i = 0; i < allTraveled.length; i++) {
      let product = await productsModel.single(allTraveled[i].sanpham);
      let paidDate = await productsModel.getPaidDate(allTraveled[i].maso, userId);
      allTraveled[i].sanpham = product.ten;
      allTraveled[i].ngaymua = moment(paidDate).format("YYYY-MM-DD");
    }

  if (allCanceled !== null)
    for (let i = 0; i < allCanceled.length; i++) {
      let product = await productsModel.single(allCanceled[i].sanpham);
      let paidDate = await productsModel.getPaidDate(allCanceled[i].maso, userId);
      allCanceled[i].sanpham = product.ten;
      allCanceled[i].ngaymua = moment(paidDate).format("YYYY-MM-DD");
    }

  res.render("../views/users_views/Order.hbs", {
    layout: "main.hbs",
    allBills,
    allYetConfirmed,
    allTraveled,
    allTraveling,
    allCanceled
  });
});

router.post('/bill-detail', async (req, res) => {
  let billId = req.body.billId;
  let result = await usersModel.getBillDetail(req.session.authUser.maso, billId);
  let tinhtrangdon = 0;
  switch (result[0].tinhtrangdon) {
    case 1: tinhtrangdon = 'Đang xác nhận'; break;
    case 2: tinhtrangdon = 'Đang giao'; break;
    case 3: tinhtrangdon = 'Đã giao'; break;
    case 4: tinhtrangdon = 'Đã huỷ'; break;
  }

  console.log(billId)

  let sanpham = [];
  for (let i=0; i<result.length; i++)
    sanpham[i] = {
      masanpham: result[i].sanpham,
      ten: result[i].ten,
      soluong: result[i].soluong,
      giaban: result[i].giaban
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
    sanpham
  }
  res.render('../views/users_views/Bill-detail.hbs', {
    bill,
    billId
  });
})

module.exports = router;