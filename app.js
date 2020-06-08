(function (){
  'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController',NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', foundItemsDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

function foundItemsDirective(){
  var ddo = {
    templateUrl: 'shoppingList.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: foundItemsDirectiveController,
    controllerAs: 'menu',
    bindToController: true
  }
  return ddo;
};

function foundItemsDirectiveController(){
  var menu = this;

  menu.checkEmptyList = function () {
    if (menu.items !== undefined && menu.items.length === 0) {
      return true;
    }
    return false;
  };
}

NarrowItDownController.$inject = ['$scope','MenuSearchService'];
function NarrowItDownController($scope,MenuSearchService){
  var menu = this;

  menu.getMenuItems = function(){

    var promise = MenuSearchService.getMatchedMenuItems($scope.searchTerm);
    promise.then(function (result) {
      menu.found = result;
    })
    .catch(function (error) {
      console.log(error.message);
    });

  }

  menu.removeItem = function(index){
    menu.found.splice(index, 1);
  }
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath){
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {

    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    }).then(function success(result){

      var foundItems = [];
      var foundData = result.data.menu_items;

      if(searchTerm !== undefined && searchTerm.length > 0){
        searchTerm = searchTerm.toLowerCase();

        for(var i=0;i<foundData.length;i++){
          var item = foundData[i];
          if(item.description.toLowerCase().indexOf(searchTerm) !== -1){
            foundItems.push(item);

          }
        }

    }
      return foundItems;

    },function error(response) {
        throw new Error("Error occured!");
    });


  };

}
})();
