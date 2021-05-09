const db = require("../utils/db");
const productModel = require('../models/products.model');
const cartModel = require('../models/cart.model');
const auth = require('./auth.mdw');

module.exports = function (app) {
  //home
  app.get('/', async function (req, res) {
    const categories = await productModel.allCategories()
    const top10New = await productModel.topNNew(10);
    for(var i = 0; i < top10New.length; i++) {
      const images = await productModel.getImages(top10New[i].maso)
      console.log(images)
      top10New[i].avatar = images[0].link;
    };
    
    const top8Seller = await productModel.topNSeller(8)
    for(var i = 0; i < top8Seller.length; i++) {
      const images = await productModel.getImages(top8Seller[i].maso)
      top8Seller[i].avatar = images[0].link;
    }
    const top8Categories = await productModel.topNCategories(8);
    res.render("index",{
      categories,
      top10New,
      top4Seller: top8Seller.slice(0, 4),
      top4_8Seller: top8Seller.slice(4, 8),
      top8Seller,
      top8Categories
    })
  });

  app.get('/login',auth.auth_reverse,async function (req, res) {
    res.render("login",{layout: false});
   });
   
  app.get('/signup',auth.auth_reverse,async function (req, res) {
    res.render('signup',{layout: false});
   });

  app.post('/logout',auth.auth, async function (req, res) {
    req.session.auth = false;
    req.session.authUser = null;
    req.session.retUrl = null;
    console.log("Logging out");
  
    const url = req.headers.referer || '/';
    console.log(url);
    res.redirect(url);
  });

  app.post('/add_to_cart',auth.authUser, async function (req,res){ 
    //nhan vao hai tham so tu body la -----id, quantity--------
    const product = await productModel.getSingleProductById(+req.body.id);
    
    var quantity
    if (req.body.quantity)
      quantity = +req.body.quantity;
    else 
      quantity = 1;
    if(req.session.auth === false){   //nguoi dung chua dang nhap
      console.log(false);
      res.json(false);
    }else{
      console.log(true);
      req.session.authUser = {maso: 5};         //này là để test mù ko có hàm
      const checkCart = await cartModel.checkCustomerHaveCart(req.session.authUser.maso);
      var cart = null;
      if(checkCart === null){   //nguoi dung chua co cart
        const data={
          taikhoan: req.session.authUser.maso,
          tongsosanpham: quantity,
          tonggiatien: quantity*product.giaban,
        }
        cart = await cartModel.addCartForCustomer(data);   //them gio hang moi cho khach hang, neu chua khoi tao
        if(cart===null) res.json(false);  //add khong thanh cong
        const data1={
          sanpham: product.maso,
          giohang: cart.maso || cart.insertId,
          soluong: quantity,
        }
        await cartModel.addToCartDetail(data1);
      }else{        //nguoi dung da co cart
        // const data={
        //   tongsosanpham: checkCart.tongsosanpham + quantity,   //quantity la so luong san pham them vao gio hang
        //   tonggiatien: checkCart.tonggiatien + product.giaban*quantity,
        // }
        // const temp = {taikhoan: req.session.authUser.maso};
        // cart = await cartModel.modifyCartForCustomer(data,temp);  //cong them tien, them so luong san pham
        // if(cart !== null){
        //   const data1={
        //     soluong: quantity,
        //     sanpham: product.maso,
        //   }
        //   const condition = {
        //     giohang: checkCart.maso,
        //   }
        //   await cartModel.modifyCartDetail(data1,condition);
        // }
        const check = await cartModel.checkIfProductInCart(req.body.id,checkCart.maso);
        if(check === null){     //sp chua co trong gio hang
          const data1={
            sanpham: product.maso,
            giohang: checkCart.maso,
            soluong: quantity,
          }
          await cartModel.addToCartDetail(data1);
        }else{      //sp co trong gio hang roi, chi can sua quantity thoi
          const data1={
            soluong: quantity,
            
          }
          const condition = {
            giohang: checkCart.maso,
            sanpham: product.maso,
          }
          await cartModel.modifyCartDetail2(data1,condition);
        }
        const sum = await cartModel.sumProductInCart(checkCart.maso);
        const data={
          tongsosanpham: sum.sl,   //quantity la so luong san pham them vao gio hang
          tonggiatien: sum.tonggia,
        }
        const temp = {taikhoan: req.session.authUser.maso};
        cart = await cartModel.modifyCartForCustomer(data,temp);  //cong them tien, them so luong san pham
      }
    }
    res.json(true);
  });

  app.get('/open_shop',auth.authUser,function(req, res){
    res.render("dangkymoshop",{layout: false});
  })
  


  app.all('/',require('../controllers/category.route'));
  app.use('/admin/', require('../controllers/admin.route'))
  app.use('/products/', require('../controllers/products.route'));
  app.use('/users/', require('../controllers/users.route'));
  app.use('/shops/', require('../controllers/shops.route'));
  app.use('/admin/', require('../controllers/admin.route'));
  app.use('/account/',require('../controllers/account.route'));

  app.get('/err', function (req, res) {
    throw new Error('Error!');
  })

  app.use(function (req, res) {
    res.render('404', {
      layout: false
    });
  });
}