
function NavBarController($scope, $element, $attrs){

  var $ctrl = this;

  //Get this with a service
  $ctrl.members = [
    'Geoff',
    'David',
    'Carolyn',
    'Henry',
    'Tink',
    'Ima',
    'Maggie',
    'Navi'
  ];


  //Close hamburger menu on selection
  var hamburger = angular.element($element[0].querySelector('.navbar-collapse'));
  hamburger.on("click", "a:not([data-toggle])", null, function () {
         hamburger.collapse('hide');
     });

};



angular.module('commanderDash').component('navBar', {
  templateUrl: './views/Partials/NavBar/navBar.html',
  bindings: {},
  controller: NavBarController
});
