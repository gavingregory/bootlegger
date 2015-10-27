angular.module('bootleggerApp')
.controller('loginController', function ($scope, $log, localStorage) {
  window.location.replace('http://localhost:1337/api/auth/login?apikey=' + localStorage.get('apikey'));
});
