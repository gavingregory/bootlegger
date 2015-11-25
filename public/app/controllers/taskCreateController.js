angular.module('bootleggerApp')
.controller('taskCreateController', function ($location, $scope, $log, taskTemplateFactory, taskFactory, shootFactory, localStorage, $stateParams, Upload, $timeout) {

  // the initial state, used for reset
  var initialTask = {
    job_count: 50,
    passes: 1,
    segment_size: 15,
    creator: localStorage.getObject('me').profile.displayName,
    shoot_id: $stateParams.shoot_id,
    template_id: $stateParams.template_id
  };

  // the form data
  $scope.formData = angular.copy(initialTask);
  // template (fetched from factory)
  $scope.template = {};
  // array of videos + meta data (fetched from factory)
  $scope.videos = {};
  // regex for meta field
  $scope.metaRegex = /[a-zA-Z\,]/;

  /*****************************
   * FILE UPLOAD
   **/
  $scope.submitForm = function(files) {
    $scope.formData.videos = $scope.videos;

    taskFactory.createTask($stateParams.shoot_id, $scope.formData)
      .success(function (data) {
        $log.log(data);
        files.upload = Upload.upload({
          url: '/api/v1/shoots/' + $stateParams.shoot_id + '/tasks/' + data.data._id + '/upload-image',
          method: 'POST',
          arrayKey: '',
          file: files
        }).then(function (resp) {
           window.location.replace('#/shoots/' + $stateParams.shoot_id + '/task/' + data.data._id);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
      })
      .error(function (data, status, headers, config) {
        $log.log(data.errors + ' ' + status);
      });
   }

  // load template
  taskTemplateFactory.getTemplate($stateParams.template_id)
    .success(function (data) {
      $scope.template = data;
      $scope.formData.meta_object = data.meta_object;
      $scope.formData.meta_key = data.meta_key;
    })
    .error(function (data, status, headers, config) {
      $log.log(data.errors + ' ' + status);
    });

  shootFactory.getShoot($stateParams.shoot_id)
    .success(function (data) {
      $scope.videos = data;
    })
    .error(function (data, status, headers, config) {
      $log.log(data.errors + ' ' + status);
    });

  // reset form
  $scope.reset = function () {
    $scope.formData = angular.copy(initialTask);
    if ($scope.taskForm)
      $scope.taskForm.$setPristine(true);
  }

  // submit form
  $scope.submit = function (task) {
    // upload the files in fileloader
    taskFactory.createTask(task)
      .success(function (data) {
        console.log(data);
      })
      .error(function (data, status, headers, config) {
        $log.log(data.errors + ' ' + status);
      });
  };

  // call reset to init formData
  $scope.reset();
});
