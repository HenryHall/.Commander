
angular.module('commanderDash').controller('homeController', ['$scope', '$interval', 'DataService', function($scope, $interval, DataService){

  var $ctrl = this;

  // **FIX**
  // var getCardList = new Promise(DataService.getCardList);
  // getCardList.then((cardList) => {
  //   $ctrl.list = Object.keys(cardList);
  // });

  setTimeout(function () {
    $ctrl.list = Object.keys(DataService.getCardList());
  }, 1000);  //Why does this need to be delayed?  Fix

  // $ctrl.imgSrc = '../assets/defaultCardImg.jpg';
  $ctrl.imgSrc = 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=417617&type=card';

  $ctrl.getCard = function(cardName){
    var allCards = DataService.getCardList();
    $ctrl.imgSrc = "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + allCards[cardName].multiverseid + "&type=card";
  }

  // var userObject = DataService.getUserObject();


}]);
