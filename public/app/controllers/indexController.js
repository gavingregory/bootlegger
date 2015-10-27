angular.module('bootleggerApp')
.controller('indexController', function ($scope, $log, localStorage, $routeParams, authFactory, $cookies) {
  $scope.session = $cookies.get('sails.sid');
  function init() {
    authFactory.setApiKey();
  }
  console.log($cookies.get('sails.sid'));

  init();
});
