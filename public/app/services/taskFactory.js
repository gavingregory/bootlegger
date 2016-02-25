angular.module('bootleggerApp')
  .factory('taskFactory', function ($http) {
    var factory = {};
    factory.getTasks = function (shoot_id) {
      return $http.get('api/v1/shoots/' + shoot_id + '/tasks');
    };
    factory.getTask = function (shoot_id, task_id) {
      return $http.get('api/v1/shoots/' + shoot_id + '/tasks/' + task_id);
    };
    factory.createTask = function (shoot_id, data) {
      return $http.post('api/v1/shoots/' + shoot_id + '/tasks', data);
    }
    // pushes a task to crowdflower
    factory.crowdsourceTask = function (shoot_id, task_id) {
      return $http.post('api/v1/shoots/' + shoot_id + '/tasks/' + task_id + '/crowdsource');
    }
    return factory;
  });
