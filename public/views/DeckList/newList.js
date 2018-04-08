
angular.module('commanderDash').controller('newListController', ['$scope', '$http', '$location', function($scope, $http, $location){

  var $ctrl = this;

  $scope.submitNewList = function(){

    console.log("Sending:", $scope.newList);

    $http.post('/d/newList', $scope.newList)
      .success( (returnData) => {
        console.log(returnData);
        console.log("New deck list ID created:", returnData.deckListID);
        $location.path('/deckList/' + returnData.deckListID);
      }).error( (err) => {
        console.log(err);
        throw new Error("New List POST failed.");
      });

  };

}]);
