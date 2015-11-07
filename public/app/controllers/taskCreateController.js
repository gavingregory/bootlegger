angular.module('bootleggerApp')
.controller('taskCreateController', function ($scope, $log, taskTemplateFactory, taskFactory, localStorage, $routeParams, FileUploader) {

  // the initial state, used for reset
  var initialTask = {
    jobs: 50,
    passes: 1
  };

  // the form data
  $scope.formData = angular.copy(initialTask);

  // template (filled in from factory below)
  $scope.template = {};

  $scope.uploader = new FileUploader({
    url: '/api/v1/fileupload/', //TODO: change this url, or create it
    alias: 'refimage',
    removeAfterUpload: true
  });

  $scope.uploader.onBeforeUploadItem = (function (item) {
    //item.formData.push({title: $scope.formData.title });
  });

  $scope.templateChanged = function (data) {
    selectedTemplate = data;
  }

  taskTemplateFactory.getTemplate($routeParams.templateid)
    .success(function (data) {
      $scope.template = data;
    })
    .error(function (data, status, headers, config) {
      $log.log(data.error + ' ' + status);
    });

  $scope.reset = function () {
    $scope.formData = angular.copy(initialTask);
  }

  $scope.submit = function (task) {
    // upload the files in fileloader
    taskFactory.createTask(task)
      .success(function (data) {
        console.log(data);
      })
      .error(function (data, status, headers, config) {
        $log.log(data.error + ' ' + status);
      });
  };

  $scope.reset();


});
