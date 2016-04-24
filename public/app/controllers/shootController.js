angular.module('bootleggerApp')
.controller('shootController', function ($scope, $log, shootFactory, taskTemplateFactory, taskFactory, authFactory, localStorage, $stateParams) {

  // pagination
    $scope.currentPage = 0;
    $scope.pageSize = 18;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.shoot.length/$scope.pageSize);                
    }
  // end pagination

  $scope.sortBy = 'name';
  $scope.eventId = $stateParams.shoot_id;
  $scope.reverse = false;
  $scope.shoot = [];
  $scope.taskTemplates = [];
  $scope.tasks = [];
  $scope.loading = 3; // 3 http requests to load!
  $scope.totalLength = moment.duration();
  $scope.meta = 'No video selected';

  function init() {
    taskFactory.getTasks($stateParams.shoot_id)
      .success(function (tasks) {
        $scope.tasks = tasks;

        // get task status from Crowdflower
        authFactory.summary()
          .then(function (summary) {
            // for each task
            for (var i = 0; i < $scope.tasks.length; i++) {
              // initialise state to be 'cancelled'. It will remain as error at the end if there are no tasks that match this task.
              $scope.tasks[i].state = 'cancelled';
              $scope.tasks[i].state_progress = 0;
              // check each crowdflower task
              for (var j = 0; j < summary.data.length; j++) {
                if ($scope.tasks[i].cf_job_id === summary.data[j].id) {
                  $scope.tasks[i].state = summary.data[j].state; break;
                }
              }
              // create a tooltip for each type
              switch ($scope.tasks[i].state) {
                case 'cancelled':
                  $scope.tasks[i].state_tooltip = 'This job has been cancelled from Crowdflower. No data is available.';
                  break;
                case 'unordered':
                  $scope.tasks[i].state_tooltip = 'This job is currently waiting to be executed on Crowdflower.';
                  $scope.tasks[i].state_progress = 10;
                  break;
                case 'finished':
                  $scope.tasks[i].state_tooltip = 'This job has been successfully completed on Crowdflower.';
                  $scope.tasks[i].state_progress = 100;
                  break;
                case 'running':
                  $scope.tasks[i].state_tooltip = 'This job is currently in progress. Check back soon to see if has been completed!';
                  $scope.tasks[i].state_progress = 50;
                  break;
              }
            }
          })
          .catch(function (err) {
            console.log(err);
          });

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
    shootFactory.getShoot($stateParams.shoot_id)
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
