/* 
First, it loads the express module and uses it to get an 
express.Router object. Then it specifies a route on that 
object and lastly exports the router from the module (this 
  is what allows the file to be imported into app.js)
*/
const express = require('express');
const router = express.Router();

/* GET users listing */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/homepage', function(req, res, next) {
  res.render('index', { title: 'Users Page' });
});

module.exports = router;
