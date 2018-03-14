
console.log("Hello World!");

var commanderDash = angular.module('commanderDash', ['ngRoute']);


commanderDash.config(function($routeProvider){

  $routeProvider
    .when('/', {
      //Home
      templateUrl: './views/Home/home.html',
      controller: 'homeController',
      controllerAs: 'home'
    })
    .when('/banList', {
      templateUrl: './views/BanList/banList.html',
      controller: 'banListController',
      controllerAs: 'banList'
    })
    // .when('/league', {
    //   templateUrl: '',
    //   controller: ''
    // })
    // .when('manageGroup', {
    //   templateUrl: '',
    //   controller: ''
    // })
    // .when('/profiles', {
    //   templateUrl: '',
    //   controller: ''
    // });

});



commanderDash.controller('pageController', ['$scope', function($scope){



}]);


// commanderDash.service('dataService', function(){
//
//   // $http({});
//
// });
