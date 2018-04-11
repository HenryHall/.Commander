

angular.module('commanderDash').controller('groupController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){

  console.log("Hello from groupController");

  var $ctrl = this;

  $http.get('/group/' + $routeParams.groupID)
  .success( (groupObject) => {
    console.log("groupObject", groupObject);
    $ctrl.groupObject = groupObject;
  })
  .error( (err) => {
    console.log("Deck list data retrevial failed", err);
    //Display some visual feedback about error
  });

}]);
