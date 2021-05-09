const categoryModel=require('../models/products.model');
const userModel = require('../models/users.model');
const cartModel=require('../models/cart.model');

module.exports=function(app){
    app.use(async function (req,res,next){
        if(typeof(req.session.auth) === 'undefined'){
          req.session.auth = false;
        }

        // if (req.session.auth===false){
        //     req.session.cart=[];
        // }
        // res.locals.cid = null;
        res.locals.auth = req.session.auth;
        if(typeof(req.session.authUser) !== 'undefined' && req.session.authUser!==null){
            res.locals.authUser = await userModel.singleByUsername(req.session.authUser.username);
            const tempCart = await cartModel.checkCustomerHaveCart(req.session.authUser.maso);
            if(tempCart===null){   //chua co cart
                res.locals.cart = {
                    sl: 0,
                    sanpham: null,  //mang chua cac san pham trong gio hang
                }
            }
            else{
                res.locals.cart = {
                    sl: tempCart.tongsosanpham,
                    sanpham: null,
                }
            }
        }else{
            res.locals.cart = {
                sl: 0,
                sanpham: null,  //mang chua cac san pham trong gio hang
            }
        }
        // console.log(res.locals.cart);
        // res.locals.cartSummary=cartModel.getNumberOfItems(req.session.cart);
        next();
    });

    app.use(async function(req,res,next){
        // res.locals.lcCategories=await categoryModel.all();
        next();
    });
}