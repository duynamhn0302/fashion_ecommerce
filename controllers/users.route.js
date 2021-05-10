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
  //get product image
  if (!empty) {
    await products.map(async product => {
      let images = await productsModel.getImages(product.maso);
      let store = await cartModel.getShopNameFromProductId(product.maso);
      product.hinhanh = images[0].link;
      product.cuahang = store.ten;
    })
  }

  res.render("../views/users_views/Cart.hbs", {
    layout: "main.hbs",
    products,
    empty
  });
});

//Xem đơn hàng
router.get("/orders", async function (req, res) {});

module.exports = router;