angular.module('bootleggerApp')
.controller('navbarController', function ($scope, $cookies) {
  $scope.loggedIn = false;
  var sessionId = $cookies.get("sails.sid");
  if (typeof sessionId === "undefined") {
    $scope.loggedIn = true;
    console.log('undefined!');
  } else {
    $scope.loggedIn = false;
    console.log('defined?');
  }
  $scope.logout = function () {
    $cookies.remove("sails.sid");
    $scope.loggedIn = false;
  };
  $scope.test = function () {
    $cookies.put('test', 'test');
    $cookies.put("test.test", 'test');
    console.log('test' + $cookies.get('test'));
    console.log('dbl: ' + $cookies.get("test.test"));
  };
});
