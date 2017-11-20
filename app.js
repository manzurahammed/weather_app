var app = angular.module('weather',['ngRoute']);
app.config(function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl : "template/all.html",
		controller : "home"
	});
});
app.controller('home',function($scope,$http){
	var city = ['Istanbul', 'Berlin', 'London', 'Helsinki', 'Dublin', 'Vancouver'];
	var result = [];
	angular.forEach(city, function(value, key){
		var url = 'http://localhost/weather.php?command=search&keyword='+value;
		var r = $http.get(url)
		.then(function(response){
			if(response.status==200){
				return response.data[0];
			}
		}, function(response) {
			return false;
		});
		console.log(r.$$state.status());
	},result);
	console.log(result);
	//$scope.result = result;
});