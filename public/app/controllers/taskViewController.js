angular.module('bootleggerApp')
.controller('taskViewController', function ($scope, $log, taskFactory, $stateParams, $uibModal) {

  $scope.loading = 1;
  $scope.shootId = $stateParams.shoot_id;
  $scope.task = {};
  $scope.cf = {};
  $scope.shoot_id = $stateParams.shoot_id;

  taskFactory.getTask($stateParams.shoot_id, $stateParams.task_id)
  .success(function (task) {
    $scope.task = task.data;
    $scope.cf = task.cf;
  })
  .error(function (data, status, headers, config) {
    $log.log(data.error + ' ' + status);
  })
  .finally(function () {
    $scope.loading--;
  });

});
