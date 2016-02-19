angular.module('bootleggerApp', ['ui.router', 'uiRouterStyles', 'ngCookies', 'ui.bootstrap', 'ngFileUpload', 'ngMessages']);

angular.module('bootleggerApp')
  .config(function ($stateProvider, $httpProvider, $urlRouterProvider) {
    $httpProvider.defaults.withCredentials = true; // required for cookies

    $stateProvider

    // Select states

    .state('select', {
      url: '/select',
      templateUrl: 'app/views/_select.html',
      controller : 'indexController',
      data: {
        css: 'css/select.css'
      }
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
      templateUrl: 'app/views/_dashboard.html',
      data: {
        css: 'css/dashboard.css'
      }
    })
    .state('dashboard.home', {
      url: '/home',
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
      templateUrl: 'app/views/dashboard/shoots/tasks/selectTemplate.html',
      data: {
        css: 'css/select.css'
      }
    })
    .state('dashboard.createtask-form', {
      url: '/shoots/:shoot_id/create-task/:template_id',
      controller: 'taskCreateController',
      templateUrl: 'app/views/dashboard/shoots/tasks/create.html'
    })
    $urlRouterProvider.otherwise('/select');


    // $routeProvider
    // .when('/',{
    //   controller: 'indexController',
    //   templateUrl: 'app/views/index/index.html'
    // })
    // .when('/login',{
    //   controller: 'loginController',
    //   template: '<div></div>'
    // })
    // .when('/shoots',{
    //   controller: 'shootsController',
    //   templateUrl: '/app/views/shoots/list.html'
    // })
    // .when('/shoots/:id',{
    //   controller: 'shootController',
    //   templateUrl: '/app/views/shoots/view.html'
    // })
    // .when('/shoots/:id/task/create', {
    //   controller: 'selectTemplateController',
    //   templateUrl: '/app/views/tasks/selectTemplate.html'
    // })
    // .when('/shoots/:shoot_id/task/create/:templateid', {
    //   controller: 'taskCreateController',
    //   templateUrl: '/app/views/tasks/create.html'
    // })
    // .when('/shoots/:shoot_id/task/:task_id', {
    //   controller: 'taskViewController',
    //   templateUrl: '/app/views/tasks/view.html'
    // })
    // .when('/shoots/:shoot_id/task/:task_id/annotate', {
    //   controller: 'annotateWelcomeController',
    //   templateUrl: '/app/views/annotate/welcome.html'
    // })
    // .when('/shoots/:shoot_id/task/:task_id/annotate/:crowdflower_id', {
    //   controller: 'annotateController',
    //   templateUrl: '/app/views/annotate/annotate.html'
    // })
    // .when('/orders/:customerId',{
    //     controller: 'ordersController',
    //     templateUrl: '/app/views/orders/list.html'
    // })
    // .otherwise({ redirectTo: '/' });
  });
