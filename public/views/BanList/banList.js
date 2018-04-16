
angular.module('commanderDash').controller('banlistController', ['$scope', 'DataService', '$http', '$routeParams', '$location', function($scope, DataService, $http, $routeParams, $location){

  var $ctrl = this;

  $ctrl.userBanlist;

  $http.get('/banlist/' + $routeParams.banlistID)
  .success( (banlistObject) => {
    console.log("banlistObject:", banlistObject);
    $ctrl.banlistObject = banlistObject;
  })
  .error( (err) => {
    $location.path( '/missing/banlist' );
  });


}]);
