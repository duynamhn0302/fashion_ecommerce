const express = require('express');
const productsModel = require('../models/products.model');
const router = express.Router();
//Xem ds tất cả sản phẩm
router.get('/', async function (req, res) {
  
});
//Xem chi tiet sanpham
router.get('/:id', async function (req, res, next) {
    const id = +req.params.id;
    const product = await productsModel.single(id)
    const images = await productsModel.getImages(id)
    console.log(product)
    for(var i = 0; i < images.length; i++){
        images[i].isActive = false;
    }
    images[0].isActive = true;
    const avatar = images[0]
    res.render("vwProducts/detailProduct",
    {
        avatar,
        images,
        product,
        
    })
});
//Xem ds sản phẩm theo danh mục 1
router.get('/byCat1', async function (req, res) {
  
})
//Xem ds sản phẩm theo danh mục 2
router.get('/byCat2', async function (req, res) {
  
});

//Search sản phẩm
router.post('/search', async function (req, res) {
  
});

module.exports = router;