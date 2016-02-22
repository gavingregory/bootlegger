angular.module('bootleggerApp')
.controller('taskViewController', function ($scope, $log, taskFactory, $stateParams, $uibModal) {

  $scope.loading = 1;
  $scope.task = {};
  $scope.cf = {};
  $scope.shoot_id = $stateParams.shoot_id;

  taskFactory.getTask($stateParams.shoot_id, $stateParams.task_id)
  .success(function (task) {
    $scope.task = task.data;
    $scope.cf = JSON.parse(task.cf);
  })
  .error(function (data, status, headers, config) {
    $log.log(data.error + ' ' + status);
  })
  .finally(function () {
    $scope.loading--;
  });

  $scope.push = function () {
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'push.html',
      size: 'lg',
      resolve: {
        data: function () {
          return {
            task: $scope.task,
            shoot_id: $stateParams.shoot_id
          }
        }
      },
      controller: function ($scope, $uibModalInstance, data) {
        $scope.status = '';
        $scope.ok = function () {
          taskFactory.crowdsourceTask(data.shoot_id, data.task._id)
          .then(function (response) {
            $uibModalInstance.close();
          }, function (response) {
            $scope.status = 'failed';
          });
        };
        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

});
