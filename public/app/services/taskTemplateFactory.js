angular.module('bootleggerApp')
  .factory('taskTemplateFactory', function ($http) {
    var factory = {};
    factory.getTemplates = function () {
      return $http.get('api/v1/task-templates');
    };
    factory.getTemplate = function (id) {
      return $http.get('api/v1/task-templates/' + id);
    };
    return factory;
  });
