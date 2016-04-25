angular.module('bootleggerApp')
.controller('taskViewController', function ($window, $scope, $log, taskFactory, $stateParams, $uibModal) {

  $scope.task = {};
  $scope.task.jobs = []; // init task and jobs before pagination attempts to use them, otherwise you'll get errors

  // pagination
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.task.jobs.length/$scope.pageSize);                
    }
  // end pagination

  $scope.loading = 1;
  $scope.shootId = $stateParams.shoot_id;
  $scope.cf = {};
  $scope.shoot_id = $stateParams.shoot_id;

  $scope.deleteTask = function (task_id) {

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
