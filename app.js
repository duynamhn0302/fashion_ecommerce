const express = require('express');
const morgan = require('morgan');
require('express-async-errors');
var Handlebars = require('handlebars');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const config = require('./config/default.json');

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

const app = express();
//store session
const sessionStore = new MySQLStore(config.mysql);

app.set('trust proxy', 1)
app.use(session({
  secret: 'SECRET_KEY',
  resave: false,
  saveUnitialized: true,
  store: sessionStore,
  cookie: {
    //secure: true
  }
}));

app.use(morgan('dev'));
app.use(express.urlencoded({
  extended: true
}));
//---local---
require('./middlewares/locals.mdw')(app);
// app.use(async function (req,res,next){
//   if(typeof(req.session.auth) === 'undefined'){
//     req.session.auth = false;
//   }
//   if (req.session.auth===false){
//     req.session.cart=[];
//     req.session.shopCart=[];
//   }
//   else{
//     // req.session.cart=await cartModel.getFaCartById(req.session.authUser.user_id);
//     // req.session.shopCart= await cartModel.getBuyCartById(req.session.authUser.user_id)
//   }
//   res.locals.cid = null;
//   res.locals.auth = req.session.auth;
//   res.locals.authUser = req.session.authUser;
//   res.locals.cartSummary=cartModel.getNumberOfItems(req.session.cart);
//   res.locals.shopCartSummary=cartModel.getNumberOfItems(req.session.shopCart);
//   res.locals.cartTotal=cartModel.getPriceOfItems(req.session.cart);
//   res.locals.shopcartTotal=cartModel.getPriceOfItems(req.session.shopCart);
//   next();
// })

app.use('/resources', express.static('resources'));
require('./middlewares/view.mdw')(app);
require('./middlewares/routes.mdw')(app);
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.render('500', {
    layout: false
  })
})

const PORT = process.env.PORT||3000;
app.listen(PORT, "0.0.0.0",function () {
  console.log(`E-Commerce app is listening at http://localhost:${PORT}`)
})