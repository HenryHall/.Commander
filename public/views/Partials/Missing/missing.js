
angular.module('commanderDash').controller('missingController', ['$scope', '$routeParams', function($scope, $routeParams){

  console.log("Hello from missing.");
  $scope.pageType = $routeParams.pageType;

  $scope.imgSrc = 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=366433&type=card';

}]);
