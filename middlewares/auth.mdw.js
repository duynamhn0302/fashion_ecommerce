const db = require('../utils/db');

module.exports = {

    //nen redirect toi mot trang bao loi bat nguoi dung dn bang tk gi truoc da

    auth(req,res,next){
        if(req.session.auth===false){
            req.session.retUrl = req.originalUrl;
            return res.redirect('/login');
        }
        next();
    },

    auth_reverse(req,res,next){
        if(req.session.auth===true){
            // req.session.retUrl = req.originalUrl;    
            req.session.retUrl = '/';
        }
        next();
    },

    // authIndex(req,res,next){
    //     if(req.session.auth===true)
    //     {
    //         if (req.session.authUser.role===1)
    //         {
    //             return res.redirect('/shop');
    //         }
    //         if (req.session.authUser.role===2)
    //         {
    //             return res.redirect('/admin');
    //         }
    //     }
    //     next();
    // },

    // authIndexCart(req,res,next){
    //     if(req.session.auth===true)
    //     {
    //         if (req.session.authUser.role===1)
    //         {
    //             return res.redirect('/lecturer');
    //         }
    //         if (req.session.authUser.role===2)
    //         {
    //             return res.redirect('/admin');
    //         }
    //     }
    //     else
    //     {
    //         return res.redirect('/account/login');
    //     }
    //     next();
    // },

    authUser(req,res,next){
        if(req.session.auth===false){
            req.session.retUrl = req.originalUrl;
            return res.redirect('/login');
        }else{      //req.session.auth === true
            if(req.session.authUser.vaitro === 2){        //admin
                req.session.retUrl = req.originalUrl;
                return res.redirect('/');
            }
        }
        next(); //user,shopper
    },

    authShop(req,res,next){
        if(req.session.auth===false){
            req.session.retUrl = req.originalUrl;
            return res.redirect('/login');
        }else{      //req.session.auth === true
            if(req.session.authUser.vaitro !== 1){        //user,admin
                req.session.retUrl = req.originalUrl;
                return res.redirect('/admin');
            }
        }
        next(); //shopper
    },

    authAdmin(req,res,next){
        if(req.session.auth===false){
            req.session.retUrl = req.originalUrl;
            return res.redirect('/login');
        }else{      //req.session.auth === true
            if(req.session.authUser.vaitro !== 2){        //user,shopper
                req.session.retUrl = req.originalUrl;
                return res.redirect('/');
            }
        }
        next();     //admin
    }

    /*
    authCanWatch(req,res,next){   //dảnh riêng cho trang xem video khóa học
        var found = false;
        console.log(req.session.courses);
        console.log(req.params.id);
        if(req.session.courses !== null){
            for(var i=0;i<req.session.courses.length;i++){
                if(req.session.courses[i].course_id === req.params.id)   found=true;
            }
        }
        if(found===false){
            res.render('vwError/cannot_access',{
                layout: false,
                error: 'Bạn chưa mua khóa học này mà, sao mà xem được',
                retURL: req.headers.retUrl
            });
        }
    }
    */
}