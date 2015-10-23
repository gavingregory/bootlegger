angular.module('bootleggerApp')
  .factory('taskTemplateFactory', function ($http) {
    var factory = {};
    factory.getTemplates = function () {
      return $http.get('http://localhost:3000/api/v1/task-templates');
    };
    factory.getTemplate = function (id) {
      return $http.get('http://localhost:3000/api/v1/task-templates/' + id);
    };
    return factory;
  });
