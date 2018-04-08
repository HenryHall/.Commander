
function CardSearchController($scope, $element, $attrs){

  var $ctrl = this;

  $ctrl.$onInit = function(){
    // console.log("Hello from CardSearchController");
    $ctrl.suggestionList = [];  //Has a watch attached
    $ctrl.selectedSearch = 0;
    $ctrl.maxSuggestions = 10;
    $ctrl.hasList = $ctrl.list ? true : false;  //Has a watch attached

    $ctrl.clrOnSubmit = false;

    $ctrl.optionsOpen = false;   //Has a watch attached
  };

  $ctrl.handleKeypress = function($event){
    switch ($event.keyCode) {
      case 27:  //Escape
        $ctrl.suggestionList = [];  //This is sloppy, fix
        break;
      case 13:  //Enter
        //Handle Submit
        $event.preventDefault();
        $ctrl.outputAction()
        break;

      case 33:  //Page Up
      case 38:  //Up Arrow
        //Handle Previous
        $ctrl.prevSuggestion();
        $event.preventDefault();
        break;

      case 9:   //Tab
      case 34:  //Page Down
      case 40:  //Down Arrow
        //Handle Next
        $ctrl.nextSuggestion();
        $event.preventDefault();
        break;

      default:
        //Handle Default
        break;
    }
  }


  $ctrl.getSuggestions = function(){
    //Show suggestionResults
    $element.find('#searchResults')[0].style.display = 'Block';

    if(!$ctrl.list){throw new Error("List is not defined yet.")}

    var model = $ctrl.queryIn;
    var output = [];

    //Only filter after at least 1 characters have been entered
    if(model && model.length > 0){

      //Search for matches starting at index 0 first
      for(var i=0; i<$ctrl.list.length; i++){
        if($ctrl.list[i].toLowerCase().indexOf(model.toLowerCase()) == 0 && output.indexOf($ctrl.list[i]) == -1){
          output.push($ctrl.list[i]);
          if(output.length >= $ctrl.maxSuggestions) return $ctrl.suggestionList = output;
        }
      }

      //Then search at any index
      for (var i=0; i<$ctrl.list.length; i++){
        if($ctrl.list[i].toLowerCase().indexOf(model.toLowerCase()) !== -1 && output.indexOf($ctrl.list[i]) == -1){
          output.push($ctrl.list[i]);
          if(output.length >= $ctrl.maxSuggestions) return $ctrl.suggestionList = output;
        }
      }
    }

    $ctrl.suggestionList = output;
    return;
  }


  $ctrl.selectSuggestion = function(index){
    $scope.selectedSearch = index;
    $ctrl.queryIn = $ctrl.suggestionList[index];
    $element[0].querySelector('.queryIn').focus();
    $ctrl.outputAction();
  }


  $ctrl.nextSuggestion = function(){
    if($scope.selectedSearch + 1 >= $ctrl.suggestionList.length){
      $scope.selectedSearch = 0;
    } else {
      $scope.selectedSearch++;
    }
  }


  $ctrl.prevSuggestion = function(){
    if($scope.selectedSearch - 1 < 0){
      $scope.selectedSearch = $ctrl.suggestionList.length - 1;
    } else {
      $scope.selectedSearch--;
    }
  }


  $scope.$watch('$ctrl.suggestionList', function(newValue, oldValue){
    if(newValue !== oldValue){
      $scope.selectedSearch = 0;
    }
  });


  $scope.$watch('$ctrl.optionsOpen', function(newValue, oldValue){
    if(newValue !== oldValue){

      var queryOptionsBtn = $element.find('.queryOptionsBtn')[0];

      queryOptionsBtn.blur();

      if(queryOptionsBtn.classList.contains('queryOptionsOpen')){
        queryOptionsBtn.classList.remove('queryOptionsOpen');
      } else {
        queryOptionsBtn.classList.add('queryOptionsOpen');
      }

      var queryOptionsBtn = $element.find('.glyphicon-cog')[0];
      if(queryOptionsBtn.classList.contains('spin')){
        queryOptionsBtn.classList.remove('spin');
      } else {
        queryOptionsBtn.classList.add('spin');
      }


    }
  });


  $ctrl.outputAction = function(){
    //Hide suggestions
    $element.find('#searchResults')[0].style.display = 'None';

    //Make model same as active
    var model = $ctrl.suggestionList[$scope.selectedSearch];
    if(model){ $ctrl.suggestionList = [model]; };

    //Handle display on submit
    if($ctrl.clrOnSubmit){
      $ctrl.queryIn = '';
      $ctrl.suggestionList = [];
      $scope.selectedSearch = 0;
    } else {
      $ctrl.queryIn = model;
    }

    //Envoke callback
    if (model){ return $ctrl.callback(model); }
  }


}

angular.module('commanderDash').component('cardSearch', {
  templateUrl: './views/Partials/CardSearch/CardSearch.html',
  bindings: {
    placeholder: '@',
    list: '<',
    callback: '<'
  },
  controller: CardSearchController
});
