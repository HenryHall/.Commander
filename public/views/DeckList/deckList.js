
angular.module('commanderDash').controller('deckListController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

  console.log("Hello from deckListController");

  var $ctrl = this;

  $http.get('/deckList/' + $routeParams.deckListID)
  .success( (deckInfo) => {
    console.log(deckInfo);
    // $ctrl.deck = deckInfo;
    deckInfo ? $ctrl.deck = deckInfo : $location.path( '/missing/Deck' );

  })
  .error( (err) => {
    console.log("Deck list data retrevial failed", err);
    //Display some visual feedback about error
  });

}]);
