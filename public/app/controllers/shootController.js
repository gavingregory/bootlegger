angular.module('bootleggerApp')
.controller('shootController', function ($scope, $log, shootFactory, taskTemplateFactory, taskFactory, localStorage, $routeParams) {
  $scope.sortBy = 'name';
  $scope.eventId = $routeParams.id;
  $scope.reverse = false;
  $scope.shoot = [];
  $scope.taskTemplates = [];
  $scope.tasks = [];
  $scope.loading = 3; // 3 http requests to load!
  $scope.totalLength = moment.duration();
  $scope.meta = 'No video selected';

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
        $scope.shoot.forEach(function (s) {
          var time = moment.duration(s.meta.static_meta.clip_length, "HH:MM:SS.SSSS");
          $scope.totalLength.add(time);
        });
      })
      .error(function (data, status, headers, config) {
        $log.log(data.error + ' ' + status);
      })
      .finally(function () {
        $scope.loading--;
      });
  };

  init();

  $scope.play = function (url, id) {
    var myVideo = document.getElementsByTagName('video')[0];
    myVideo.src = url;
    myVideo.load();
    myVideo.play();

    // find the correct shoot in the array
    for (var i=0; i < $scope.shoot.length; i++) {
      if ($scope.shoot[i].id === id) {
        $scope.meta = $scope.shoot[i];
        console.log('found at ' +i);
        break;
      }
    }
  };

  $scope.doSort = function (colName) {
    $scope.sortBy = colName;
    $scope.reverse = !$scope.reverse;
  };
});
