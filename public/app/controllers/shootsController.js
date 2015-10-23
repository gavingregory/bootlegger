angular.module('bootleggerApp')
.controller('shootsController', function ($scope, $log, shootFactory, appSettings, $localstorage) {
  $scope.sortBy = 'name';
  $scope.reverse = false;
  $scope.shoots = [];
  $scope.appSettings = appSettings;

  function init() {
      shootFactory.getShoots()
        .success(function (shoots) {
          $scope.shoots = shoots;
        })
        .error(function (data, status, headers, config) {
          $log.log(data.error + ' ' + status);
        });
  };

  init();

  $scope.doSort = function (colName) {
    $scope.sortBy = colName;
    $scope.reverse = !$scope.reverse;
  };
});
