angular.module('bootleggerApp', ['ui.router', 'ngCookies', 'ui.bootstrap', 'ngFileUpload', 'ngMessages']);

angular.module('bootleggerApp')
  .config(function ($stateProvider, $httpProvider, $urlRouterProvider) {
    $httpProvider.defaults.withCredentials = true; // required for cookies

    $stateProvider

    // Select states

    .state('select', {
      url: '/select',
      templateUrl: 'app/views/_select.html',
      controller : 'indexController'
    })

    // Annotation states

    .state('annotate', {
      url: '/annotate',
      templateUrl: 'app/views/_annotate.html'
    })
    .state('annotate.home', {
      url: '/home',
      templateUrl: 'app/views/annotate/home.html',
      controller: 'annotateWelcomeController'
    })
    .state('annotate.job', {
      url: '/job/:shoot_id/task/:task_id',
      templateUrl: 'app/views/annotate/shoot/job.html',
      controller: 'annotateJobController'
    })

    // Dashboard states

    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'app/views/_dashboard.html'
    })
    .state('dashboard.home', {
      url: '/home',
      controller: 'homeController',
      templateUrl: 'app/views/dashboard/home.html'
    })
    .state('dashboard.login', {
      controller: 'loginController',
      template: '<div></div>'
    })
    .state('dashboard.shoots', {
      url: '/shoots',
      controller: 'shootsController',
      templateUrl: 'app/views/dashboard/shoots/list.html'
    })
    .state('dashboard.shoot', {
      url: '/shoots/:shoot_id',
      controller: 'shootController',
      templateUrl: 'app/views/dashboard/shoots/view.html'
    })
    .state('dashboard.tasks', {
      url: '/shoots/:shoot_id/tasks',
      templateUrl: 'app/views/dashboard/shoots/tasks/list.html'
    })
    .state('dashboard.task', {
      url: '/shoots/:shoot_id/tasks/:task_id',
      controller: 'taskViewController',
      templateUrl: 'app/views/dashboard/shoots/tasks/view.html'
    })
    .state('dashboard.createtask-template', {
      url: '/shoots/:shoot_id/create-task/template',
      controller: 'selectTemplateController',
      templateUrl: 'app/views/dashboard/shoots/tasks/selectTemplate.html'
    })
    .state('dashboard.createtask-addition', {
      url: '/shoots/:shoot_id/create-task-addition/',
      controller: 'additionTaskCreateController',
      templateUrl: 'app/views/dashboard/shoots/tasks/addition/create.html'
    })
    .state('dashboard.createtask-validation', {
      url: '/shoots/:shoot_id/create-task-validation/',
      controller: 'validationTaskCreateController',
      templateUrl: 'app/views/dashboard/shoots/tasks/validation/create.html'
    });

    $urlRouterProvider.otherwise('/dashboard/home');

  });
