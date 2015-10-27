angular.module('bootleggerApp')
.controller('loginSuccessController', function ($scope, $log, $location, $cookies) {
  var results = $location.search();
  $cookies.put('sails.sid', results['session']);
  window.location.replace('/#/');
});
//
// angular.module('cookiesExample', ['ngCookies'])
// .controller('ExampleController', ['$cookies', function($cookies) {
//   // Retrieving a cookie
//   var favoriteCookie = $cookies.get('myFavorite');
//   // Setting a cookie
//   $cookies.put('myFavorite', 'oatmeal');
// }]);
