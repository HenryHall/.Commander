

function CardHoverController($scope, $element, DataService){

  var $ctrl = this;

  $ctrl.cardname = $scope.cardname;
  $ctrl.position = $scope.position ? $scope.position : "top";

  //Enable popover
  $ctrl.$onChanges = function(changesObj){
    if(changesObj.cardname.isFirstChange()){return;}

    var popoverElem = $element[0].querySelector('.cardHover');
    var multiverseid = DataService.getCardImgNumber($ctrl.cardname);
    var url = 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=' + multiverseid + '&type=card';
    $(popoverElem).popover({
      html: true,
      container: 'body',
      trigger: 'hover',
      placement: $ctrl.position,
      content: function(){
        return '<img class="popCard" src="' + url + '" />';
      }
    });
  };

}

angular.module('commanderDash').component('cardHover', {
  templateUrl: './views/Partials/CardHover/cardHover.html',
  bindings: {
    position: '@',
    cardname: '@'
  },
  controller: ['$scope', '$element', 'DataService', CardHoverController]
});
