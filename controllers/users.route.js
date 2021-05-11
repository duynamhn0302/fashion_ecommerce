const express = require("express");
const cartModel = require("../models/cart.model");
const productsModel = require("../models/products.model");

const usersModel = require("../models/users.model");

const router = express.Router();
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
})


//Xem đơn hàng
router.get("/orders", async function (req, res) {});

module.exports = router;