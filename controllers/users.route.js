const express = require("express");
const router = express.Router();
//Xem thông tin cá nhân
router.get("/profile", async function (req, res) {
  res.render("../views/users_views/Profile.hbs", {
    layout: "main.hbs",
  });
});
//Xem giỏ hàng
router.get("/shopping-cart", async function (req, res) {});

//Xem đơn hàng
router.get("/orders", async function (req, res) {});

module.exports = router;