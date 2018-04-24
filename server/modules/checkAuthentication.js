
module.exports = {
  checkAuth: function(req, res, next){
    console.log("Checking Auth for", req.url);
      if(req.isAuthenticated()){
        next();
      } else {
        console.log("User is not currently logged in.");
        return false;
      }
    },
  authProtect: function(req, res, next){
    console.log("Requiring Auth for", req.url);
      if(req.isAuthenticated()){
        next();
      } else {
        console.log("User must be logged in.  Redirecting...");
        return res.redirect('/login');
      }
    }

};
