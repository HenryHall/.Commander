
angular.module('commanderDash').controller('homeController', ['$scope', '$interval', 'DataService', function($scope, $interval, DataService){

  var $ctrl = this;

  Promise.resolve(DataService.getCardList()).then((cardList) => {
    $ctrl.allCards = cardList;
    $ctrl.list = Object.keys(cardList);
  });

  DataService.getUserObject().then((userObject) => {
    $ctrl.userObject = userObject;
  });

  // $ctrl.imgSrc = '../assets/defaultCardImg.jpg';
  $ctrl.imgSrc = 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417617&type=card';

  $ctrl.getCard = function(cardName){
    // var allCards = DataService.getCardList();
    $ctrl.imgSrc = "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + $ctrl.allCards[cardName].multiverseid + "&type=card";
  }

}]);
