
angular.module('commanderDash').controller('homeController', ['$scope', '$interval', 'DataService', function($scope, $interval, DataService){

  var $ctrl = this;

  Promise.resolve(DataService.getCardList()).then((cardList) => {
    $ctrl.allCards = cardList;
    $ctrl.list = Object.keys(cardList);
  });

  $ctrl.getCard = function(cardName){
    var multiverseid = DataService.getCardImgNumber(cardName);
    $ctrl.imgSrc = "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + multiverseid + "&type=card";
  }

  // $ctrl.imgSrc = '../assets/defaultCardImg.jpg';
  $ctrl.getCard('Dramatic Reversal');

}]);
