const express = require("express");
const cartModel = require("../models/cart.model");
const productsModel = require("../models/products.model");

const usersModel = require("../models/users.model");

const router = express.Router();

router.post('/add-to-cart',async function(req,res){
  const productId = req.body.id;      // nhan vao hai bien la id,sl
  const productQuantity = req.body.sl;

  const check = cartModel.checkIfProductInCart(productId,req.session.cart.maso);
  const product = productsModel.getSingleProductById(productId);
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

    res.json(true);
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
    await Promise.all(products.map(async product => {
      let images = await productsModel.getImages(product.maso);
      let shop = await cartModel.getShopNameFromProductId(product.maso);
      product.hinhanh = images[0].link;
      product.cuahang = shop.ten;
    }))
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
    //let newDate = new Date();
    //await cartModel.addToHistoryAfterPayment({ donhang: +newBillId, tinhtrang: 1, ngaythang: newDate.toISOString() })
    await cartModel.removeCartAfterPayment({ maso: +req.body.magiohang }, { giohang: +req.body.magiohang });
    let productNumber = await productsModel.single(product.sanpham);
    let productNumberLeft = productNumber.soluong - product.soluong;

    await productsModel.reduceProductNumberAfterPayment({ soluong: productNumberLeft }, { maso: product.sanpham });
  }))

  res.send({ empty: true });
});


//Xem đơn hàng
router.get("/orders", async function (req, res) {
  res.render("../views/users_views/Order.hbs", {
    layout: "main.hbs",
  });
});

module.exports = router;