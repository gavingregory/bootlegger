angular.module('bootleggerApp', ['ngRoute', 'ngCookies']);

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
    .when('/loginSuccess', {
      controller:'loginSuccessController',
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
    .when('/orders/:customerId',{
        controller: 'ordersController',
        templateUrl: '/app/views/orders/list.html'
    })
    .otherwise({ redirectTo: '/' });
  });
