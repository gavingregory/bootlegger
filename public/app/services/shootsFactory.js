angular.module('bootleggerApp')
  .factory('shootsFactory', function ($http) {
    var factory = {};

    factory.getShoots = function () {
      return $http.get('http://localhost:1337/api/profile/mine?apikey=285a39f6-b8be-4b2b-93ec-22efa009f815');
    };
    factory.getShoot = function (id) {
      return $http.get('http://localhost:1337/api/media/shoot/' + id + '?apikey=285a39f6-b8be-4b2b-93ec-22efa009f815');
    };

    return factory;

  });
