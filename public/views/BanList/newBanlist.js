
angular.module('commanderDash').controller('newBanlistController', ['$scope', '$http', 'DataService', '$location', function($scope, $http, DataService, $location){

  var $ctrl = this;

  $ctrl.newList = {
    banlistName: undefined,
    isPublic: true,
    bans: []
  };

  Promise.resolve(DataService.getCardList()).then((cardList) => {
    $ctrl.allCards = cardList;
    $ctrl.list = Object.keys(cardList);
  });

  $ctrl.addCard = function(cardName){
    if(!$ctrl.newList.bans.includes(cardName)){
      $ctrl.newList.bans.push(cardName);
    }
  }

  $ctrl.submitNewList = function(){
    //Validate
    if(!$ctrl.newList.banlistName || !$ctrl.newList.bans.length){throw new Error("You must submit a list with a name and bans.");}

    console.log("Sending:", $ctrl.newList);
    $http.post('/banlist/new', $ctrl.newList)
      .success( (banlistID) => {
        banlistID = banlistID.banlistID;
        console.log("New ban list ID created:", banlistID);
        $location.path('/b/' + banlistID);
      }).error( (err) => {
        console.log(err);
        throw new Error("New List POST failed.");
      });
  }

}]);
