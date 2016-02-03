angular.module('bootleggerApp')
  .factory('taskFactory', function ($http) {
    var factory = {};
    factory.getTasks = function (shoot_id) {
      return $http.get('http://localhost:3000/api/v1/shoots/' + shoot_id + '/tasks');
    };
    factory.getTask = function (shoot_id, task_id) {
      return $http.get('http://localhost:3000/api/v1/shoots/' + shoot_id + '/tasks/' + task_id);
    };
    factory.createTask = function (shoot_id, data) {
      return $http.post('http://localhost:3000/api/v1/shoots/' + shoot_id + '/tasks', data);
    }
    // pushes a task to crowdflower
    factory.pushTask = function (shoot_id, task_id) {
      $http.defaults.useXDomain = true;
      delete $http.defaults.headers.common['X-Requested-With'];
      var apiKey = 'vcHXAQLo4Q4LvMv4Ks8X';
      var data = {
        'job[title]': 't',
        'job[instructions]': 'instructions'
      };
      return $http.post('https://api.crowdflower.com/v1/jobs.json?key='+apiKey, data);
      return $http.post('http://localhost:3000/api/v1/shoots/' + shoot_id + '/tasks/' + task_id + '/crowdsource');
    }
    return factory;
  });
