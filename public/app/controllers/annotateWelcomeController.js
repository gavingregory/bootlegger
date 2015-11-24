angular.module('bootleggerApp')
.controller('annotateWelcomeController', function ($window, $scope, $log, taskFactory, $routeParams) {

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

  $scope.go = function () {
    //TODO: check crowdflowerId for length, etc
    if ($scope.crowdflowerId != '' || $scope.crowdflowerId != undefined)
      return $window.location.href='/shoots/' + $routeParams.shoot_id + '/task/' + $routeParams.task_id + '/annotate/' + $scope.crowdflowerId;
  }

});
