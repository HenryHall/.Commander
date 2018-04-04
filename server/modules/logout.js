
var express = require('express');
var router = express.Router();

// Perform session logout and redirect to homepage
router.get('/', function(req, res){
  req.logout();
  res.redirect('/');
});


module.exports = router;
