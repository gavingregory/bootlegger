angular.module('bootleggerApp')
.controller('loginController', function ($scope, $log, localStorage) {
  window.location.replace('http://dev.bootlegger.tv/api/auth/login?apikey=' + localStorage.get('apikey'));
});
