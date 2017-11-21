var app = angular.module('weather',['ngRoute']);
app.config(function($routeProvider){
	$routeProvider.when('/',{
		templateUrl : "template/all.html",
		controller : "home"
	});
	$routeProvider.when('/kl/:id',{
		templateUrl : "template/details.html",
		controller : "detail"
	});
});
app.controller('home',function($scope,$http){
	var city = ['Istanbul', 'Berlin', 'London', 'Helsinki', 'Dublin', 'Vancouver'];
	$scope.result = [];
	angular.forEach(city, function(value, key){
		var url = 'http://localhost/weather.php?command=search&keyword='+value;
		$http.get(url)
		.then(function(response){
			if(response.status==200){
				$scope.result.push(response.data[0]);
			}
		}, function(response) {
			return false;
		});
	});
});
app.filter('tplace', function() {
  return function(input) {
    return parseFloat(input).toFixed(2);
  };
});
app.controller('detail',function($scope,$http,$routeParams){
	var wid = $routeParams.id;
	if(wid==''){
		$scope.message = 'Value Cant Empty';
		return false;
	}
	var display = {};
	var url = 'http://localhost/weather.php?command=location&woeid='+wid;
	$http.get(url)
	.then(function(response){
		if(response.status==200){
			display.consolidated_weather = response.data.consolidated_weather;
			display.parent = response.data.parent;
			$scope.display = display;
		}
	}, function(response) {
		return false;
	});
});