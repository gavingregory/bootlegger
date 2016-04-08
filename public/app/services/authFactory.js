angular.module('bootleggerApp')
  .factory('authFactory', function ($http, $window, localStorage) {
    var factory = {};

    var apikey = localStorage.get('apikey');

    factory.setApiKey = function () {
      localStorage.set('apikey', '5fbeed71-e0f1-4310-83a0-f77becf3127e');
    };

    factory.login = function () {
      return $window.location.href='/api/v1/auth/auth';
      //return $window.location.href='http://bootlegger.tv/api/auth/login?apikey=' + apikey;
    };

    factory.logout = function () {
      return $http.get('/api/v1/auth/logout');
    };

    factory.isAuthenticated = function () {
      return $http.get('/api/v1/auth/session');
    };

    factory.profile = function () {
      return $http.get('/api/v1/auth/profile');
    }

    return factory;

  });
