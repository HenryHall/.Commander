
angular.module('commanderDash').controller('homeController', ['$scope', '$interval', 'DataService', function($scope, $interval, DataService){

  var $ctrl = this;

  Promise.resolve(DataService.getCardList()).then((cardList) => {
    $ctrl.allCards = cardList;
    $ctrl.list = Object.keys(cardList);
  });

  $ctrl.getCard = function(cardName){
    console.log("Here");
    Promise.resolve(DataService.getCardImgNumber(cardName))
    .then((multiverseid) => {
      $ctrl.imgSrc = "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + multiverseid + "&type=card";
      $scope.$apply();
      console.log("Here2");
    });
  }

  $ctrl.imgSrc = '../assets/defaultCardImg.jpg';
  // $ctrl.getCard('Dramatic Reversal');

}]);
