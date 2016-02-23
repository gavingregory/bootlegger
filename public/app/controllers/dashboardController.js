angular.module('bootleggerApp')
.controller('dashboardController', function ($scope, $cookies, $log, authFactory, localStorage) {
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
       authFactory.profile()
         .success(function(me){
           $scope.me = JSON.parse(me.body);
           localStorage.setObject('me', $scope.me);
         });
     }
    })
    .error(function (data, status, headers, config) {
      $log.log(data.error + ' ' + status);
    });
});
