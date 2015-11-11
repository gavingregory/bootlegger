angular.module('bootleggerApp')
.controller('taskViewController', function ($scope, $log, taskFactory, $routeParams) {

  $scope.loading = 1;
  $scope.task = {};

  taskFactory.getTask($routeParams.shoot_id, $routeParams.task_id)
  .success(function (task) {
    $scope.task = task;
  })
  .error(function (data, status, headers, config) {
    $log.log(data.error + ' ' + status);
  })
  .finally(function () {
    $scope.loading--;
  });

});
