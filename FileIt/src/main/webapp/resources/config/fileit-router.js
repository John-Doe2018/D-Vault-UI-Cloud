/**
 * Router configuration
 */

fileItApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl : 'app/modules/user_management/views/login.html',
		controller : 'LoginController'
	}).when('/home', {
		templateUrl : 'app/modules/home/views/home.html',
		controller : 'HomeController'
	}).when('/landingPage', {
		templateUrl : 'app/modules/landing/views/landingpage.html',
		controller : 'LandingController'
	}).when('/dashboard', {
		templateUrl : 'app/modules/dashboard/views/dashboard.html',
		controller : 'DashboardController'
	}).otherwise({
		redirectTo : '/'
	});

} ]);