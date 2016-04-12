angular.module('bootleggerApp')
  .factory('shootFactory', function ($http, localStorage) {
    var factory = {};

    // get a list of shoots
    factory.getShoots = function () {
      return $http.get('api/v1/shoots');
    };

    // get a single shoot
    factory.getShoot = function (id) {
      return $http.get('api/v1/shoots/' + id);
    };

    // get a list of templates
    factory.getTemplates = function () {
      return $http.get('api/v1/shoots/templates');
    }

    return factory;

  });
