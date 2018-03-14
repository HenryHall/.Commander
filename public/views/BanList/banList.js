

angular.module('commanderDash').controller('banListController', ['$scope', function($scope){

  var $ctrl = this;

  //Get data from service, dummy
  $ctrl.allCards = ['Black Lotus', 'Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Wastes'];

  //Get data from service, dummy
  $ctrl.bannedCards = [
    'Black Lotus',
    'Mox Pearl',
    'Mox Sapphire',
    'Mox Jet',
    'Mox Ruby',
    'Mox Emerald',
    'Time Walk',
    'Time Twister',
    'Library of Alexandria',
    'Ancestrial Recall'
  ].sort();

  // BanList placeholder function
  $ctrl.addCard = function(cardName){
    console.log("Adding banned card:", cardName);
    if($ctrl.bannedCards.indexOf(cardName) == -1){
      $ctrl.bannedCards.push(cardName);
      $ctrl.bannedCards.sort();
    } else {
      console.log(cardName, "is already on the ban list.");
    }
  }


}]);
