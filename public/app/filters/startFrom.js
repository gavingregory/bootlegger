// pagination example: http://jsfiddle.net/2ZzZB/56/

angular.module('bootleggerApp')
.filter('startFrom', function($filter) {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
})
