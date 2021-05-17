const productsModels =require('../models/products.model');
const userModel = require('../models/users.model');
const cartModel=require('../models/cart.model');

module.exports=function(app){
    app.use(async function (req,res,next){
        if(typeof(req.session.auth) === 'undefined'){
          req.session.auth = false;
        }
        else{
            if(req.session.auth===true){
                req.session.authUser = await userModel.singleByUsername(req.session.authUser.username);
                
                const tempCart = await cartModel.checkCustomerHaveCart(req.session.authUser.maso);
                
                
                if(tempCart===null){   //chua co cart
                    //may cai req.session.tempcart nay chu yeu la dung cho trang chu may ngay dau,
                    //co the se phai update lai
                    req.session.tempcart = {
                        sl: 0,
                        sanpham: null,  //mang chua cac san pham trong gio hang, khoi tao
                    }
                }
                else{
                    req.session.cart = tempCart
                    req.session.tempcart = {
                        sl: tempCart.tongsosanpham,
                        sanpham: null,  //chua lay tung san pham  ra
                    }
                }
            }else{
                req.session.authUser = null;
                req.session.tempcart = {
                    sl: 0,
                    sanpham: null,
                }
            }
            if(req.session.logout === 1){
                req.session.auth = false;
                req.session.authUser = null;
                req.session.tempcart = {sl:0,sanpham:null}
                res.locals.auth = false;
                res.locals.authUser = null;
                res.locals.cart = {sl:0,sanpham:null}
                req.session.logout = 0;
            }
            res.locals.auth = req.session.auth;
            res.locals.authUser = req.session.authUser;
            res.locals.cart = req.session.tempcart;
        }


        // if (req.session.auth===false){
        //     req.session.cart=[];
        // }
        // res.locals.cid = null;

        // res.locals.auth = req.session.auth;
        // if(typeof(req.session.authUser) !== 'undefined' && req.session.authUser!==null){
        //     res.locals.authUser = await userModel.singleByUsername(req.session.authUser.username);
        //     const tempCart = await cartModel.checkCustomerHaveCart(req.session.authUser.maso);
        //     if(tempCart===null){   //chua co cart
        //         res.locals.cart = {
        //             sl: 0,
        //             sanpham: null,  //mang chua cac san pham trong gio hang
        //         }
        //     }
        //     else{
        //         res.locals.cart = {
        //             sl: tempCart.tongsosanpham,
        //             sanpham: null,
        //         }
        //     }
        // }else{
        //     res.locals.cart = {
        //         sl: 0,
        //         sanpham: null,  //mang chua cac san pham trong gio hang
        //     }
        // }
        // console.log(res.locals.cart);
        // res.locals.cartSummary=cartModel.getNumberOfItems(req.session.cart);
        next();
    });

    app.use(async function (req, res, next) {
        res.locals.lcCategories = await productsModels.allCategories();
        next();
      });
}