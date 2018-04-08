
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
    })
    .when('/deckList/newList', {
      templateUrl: './views/DeckList/newList.html',
      controller: 'newListController',
      controllerAs: 'newList'
    })
    .when('/deckList/:deckListID', {
      templateUrl: './views/DeckList/deckList.html',
      controller: 'deckListController',
      controllerAs: 'deckList'
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


// #/DeckList/newList

commanderDash.service('DataService', ['$http', '$timeout', '$q', function($http, $timeout, $q){

  $svc = this;
  $svc.allCards = undefined;
  $svc.userObject = undefined;

  $svc.getCardList = function(){
    if($svc.allCards){
      return $svc.allCards;
    } else {
      //Fix source
      var cardListPromise = $http.get('https://raw.githubusercontent.com/HenryHall/.Commander/master/AllCards.json')
        .then( (cardList) => {
          console.log("Got http data");
          $svc.allCards = cardList.data;
          return cardList.data;
        },
        function(err){
          console.log("Could not retrieve cardList");
        });
      return cardListPromise;
    }
  }

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

  //Run on load
  $svc.getCardList();


}]);



commanderDash.controller('pageController', ['$scope', 'DataService', function($scope, DataService){

  var $ctrl = this;

}]);
