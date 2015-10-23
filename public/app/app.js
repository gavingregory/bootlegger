angular.module('bootleggerApp', ['ngRoute', 'ngAnimate']);

angular.module('bootleggerApp')
  .config(function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true; // required for cookies
    $routeProvider
    .when('/shoots',
      {
        controller: 'shootsController',
        templateUrl: '/app/views/shoots/list.html'
      })
    .when('/shoots/:id',
      {
        controller: 'shootController',
        templateUrl: '/app/views/shoots/view.html'
      })
    .when('/orders/:customerId',
      {
        controller: 'ordersController',
        templateUrl: '/app/views/orders/list.html'
      })
    .otherwise({ redirectTo: '/shoots' });
  });
