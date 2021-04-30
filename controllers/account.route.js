const express = require('express');
const router = express.Router();
const userModel = require('../models/users.model');

router.post('/check-account',async function(req,res,next){
    const username = req.body.username;
    const password = req.body.password;
    var return_mode;

    const user = await userModel.singleByUsername(username);
    // console.log(user)
    if(user === null){
        return_mode = 0   //->  tài khoản không hợp lệ, username không tồn tại trong csdl
    }else if(user.password !== password){
        return_mode = 1;    //->    username có tồn tại nhưng sai mật khẩu
    }else{
        return_mode = 2;    //->    username có tồn tại, nhập đúng mật khẩu, đăng nhập thành công
        // req.session.user = user;
        // req.session.auth = true;
    }
    res.json({return_mode : return_mode});
});

router.post('/create-account',async function(req,res,next){
    const data = {
        hoten: req.body.fullname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        vaitro: 0,
        avatar: 'images/default_avatar.png',
        status: true
    }
    const user = await userModel.add(data);
    if(user === null){
        res.status(406);
    }
    res.json({});
});

module.exports = router;