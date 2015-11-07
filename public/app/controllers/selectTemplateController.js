angular.module('bootleggerApp')
.controller('selectTemplateController', function ($scope, $log, taskTemplateFactory, localStorage, $routeParams) {

  $scope.shootId = $routeParams.id;
  
  // templates array (filled in from factory below)
  $scope.templates = [];

  $scope.templateChanged = function (data) {
    selectedTemplate = data;
  }

  taskTemplateFactory.getTemplates()
    .success(function (data) {
      $scope.templates = data;
    })
    .error(function (data, status, headers, config) {
      $log.log(data.error + ' ' + status);
    });

  $scope.reset = function () {
    $scope.formData = angular.copy(initialTask);
  }

});
