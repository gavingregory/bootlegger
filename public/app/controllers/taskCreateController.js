angular.module('bootleggerApp')
.controller('taskCreateController', function ($location, $scope, $log, taskTemplateFactory, taskFactory, localStorage, $routeParams, Upload, $timeout) {

  // the initial state, used for reset
  var initialTask = {
    job_count: 50,
    passes: 1,
    segment_size: 15,
    creator: localStorage.getObject('me').profile.displayName,
    shoot_id: $routeParams.id,
    template_id: $routeParams.templateid
  };

  // the form data
  $scope.formData = angular.copy(initialTask);

  // template (filled in from factory below)
  $scope.template = {};

  /*****************************
   * FILE UPLOAD
   **/
   $scope.uploadPic = function(file) {
     file.upload = Upload.upload({
       url: '/api/v1/tasks/',
       method: 'POST',
       data: $scope.formData,
       file: file
     });

     file.upload.then(function (response) {
       $timeout(function () {
         file.result = response.data;
       });
     }, function (response) {
       if (response.status > 0)
         $log.log(response.status + ': ' + response.data);
     }, function (evt) {
       // Math.min is to fix IE which reports 200% sometimes
       file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
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

  // reset form
  $scope.reset = function () {
    $scope.formData = angular.copy(initialTask);
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

  $scope.reset();


});
