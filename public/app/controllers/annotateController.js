angular.module('bootleggerApp')
.controller('annotateController', function ($window, $scope, $log, taskFactory, $routeParams) {

  $scope.task = {}
  $scope.crowdflowerId = '';

  taskFactory.getTask($routeParams.shoot_id, $routeParams.task_id)
  .success(function (task) {
    $scope.task = task;
    $scope.task.running = true;
  })
  .error(function (data, status, headers, config) {
    $log.log(data.error + ' ' + status);
  });

});
