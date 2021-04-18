
const db = require("../utils/db");
module.exports = function (app) {
  //home
  app.get('/', async function (req, res) {
      res.render("index")
   });

  app.get('/login', async function (req, res) {
    res.render("login",{layout: false});
   });
   
  app.get('/signup', async function (req, res) {

   });
  app.post('/login', async function (req, res) {

   });
  app.post('/signup', async function (req, res) {

   });
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