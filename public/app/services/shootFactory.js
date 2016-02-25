angular.module('bootleggerApp')
  .factory('shootFactory', function ($http, localStorage) {
    var factory = {};

    factory.getShoots = function () {
      return $http.get('api/v1/shoots');
    };

    factory.getShoot = function (id) {
      return $http.get('api/v1/shoots/' + id);
    };

    return factory;

  });
