
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


commanderDash.service('DataService', ['$http', '$timeout', function($http, $timeout){

  $svc = this;
  $svc.allCards = undefined;

  console.log("Start http");
  $http.get('https://raw.githubusercontent.com/HenryHall/.Commander/master/AllCards')
  .then( (cardList) => {
    console.log("Got http data");
    $svc.allCards = cardList.data;
  });//Should Error handle here, fix


  $svc.getCardList = function(){
    if($svc.allCards){
      return $svc.allCards;
    } else {
      // setTimeout(function () {
      //   console.log("Trying again...");
        return $svc.getCardList();
      // }, 1000);
    }
  };

}]);



commanderDash.controller('pageController', ['$scope', 'DataService', function($scope, DataService){

  var $ctrl = this;

}]);
