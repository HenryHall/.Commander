

// Dummy Data
var myBLists = [
  {banlistID: 54321, memberID: 80081355, banlistName: "Tuesday Commander", groupCount: 4, creationDate: Date.now(), isPublic: true},
  {banlistID: 43215, memberID: 80081355, banlistName: "Friday Night Brawl", groupCount: 8, creationDate: Date.now(), isPublic: true},
  {banlistID: 32154, memberID: 80081355, banlistName: "Weekend Warriors", groupCount: 16, creationDate: Date.now(), isPublic: false}
];

var allBlists = [
  {banlistID: 12345, memberID: "WotC", banlistName: "Vintage", groupCount: 223, creationDate: Date.now(), isPublic: true},
  {banlistID: 23451, memberID: "WotC", banlistName: "Legacy", groupCount: 968, creationDate: Date.now(), isPublic: true},
  {banlistID: 34512, memberID: "WotC", banlistName: "Modern", groupCount: 7689, creationDate: Date.now(), isPublic: true},
  {banlistID: 45123, memberID: "WotC", banlistName: "Standard", groupCount: 17902, creationDate: Date.now(), isPublic: true}
];



angular.module('commanderDash').controller('banListController', ['$scope', 'DataService', function($scope, DataService){

  var $ctrl = this;

//Init
  setTimeout(function () {
    $ctrl.allCards = Object.keys(DataService.getCardList());
  }, 1000);

  $scope.shownBLists = myBLists;
  //Options: myBanList, searchLists, newList
  $scope.listView = {view: 'myBanList'};
  $scope.$watchCollection('listView.view', (newValue, oldValue) => {
    if(oldValue == newValue){return false;}
    console.log(newValue);
    switch (newValue) {
      case 'myBanList':
        //Http call to get lists
        $scope.shownBLists = myBLists;
        break;
      case 'searchLists':
        //Http call to get lists
        $scope.shownBLists = allBlists;
        break;
      case 'newList':
        // $scope.
        break;
      default:
        throw new Error("Invalid listView.  How did you get here?");

    }
  });  //End Watch


}]);
