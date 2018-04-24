
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
    .when('/profile', {
      templateUrl: './views/Profile/profile.html',
      controller: 'profileController',
      controllerAs: 'profile'
    })
    .when('/b/New', {
      templateUrl: './views/BanList/newBanlist.html',
      controller: 'newBanlistController',
      controllerAs: 'nBanlist'
    })
    .when('/b/:banlistID', {
      templateUrl: './views/BanList/banList.html',
      controller: 'banlistController',
      controllerAs: 'banlist'
    })
    .when('/d/New', {
      templateUrl: './views/DeckList/newList.html',
      controller: 'newListController',
      controllerAs: 'newList'
    })
    .when('/d/:deckListID', {
      templateUrl: './views/DeckList/deckList.html',
      controller: 'deckListController',
      controllerAs: 'deckList'
    })
    .when('/g/New', {
      templateUrl: './views/Group/newGroup.html',
      controller: 'groupController',
      controllerAs: 'group'
    })
    .when('/g/:groupID', {
      templateUrl: './views/Group/group.html',
      controller: 'groupController',
      controllerAs: 'group'
    })
    .when('/missing/:pageType', {
      templateUrl: './views/Partials/Missing/missing.html',
      controller: 'missingController',
      controllerAs: 'missing'
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

  // $svc.getCardObject  = function(){};

  $svc.getCardImgNumber = function(cardName){
    if(!$svc.allCards){
      $svc.getCardList().then(() => {
        return $svc.allCards[cardName].multiverseid;
      });
    }

    //Else
    console.log("Getting image for", cardName);
    console.log($svc.allCards[cardName]);
    return $svc.allCards[cardName].multiverseid;
  };

  $svc.getUserObject = function(){
    if($svc.userObject){
      return $svc.userObject;
    } else {
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
  }

  //Run on load
  $svc.getCardList();


}]);



commanderDash.controller('pageController', ['$scope', 'DataService', function($scope, DataService){

  var $ctrl = this;

}]);
