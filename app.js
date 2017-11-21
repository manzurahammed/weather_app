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
	$routeProvider.when('/search/:id?',{
		templateUrl : "template/search.html",
		controller : "search"
	});
});

app.controller('home',function($scope,$http){
	var city = ['Istanbul', 'Berlin', 'London', 'Helsinki', 'Dublin', 'Vancouver'];
	$scope.loader = true;
	$scope.result = [];
	angular.forEach(city, function(value, key){
		var url = 'http://localhost/weather_app/weather.php?command=search&keyword='+value;
		$http.get(url)
		.then(function(response){
			if(response.status==200){
				$scope.result.push(response.data[0]);
				$scope.loader = false;
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
app.filter('cday', function() {
	return function(input) {
		if(input!=''){
			var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			var d = new Date(input);
			var dayName = days[d.getDay()];
			return dayName;
		}else{
		  return '----'
		}
	};
});
app.controller('detail',function($scope,$http,$routeParams){
	var wid = $routeParams.id;
	if(wid==''){
		$scope.message = 'Value Cant Empty';
		return false;
	}
	var display = {};
	var url = 'http://localhost/weather_app/weather.php?command=location&woeid='+wid;
	$scope.loader = true;
	$http.get(url)
	.then(function(response){
		if(response.status==200){
			display.consolidated_weather = response.data.consolidated_weather;
			display.parent = response.data.parent;
			$scope.display = display;
			$scope.loader = false;
		}
	}, function(response) {
		return false;
	});
});

app.controller('search',function($scope,$http,$routeParams,$window){
	var locat = $routeParams.id;
	if(locat==''){
		$scope.search='';
		$scope.result='';
	}else{
		var display = {};
		$scope.search=locat;
		$scope.display = '';
		var url = 'http://localhost/weather_app/weather.php?command=search&keyword='+locat;
		$scope.loader = true;
		$http.get(url)
		.then(function(response){
			if(response.status==200){
				var loacdata = response.data[0];
				if(typeof loacdata!='undefined'){
					var scurl = 'http://localhost/weather_app/weather.php?command=location&woeid='+loacdata.woeid;
					$http.get(scurl)
					.then(function(response){
						if(response.status==200){
							display.consolidated_weather = response.data.consolidated_weather;
							display.parent = response.data.parent;
							$scope.display = display;
							$scope.loader = false;
						}
					});
				}else{
					$scope.message = 'No Data Found';
				}
			}
		}, function(response) {
			return false;
		});
	}
	$scope.search_loct = function(){
		if($scope.search!=''){
			 $window.location.href = '#!search/'+$scope.search;
		}else{
			alert('KeyWord Can`t Empty');
		}
	}
});