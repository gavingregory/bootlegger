angular.module('bootleggerApp')
.controller('taskViewController', function ($window, $scope, $log, taskFactory, $stateParams, $uibModal) {

  $scope.loading = 1;
  $scope.shootId = $stateParams.shoot_id;
  $scope.task = {};
  $scope.cf = {};
  $scope.shoot_id = $stateParams.shoot_id;

  $scope.deleteTask = function (task_id) {
    //return $window.location.href='/shoots/' + $routeParams.shoot_id + '/task/' + $routeParams.task_id + '/annotate/' + $scope.crowdflowerId;
  
    taskFactory.deleteTask($scope.shoot_id, task_id)
    .success(function (data) {
      return $window.location.href='#/dashboard/shoots/' + $stateParams.shoot_id;
    })
    .error(function (data, status, headers, config) {
      console.log(data);
    })
  };

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
