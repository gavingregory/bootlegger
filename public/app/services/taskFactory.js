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
    };
    factory.deleteTask = function (shoot_id, task_id) {
      return $http.delete('api/v1/shoots/' + shoot_id + '/tasks/' + task_id);
    };
    factory.getResults = function (shoot_id, task_id, page) {
      return $http.get('api/v1/shoots/' + shoot_id + '/tasks/' + task_id + '/results/' + page);
    }
    // pushes a task to crowdflower
    factory.crowdsourceTask = function (shoot_id, task_id) {
      return $http.post('api/v1/shoots/' + shoot_id + '/tasks/' + task_id + '/crowdsource');
    };
    return factory;
  });
