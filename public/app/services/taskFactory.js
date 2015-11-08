angular.module('bootleggerApp')
  .factory('taskFactory', function ($http) {
    var factory = {};
    factory.getTasks = function (shoot_id) {
      return $http.get('http://localhost:3000/api/v1/shoots/' + shoot_id + '/tasks');
    };
    factory.getTask = function (id) {
      return $http.get('http://localhost:3000/api/v1/tasks/' + id);
    };
    factory.createTask = function (task) {
      return $http.post('/api/v1/tasks/', task);
    }
    return factory;
  });
