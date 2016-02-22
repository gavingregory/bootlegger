angular.module('bootleggerApp')
.controller('loginController', function ($scope, $log, localStorage, authFactory) {
  authFactory.login();
});
