angular.module('bootleggerApp')
.controller('shootsController', function ($scope, $log, shootFactory, localStorage) {
  $scope.sortBy = 'name';
  $scope.reverse = false;
  $scope.shoots = [];
  $scope.loading = true;

  function init() {
      shootFactory.getShoots()
        .success(function (shoots) {
          $scope.shoots = shoots;
        })
        .error(function (data, status, headers, config) {
          $log.log(data.error + ' ' + status);
        })
        .finally(function () {
          $scope.loading = false;
        });
  };

  init();

  $scope.doSort = function (colName) {
    $scope.sortBy = colName;
    $scope.reverse = !$scope.reverse;
  };
});
