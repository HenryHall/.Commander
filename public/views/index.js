
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
    .when('/profile', {
      templateUrl: './views/Profile/profile.html',
      controller: 'profileController',
      controllerAs: 'profile'
    });
    // .when('/league', {
    //   templateUrl: '',
    //   controller: ''
    // })
    // .when('manageGroup', {
    //   templateUrl: '',
    //   controller: ''
    // });

});


commanderDash.service('DataService', ['$http', '$timeout', '$q', function($http, $timeout, $q){

  $svc = this;
  $svc.allCards = undefined;
  $svc.userObject = undefined;

  var maxAttempts = 5;

  console.log("Getting card data");
  $http.get('https://raw.githubusercontent.com/HenryHall/.Commander/master/AllCards.json')
  .then( (cardList) => {
    console.log("Got http data");
    $svc.allCards = cardList.data;
  });//Should Error handle here, fix

  $svc.getCardList = function(attempts){
    attempts = attempts ? attempts : 1;

    if(attempts > maxAttempts - 1){
      console.log("Could not get card data.  Max attempts reached(" + attempts + ").");
      return false;
    }

    if($svc.allCards){
      return $svc.allCards;
    } else {
      // setTimeout(function () {
      //   console.log("Trying again...");
        return $svc.getCardList(attempts+1);
      // }, 1000);
    }
  };


  //Callback fix
  // $svc.getCardList = function(callback){
  //   if(!$svc.cardList){
  //     console.log("Getting cards via http");
  //     $http.get('https://raw.githubusercontent.com/HenryHall/.Commander/master/AllCards.json')
  //     .success( (cardList) => {
  //       $svc.allCards = cardList;
  //       return callback($svc.allCards);
  //     })
  //     .error( (err) => {
  //       throw new Error(err);
  //     });
  //   } else {
  //     return callback($svc.allCards);
  //   }
  // }


  $svc.getUserObject = function(){
    var userObjectPromise = $http.get('/getUserInfo')
    .then((userObject) => {
      console.log("userObject returned:", userObject.data);
      return userObject.data
    },
    function(err){
      console.log("/getUserInfo failed", err);
    });
    return userObjectPromise;
  }


}]);



commanderDash.controller('pageController', ['$scope', 'DataService', function($scope, DataService){

  var $ctrl = this;

}]);
