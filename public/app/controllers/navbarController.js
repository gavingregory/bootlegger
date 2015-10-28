angular.module('bootleggerApp')
.controller('navbarController', function ($scope, $cookies, authFactory) {
  $scope.loggedIn = false;

  $scope.logout = function () {
    authFactory.logout()
      .success(function () {
        $scope.loggedIn = false;
        $cookies.remove('sessionid');
      })
      .error(function (data, status, headers, config) {
        $log.log(data.error + ' ' + status);
      });
  };

  authFactory.isAuthenticated()
    .success(function (resp) {
      if (resp.session) {
       $scope.loggedIn = true;
       $cookies.put('sessionid', resp.session);
       console.log('session exists!');
     } else {
       console.log('uhhh')
     }
    })
    .error(function (data, status, headers, config) {
      $log.log(data.error + ' ' + status);
    })
    .finally(function () {
      $log.log('finally');
    });
});
