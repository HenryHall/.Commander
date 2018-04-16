
angular.module('commanderDash').controller('newListController', ['$scope', '$http', function($scope, $http){

  var $ctrl = this;

  $scope.submitNewList = function(){

    console.log("Sending:", $scope.newList);

    $http.post('/deckList/newList', $scope.newList)
      .success( (deckListID) => {
        console.log(deckListID);
        console.log("New deck list ID created:", deckListID);
        $location.path('/d/' + deckListID);
      }).error( (err) => {
        console.log(err);
        throw new Error("New List POST failed.");
      });

  };

}]);
