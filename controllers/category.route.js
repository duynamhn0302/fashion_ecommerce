const express = require('express');
const router = express.Router();
const menuCategory=require('../models/category.model');
//Xem index
router.get('/', async function (req, res) {
    const listCateLevel1=await menuCategory.getCateMenuLV1();
    const cateMenu=[];
    for (const i of listCateLevel1)
    {
        const listSubMenuById=await menuCategory.getCateMenuLV2ById(+i.maso);
        const item={
            cateNameLV1: i.ten,
            cateIdLV1LV1: i.maso,
            listSubMenu: listSubMenuById
        };
        cateMenu.push(item);
    }

    res.render("index", {
        cateMenu
    });
});
module.exports = router;