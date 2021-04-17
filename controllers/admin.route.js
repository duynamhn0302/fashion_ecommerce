const express = require('express');
const router = express.Router();
//Xem index của admin
router.get('/', async function (req, res) {
  
});
//Xem danh mục, quản lý danh mục
router.get('/categories', async function (req, res) {
  
})

//Xem danh sách tài khoản, quản lý tài khoản
router.get('/accounts', async function (req, res) {
  
});

//Xem thống kê
router.get('/statistics', async function (req, res) {
  
});
module.exports = router;