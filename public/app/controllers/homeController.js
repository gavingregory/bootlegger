angular.module('bootleggerApp')
.controller('homeController', function ($scope, $log, authFactory, $cookies) {
  $scope.session = $cookies.get('sails.sid');
  function init() {
    authFactory.setApiKey();
  }
  init();

  authFactory.summary()
    .then(function (response) {
  		var summary = {
		  	tasks_running  : 0,
		  	tasks_unknown  : 0,
		  	tasks_finished : 0
  		};
    	for (var i = 0; i < response.data.length; i++) {
    		if (response.data[i].state === "finished") summary.tasks_finished++;
    		else if (response.data[i].state === "running") summary.tasks_running++;
    		else summary.tasks_unknown++;
    	}
    	$scope.summary = summary;
    })
    .catch(function (error) {
      console.log(error);
    });
});
