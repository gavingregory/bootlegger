angular.module('bootleggerApp')
.controller('taskResultsController', function ($scope, $log, taskFactory, $stateParams, $uibModal) {

  $scope.page = 1;

  $scope.nextPage = function () {
    $scope.page++;
    init($scope.page);
  };

  $scope.prevPage = function () {
    $scope.page--;
    init($scope.page);
  };

  var init = function (page) {
    $scope.parsedResults = [];
    $scope.results = {};

    // parse the result set and produce some useful information or something
    var parseResults = function () {
      
      // Crowdflower nicely return the results as key value pairs in an object, NOT an array
      // Sooooooooo ... we need to iterate over each key
      Object.keys($scope.results).forEach(function (key) {

        // create default object
        var o = {
          judgment_id: $scope.results[key].id,
          video_index: $scope.results[key].video_index,
          video_start: $scope.results[key].video_start,
          video_end: $scope.results[key].video_end,
          video_length: $scope.results[key].video_length
        };
        o.correct_template = 0;
        // find which was the CORRECT template. correct_template should be set to the template index after this loop
        for ( ; o.correct_template < 4; o.correct_template++) if ($scope.results[key]['template_' + o.correct_template + '_selected'] === true) break;

        // calculate statistics on correct answers
        o.total_answers = 0;
        o.correct_answers = 0;
        o.video_fault = 0;
        for (var j = 0; j < $scope.results[key].template.res.length; j++) {
          if ($scope.results[key].template.res[j] == o.correct_template) { o.correct_answers++; }
          if ($scope.results[key].template.res[j] == -2) { o.video_fault++; }
          o.total_answers++;
        }

        // push object to array
        $scope.parsedResults.push(o);

        // fill chart
        $scope.labels.push(o.judgment_id);
        $scope.data[0].push(o.correct_answers);
        $scope.data[1].push(o.total_answers - o.correct_answers);
        $scope.data[2].push(o.video_fault);
      });
    };

    $scope.loading = 2;
    $scope.task = {};
    $scope.cf = {};
    $scope.shoot_id = $stateParams.shoot_id;
    taskFactory.getTask($stateParams.shoot_id, $stateParams.task_id)
    .success(function (task) {
      $scope.task = task.data;
      $scope.cf = task.cf;

      taskFactory.getResults($stateParams.shoot_id, task.data.cf_job_id, $scope.page)
      .success(function (response) {
        $scope.results = response;
        parseResults();
      })
      .error(function (data, status, headers, config) {
        $log.log(data.error + ' ' + status);
      })
      .finally(function () {
        $scope.loading--;
      });

    })
    .error(function (data, status, headers, config) {
      $log.log(data.error + ' ' + status);
    })
    .finally(function () {
      $scope.loading--;
    });


    $scope.labels = [];

    $scope.series = ['Correct', 'Incorrect'];

    $scope.data = [[], [], []];

    $scope.colours = [{ 
            "fillColor": "rgba(112, 108, 224, 1)",
            "strokeColor": "rgba(112, 108, 224, 1)",
            "pointColor": "rgba(112, 108, 224, 1)",
            "pointStrokeColor": "#fff",
            "pointHighlightFill": "#fff",
            "pointHighlightStroke": "rgba(151,187,205,0.8)"
          },{ // default
            "fillColor": "rgba(224, 108, 112, 1)",
            "strokeColor": "rgba(207,100,103,1)",
            "pointColor": "rgba(220,220,220,1)",
            "pointStrokeColor": "#fff",
            "pointHighlightFill": "#fff",
            "pointHighlightStroke": "rgba(151,187,205,0.8)"
          },{ 
            "fillColor": "rgba(112, 224, 108, 1)",
            "strokeColor": "rgba(112, 224, 108, 1)",
            "pointColor": "rgba(112, 224, 108, 1)",
            "pointStrokeColor": "#fff",
            "pointHighlightFill": "#fff",
            "pointHighlightStroke": "rgba(151,187,205,0.8)"
          }
    ];
  };
  init();

});
