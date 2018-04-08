
angular.module('commanderDash').controller('deckListController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

  console.log("Hello from deckListController");

  var $ctrl = this;

  console.log("Route Params:", $routeParams);

  $http.get('/deckList/' + $routeParams.deckListID)
  .success( (returnData) => {
    console.log(returnData.deckInfo);
    $ctrl.returnData.deckInfo;
  })
  .error( (err) => {
    console.log("Deck list data retrevial failed", err);
    //Display some feedback about error
  });

}]);
