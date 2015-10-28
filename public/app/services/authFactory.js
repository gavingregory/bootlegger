angular.module('bootleggerApp')
  .factory('authFactory', function ($http, $window, localStorage) {
    var factory = {};

    var apikey = localStorage.get('apikey');

    factory.setApiKey = function () {
      localStorage.set('apikey', 'a9c2e463-c12e-494a-b82a-6394183a30c3');
    };

    factory.login = function () {
      return $window.location.href='http://localhost:1337/api/auth/login?apikey=' + apikey;
    };

    factory.logout = function () {
      return $http.get('/api/v1/auth/logout');
    };

    factory.isAuthenticated = function () {
      return $http.get('/api/v1/auth/session');
    };

    factory.profile = function () {
      return $http.get('http://localhost:1337/api/profile/me?apikey='+apikey);
    }

    return factory;

  });
