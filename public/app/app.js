angular.module('bootleggerApp', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngFileUpload', 'ngMessages']);

angular.module('bootleggerApp')
  .config(function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true; // required for cookies
    $routeProvider
    .when('/',{
      controller: 'indexController',
      templateUrl: 'app/views/index/index.html'
    })
    .when('/login',{
      controller: 'loginController',
      template: '<div></div>'
    })
    .when('/shoots',{
      controller: 'shootsController',
      templateUrl: '/app/views/shoots/list.html'
    })
    .when('/shoots/:id',{
      controller: 'shootController',
      templateUrl: '/app/views/shoots/view.html'
    })
    .when('/shoots/:id/task/create', {
      controller: 'selectTemplateController',
      templateUrl: '/app/views/tasks/selectTemplate.html'
    })
    .when('/shoots/:shoot_id/task/create/:templateid', {
      controller: 'taskCreateController',
      templateUrl: '/app/views/tasks/create.html'
    })
    .when('/shoots/:shoot_id/task/:task_id', {
      controller: 'taskViewController',
      templateUrl: '/app/views/tasks/view.html'
    })
    .when('/orders/:customerId',{
        controller: 'ordersController',
        templateUrl: '/app/views/orders/list.html'
    })
    .otherwise({ redirectTo: '/' });
  });
