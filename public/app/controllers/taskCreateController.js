angular.module('bootleggerApp')
.controller('taskCreateController', function ($location, $scope, $log, taskTemplateFactory, taskFactory, shootFactory, localStorage, $routeParams, Upload, $timeout) {

  // the initial state, used for reset
  var initialTask = {
    job_count: 50,
    passes: 1,
    segment_size: 15,
    creator: localStorage.getObject('me').profile.displayName,
    shoot_id: $routeParams.shoot_id,
    template_id: $routeParams.templateid
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

    var newfiles = {};
    for (var i = 0; i < files.length; i++) {
      newfiles[i + ', ' + files[i].name] = files[i];
    }

    files.upload = Upload.upload({
      url: '/api/v1/shoots/' + $routeParams.shoot_id + '/tasks/',
      method: 'POST',
      arrayKey: '',
      data: $scope.formData,
      file: files
    });

     files.upload.then(function (response) {
       $timeout(function () {
         files.result = response.data;
       });
     }, function (response) {
       if (response.status > 0)
         $log.log(response.status + ': ' + response.data);
     }, function (evt) {
       //
     });
   }

  // load template
  taskTemplateFactory.getTemplate($routeParams.templateid)
    .success(function (data) {
      $scope.template = data;
      $scope.formData.meta_object = data.meta_object;
      $scope.formData.meta_key = data.meta_key;
    })
    .error(function (data, status, headers, config) {
      $log.log(data.errors + ' ' + status);
    });

  shootFactory.getShoot($routeParams.shoot_id)
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
