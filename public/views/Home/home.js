
angular.module('commanderDash').controller('homeController', ['$scope', function($scope){

  var $ctrl = this;

  $ctrl.backgroundImage = "../../assets/backgroundImage.jpg"
  $ctrl.list = ['Black Lotus', 'Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Wastes'];

  $ctrl.getCard = function(cardName){
    console.log("Home got:", cardName);
  }


}]);
