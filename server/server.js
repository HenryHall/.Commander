
console.log("Hello from server.js");

var express = require('express');
var path = require('path');
var server = express();

server.use( express.static( 'public' ) );

server.set('port', process.env.PORT || 3000);
server.listen(server.get('port'), function() {
  console.log('Server up:', server.get('port'));
});


server.get( '/', function( req, res ){
  console.log( 'Serving Home' );
  res.sendFile( path.resolve( 'public/views/index.html' ) );
});

// var myRoute = require ('../server/modules/route.js');
// server.use('/myRoute', myRoute);
