angular.module('bootleggerApp')
.controller('indexController', function ($scope, $log, authFactory, $cookies) {
  $scope.session = $cookies.get('sails.sid');
  function init() {
    authFactory.setApiKey();
    console.log('something');
  }
  init();
});
