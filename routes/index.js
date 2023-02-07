const express = require('express');
const router = express.Router();


/* the route renders a response using the template "index" passing 
the template variable "title" 
GET home page
*/
router.get('/', function(req, res, next) {
  res.redirect('/list');
});

module.exports = router;
