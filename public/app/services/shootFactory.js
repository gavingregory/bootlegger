angular.module('bootleggerApp')
  .factory('shootFactory', function ($http, localStorage) {
    var factory = {};

    factory.getShoots = function () {
      return $http.get('http://dev.bootlegger.tv/api/profile/mine?apikey=' + localStorage.get('apikey'));
    };

    factory.getShoot = function (id) {
      return $http.get('http://dev.bootlegger.tv/api/media/shoot/' + id + '?apikey=' + localStorage.get('apikey'));
    };

    return factory;

  });
