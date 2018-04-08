
angular.module('commanderDash').controller('profileController', ['$scope', 'DataService', function($scope, DataService){

  console.log("Hello from profileController.");
  var $ctrl = this;

  DataService.getUserObject().then((userObject) => {
    $ctrl.userObject = userObject;
  });

}]);
