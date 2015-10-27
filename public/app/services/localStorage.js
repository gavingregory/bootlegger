angular.module('bootleggerApp')
  .factory('localStorage', function ($window) {
    var factory = {};
    factory.set = function(key, value) {
      $window.localStorage[key] = value;
    };
    factory.get = function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    };
    factory.setObject = function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    };
    factory.getObject = function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    };
    return factory;
  });
