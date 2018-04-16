

angular.module('commanderDash').controller('groupController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

  console.log("Hello from groupController");

  var $ctrl = this;

  $http.get('/group/' + $routeParams.groupID)
  .success( (groupObject) => {
    console.log("groupObject", groupObject);
    groupObject ? $ctrl.groupObject = groupObject : $location.path( '/missing/Group' );
  })
  .error( (err) => {
    console.log("Deck list data retrevial failed", err);
    //Display some visual feedback about error
  });

}]);
