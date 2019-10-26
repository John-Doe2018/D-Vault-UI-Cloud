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
				var newheight = $(window).height() - $('#pageHeader').height()
						- $('#footer').height();
				$("#allClassPage").height(newheight);
			};
			$scope.resize();

			$scope.initialize = function() {
				$scope.records = DASHBOARD_DETALS.classificationlist;
				$scope.count = $scope.records.length;
			};

			$scope.initialize();

			$scope.searchTerm = "";
			$scope.numberToDisplay = 20;
			$scope.logEvents = [];
			for (var i = 0; i < 1000; i++) {
				$scope.logEvents.push({
					name : "Hello, my name is " + i
				});
			}

			$scope.loadMore = function() {
				if ($scope.numberToDisplay + 5 < $scope.logEvents.length) {
					$scope.numberToDisplay += 5;
				} else {
					$scope.numberToDisplay = $scope.logEvents.length;
				}
			};

			$scope.shelfView = function(bookList) {
				DASHBOARD_DETALS.booklist = bookList;
				$location.path('/home');
			};

			$scope.createBooks = function(classification) {
				DASHBOARD_DETALS.classname = classification;
				$location.path('/createBook');
			};
		} ]);