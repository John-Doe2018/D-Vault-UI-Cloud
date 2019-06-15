fileItApp.controller('AllClassificationController', [
		'$rootScope',
		'$scope',
		'$location',
		'$sessionStorage',
		'Idle',
		'DASHBOARD_DETALS',
		'DashboardSvc',
		function($rootScope, $scope, $location, $sessionStorage, Idle,
				DASHBOARD_DETALS, DashboardSvc) {
			$scope.resize = function() {
				var newheight = $(window).height() - $('#pageHeader').height() - $('#footer').height();
				$("#allClassPage").height(newheight);
			};

			$scope.resize();
			$scope.initialize = function() {
				$scope.records = DASHBOARD_DETALS.classificationlist;
				$scope.count = $scope.records.length;
			};

			$scope.initialize();

			$scope.shelfView = function(bookList) {
				DASHBOARD_DETALS.booklist = bookList;
				$location.path('/home');
			};

			$scope.createBooks = function(classification) {
				DASHBOARD_DETALS.classname = classification;
				$location.path('/createBook');
			};
		} ]);