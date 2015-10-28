angular.module('bootleggerApp')
.controller('taskCreateController', function ($scope, $log, taskTemplateFactory, taskFactory, localStorage, $routeParams) {
  var initialTask = {
    jobs: 50,
    passes: 1
  };

  $scope.templates = [];

  taskTemplateFactory.getTemplates()
    .success(function (data) {
      $scope.templates = data;
    })
    .error(function (data, status, headers, config) {
      $log.log(data.error + ' ' + status);
    });

  $scope.reset = function () {
    $scope.task = angular.copy(initialTask);
  }

  $scope.submit = function (task) {
    taskFactory.createTask(task)
      .success(function (data) {
        console.log(data);
      })
      .error(function (data, status, headers, config) {
        $log.log(data.error + ' ' + status);
      });
  };

  $scope.reset();

});
