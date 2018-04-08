
module.exports = function(req, res, next){

  if(req.isAuthenticated()){
    next();
  } else {
    console.log("Not currently logged in.");
    res.redirect('/login');
  }

};
