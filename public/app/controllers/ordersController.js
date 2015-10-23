angular.module('bootleggerApp')
.controller('ordersController', function ($scope, $routeParams, customersFactory) {

  var customerId = $routeParams.customerId;
  $scope.customer = null;

  function init() {
      customersFactory.getCustomer(customerId)
        .success(function (customer) {
          $scope.customer = customer;
        })
        .error(function (data, status, headers, config) {
          // TODO: handle error
        });
  };

  init();

});
