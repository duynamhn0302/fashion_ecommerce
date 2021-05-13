const express = require("express");
const categoryModel = require("../models/category.model");
const productsModel = require("../models/products.model");
const { paginate } = require('./../config/default.json');
const router = express.Router();
//Xem ds tất cả sản phẩm
router.get("/", async function (req, res) {});
//Xem chi tiet sanpham
router.get("/:id", async function (req, res, next) {
  const id = +req.params.id;
  const product = await productsModel.single(id);
  const images = await productsModel.getImages(id);
  console.log(product);
  for (var i = 0; i < images.length; i++) {
    images[i].isActive = false;
  }
  images[0].isActive = true;
  const avatar = images[0];
  res.render("vwProducts/detailProduct", {
    avatar,
    images,
    product,
  });
});
//Xem ds sản phẩm theo danh mục 1
router.get("/byCat1/:id", async function (req, res) {
  let cate1Id = +req.params.id;

  var page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await productsModel.countAllByCate1(cate1Id);
  let nPages = Math.floor(total / paginate.limit);
  if (total % paginate.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
    });
  }

  const offset = (page - 1) * paginate.limit;

  let allProductsFromCate1 = await productsModel.getAllProductsByCate1Id(cate1Id, offset);
  let cate1Name = await categoryModel.getCateName1ById(cate1Id);
  let allCategories = await productsModel.allCategories();

  if (allProductsFromCate1 !== null)
    Promise.all(await allProductsFromCate1.map(async product => {
        let img = await productsModel.getImages(+product.maso);
        product.hinhanh = img[0].link;
        return product;
    }));

  res.render("../views/vwProducts/byCat1.hbs", {
      layout: 'main.hbs',
      products: allProductsFromCate1,
      onlyOne: nPages < 1,
      prevPage: +page - 1,
      nextPage: +page + 1,
      firstPage: +page === 1,
      lastPage: +page === nPages,
      page_numbers,
      cate1Name,
      cate1Id,
      allCategories,
  });
});
//Xem ds sản phẩm theo danh mục 2
router.get("/byCat2/:id", async function (req, res) {
  let cate2Id = +req.params.id;
  let cate1Id = await categoryModel.getCate1IdFromCate2Id(cate2Id);

  var page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await productsModel.countAllByCate2(cate2Id);
  let nPages = Math.floor(total / paginate.limit);
  if (total % paginate.limit > 0) nPages++;

  const page_numbers = [];
  for (var i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
    });
  }

  const offset = (page - 1) * paginate.limit;

  let allProductsFromCate2 = await productsModel.getAllProductsByCate2Id(cate2Id, offset);
  let cate1Name = await categoryModel.getCateName1ById(cate1Id);
  let cate2Name = await categoryModel.getCateName2ById(cate2Id);
  let allCategories = await productsModel.allCategories();

  if (allProductsFromCate2 !== null)
    await allProductsFromCate2.map(async product => {
        let img = await productsModel.getImages(+product.maso);
        product.hinhanh = img[0].link;
        return product;
    });

  res.render("../views/vwProducts/byCat2.hbs", {
    layout: 'main.hbs',
    products: allProductsFromCate2,
    onlyOne: nPages < 1,
    prevPage: +page - 1,
    nextPage: +page + 1,
    firstPage: +page === 1,
    lastPage: +page === nPages,
    page_numbers,
    cate1Name,
    cate2Name,
    cate1Id,
    cate2Id,
    allCategories,
});
});

//Search sản phẩm
router.post("/search", async function (req, res) {});

module.exports = router;
