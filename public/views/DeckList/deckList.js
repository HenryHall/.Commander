
angular.module('commanderDash').controller('deckListController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

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
