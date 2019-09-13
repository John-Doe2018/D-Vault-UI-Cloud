/**
 * Router configuration
 */

fileItApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl : 'app/modules/user_management/views/login.html',
		controller : 'LoginController'
	}).when('/signup', {
		templateUrl : 'app/modules/user_management/views/signup.html',
		controller : 'SignUpController'
	}).when('/settings', {
		templateUrl : 'app/modules/header/views/settings.html',
		controller : 'SettingController'
	}).when('/home', {
		templateUrl : 'app/modules/home/views/home.html',
		controller : 'HomeController'
	}).when('/landingPage', {
		templateUrl : 'app/modules/landing/views/landingpage.html',
		controller : 'LandingController'
	}).when('/thumbnailView', {
		templateUrl : 'app/modules/landing/views/thumbnailview.html',
		controller : 'ThumbnailViewController'
	}).when('/dashboard', {
		templateUrl : 'app/modules/dashboard/views/dashboard.html',
		controller : 'DashboardController'
	}).when('/createBook', {
		templateUrl : 'app/modules/home/views/createBook.html',
		controller : 'CreateBookController'
	}).when('/profile', {
		templateUrl : 'app/modules/home/views/profile.html',
		controller : 'ProfileController'
	}).when('/docView', {
		templateUrl : 'app/modules/landing/views/docView.html',
		controller : 'DocViewController'
	}).when('/allDocs', {
		templateUrl : 'app/modules/dashboard/views/alldocs.html',
		controller : 'AllDocsController'
	}).when('/createClassification', {
		templateUrl : 'app/modules/home/views/createClassification.html',
		controller : 'CreateClassificationController'
	}).when('/bookmarks', {
		templateUrl : 'app/modules/home/views/bookmarks.html',
		controller : 'BookMarkController'
	}).when('/classification', {
		templateUrl : 'app/modules/dashboard/views/allClassification.html',
		controller : 'AllClassificationController'
	}).when('/comments', {
		templateUrl : 'app/modules/dashboard/views/allcomments.html',
		controller : 'AllCommentsController'
	}).when('/users', {
		templateUrl : 'app/modules/dashboard/views/allusers.html',
		controller : 'AllUsersController'
	}).otherwise({
		redirectTo : '/'
	});
} ]);