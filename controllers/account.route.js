const express = require('express');
const router = express.Router();
const userModel = require('../models/users.model');
const shopModel = require('../models/shop.model');
const moment = require('moment');

router.post('/check-account',async function(req,res,next){
    const username = req.body.username;
    const password = req.body.password;
    var return_mode;

    const user = await userModel.singleByUsername(username);
    // console.log(user);
    if(user === null){
        return_mode = 0   //->  tài khoản không hợp lệ, username không tồn tại trong csdl
    }else if(user.password !== password){
        return_mode = 1;    //->    username có tồn tại nhưng sai mật khẩu
    }else{
        return_mode = 2;    //->    username có tồn tại, nhập đúng mật khẩu, đăng nhập thành công
        req.session.authUser = user;
        if(req.session.authUser.vaitro === 1){
          const tempShop = await shopModel.shopOfId(req.session.authUser.maso);
          if(tempShop !== null) req.session.shop = tempShop;
          else req.session.shop === null;
        }
        req.session.auth = true;
        req.session.cart = await cartModel.checkCustomerHaveCart(req.session.authUser.maso);
        if(req.session.cart === null){    //truong hop ko tim thay cart cua user
          req.session.cart = {
            taikhoan: req.session.authUser.maso,
            tongsosanpham: 0,
            tonggiatien: 0,
          }
        }
    }
    res.json({
        return_mode : return_mode,
        retUrl : req.session.retUrl,
    });
});

router.post('/create-account',async function(req,res,next){
  var date = Date.now();
  var update = moment(date).format("YYYY-MM-DD");

    const data = {
        hoten: req.body.fullname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        ngaysinh: null,
        sdt: null,
        vaitro: 0,
        avatar: '/resources/images/default_avatar.png',
        status: true,
        ngaymo: update,
    }
    // const user = await userModel.add(data);
    // if(user === null){
    //     res.status(406);
    // }else{
    //     req.session.authUser = data;
    //     req.session.auth = false;
    //     console.log(req.session.authUser);
    // }
    req.session.data = data
    req.session.auth = false;
    res.json({});
}); 

router.post('/add-shop',async function(req,res){
    const name= req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;

    const check = await userModel.checkShop(req.session.authUser.maso);
    console.log(check);
    if(!check){
        res.json({return_mode: 0});
    }else{
      var date = Date.now();
      var update = moment(date).format("YYYY-MM-DD");

        const data = {
            email: email,
            ngaymo: update,
            sdt: phone,
            status: true,
            taikhoan: req.session.authUser.maso,
            ten: name,
          }
          const shopduocadd = await userModel.addShop(data);
          console.log(shopduocadd);
          res.json({return_mode: 1,masoshop: shopduocadd.insertId || null});

        
    } 
  });

router.get('/verification',function(req,res,next){
    if(req.session.auth === true){
        res.redirect('/');
      }else{
        res.render('otp',{
          email: req.session.data.email,
          layout: false,
        });
      }
})

const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const cartModel = require('../models/cart.model');
let transporter = nodemailer.createTransport({
  host: "localhost:3000", // hostname
  secure: false, // use SSL
  port: 25, // port for secure SMTP
  service: 'gmail',
  tls: {
    rejectUnauthorized: false
  },

  auth: {
    user: 'tt5335084@gmail.com',
    pass: 'PHUC&123'
  }
});

router.post('/send-otp',function(req,res,next){
    //generate token
    var secret = speakeasy.generateSecret({length:20});
  req.session.tempsecret = secret.base32;
  req.session.token = speakeasy.totp({
    secret: req.session.tempsecret,
    encoding: 'base32',
    step: 20
  });
  let mailOptions = {
    from: 'tt5335084@gmail.com',
    to: req.session.data.email,
    subject: 'Verify code', 
    html: `<span>Your verification code is </span><h1>${req.session.token}</h1><br><p>This verification code will expires after 10mins.`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
    }else{
      console.log('Email sent: '+ info.response);
    }
  });
  res.json(true);
})

router.post('/check-otp',async function(req,res){
    var tokenValidates = speakeasy.totp.verify({
      secret: req.session.tempsecret,
      encoding: 'base32',
      token: req.body.verification,
      step:20,
      window: 5
    });
    console.log(tokenValidates);
    console.log(req.body.verification);
    console.log(req.session.token);
    if(tokenValidates || req.body.verification === req.session.token){
      const user = await userModel.add(req.session.data);
      req.session.auth = true;
      req.session.authUser = req.session.data;
      req.session.authUser['maso'] = user.insertId;

      if(req.session.authUser.vaitro === 0 || req.session.authUser.vaitro === 1){
        const cart = await cartModel.addCart(req.session.authUser.maso);
        req.session.cart = {
          maso: cart.insertId,
          taikhoan: req.session.authUser.maso,
          tongsosanpham: 0,
          tonggiatien: 0,
        }
      }

      if(req.session.authUser.vaitro === 1){
        const tempShop = await shopModel.shopOfId(req.session.authUser.maso);
        if(tempShop !== null) req.session.shop = tempShop;
        else req.session.shop === null;
      }
      req.session.data = null;
      res.json({retUrl:req.session.retUrl || '/',check:true});
    }
    else res.json({retUrl:req.session.retUrl || '/',check:false});
})

module.exports = router;