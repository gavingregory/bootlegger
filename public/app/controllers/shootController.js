angular.module('bootleggerApp')
.controller('shootController', function ($scope, $log, shootFactory, taskTemplateFactory, taskFactory, localStorage, $routeParams) {
  $scope.sortBy = 'name';
  $scope.reverse = false;
  $scope.shoot = [];
  $scope.taskTemplates = [];
  $scope.tasks = [];
  $scope.loading = 3; // 3 http requests to load!

  function init() {
    taskFactory.getTasks($routeParams.id)
      .success(function (tasks) {
        $scope.tasks = tasks;
      })
      .error(function (data, status, headers, config) {
        $log.log(data.error + ' ' + status);
      })
      .finally(function () {
        $scope.loading--;
      });
    taskTemplateFactory.getTemplates()
      .success(function (templates) {
        $scope.taskTemplates = templates;
      })
      .error(function (data, status, headers, config) {
        $log.log(data.error + ' ' + status);
      })
      .finally(function () {
        $scope.loading--;
      });
    shootFactory.getShoot($routeParams.id)
      .success(function (shoot) {
        $scope.shoot = shoot;
      })
      .error(function (data, status, headers, config) {
        $log.log(data.error + ' ' + status);
      })
      .finally(function () {
        $scope.loading--;
      });
  };

  init();

  $scope.play = function (url) {
    var myVideo = document.getElementsByTagName('video')[0];
    myVideo.src = url;
    myVideo.load();
    myVideo.play();
    console.log('something');
    // var video = document.getElementById('video');
    // video.setAttribute('src', url);
    // video.load();
    // video.play();
  };

  $scope.doSort = function (colName) {
    $scope.sortBy = colName;
    $scope.reverse = !$scope.reverse;
  };
});
