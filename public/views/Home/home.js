
angular.module('commanderDash').controller('homeController', ['$scope', '$interval', 'DataService', function($scope, $interval, DataService){

  var $ctrl = this;

  setTimeout(function () {
    $ctrl.list = Object.keys(DataService.getCardList());
  }, 1000);  //Why does this need to be delayed?  Fix

  // $ctrl.imgSrc = '../assets/defaultCardImg.jpg';
  $ctrl.imgSrc = 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=370405&type=card';

  $ctrl.getCard = function(cardName){
    var allCards = DataService.getCardList()
    $ctrl.imgSrc = "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + allCards[cardName].multiverseid + "&type=card";
  }


}]);
