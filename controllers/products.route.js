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
    const relativeProduct = await productsModel.getRelativeProduct(id)
    for(var i = 0; i < relativeProduct.length; i++){
        const reImages = await productsModel.getImages(relativeProduct[i].maso)
        relativeProduct[i].avatar = reImages[0]
    }
    const comment = await productsModel.getComment(id)
    var luotmua = await productsModel.getLuotMua(id)
    if (luotmua == 0)
        luotmua = 0
    else
        luotmua = luotmua.soluong
    const star = productsModel.convertRating(product.diemdanhgia)
    console.log(star)
    res.render("vwProducts/detailProduct",
    {
        avatar,
        images,
        product,
        relativeProduct,
        comment,
        luotmua,
        star
        
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