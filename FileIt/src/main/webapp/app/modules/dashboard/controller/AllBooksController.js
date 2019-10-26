fileItApp.controller('AllBooksController', [
		'$rootScope',
		'$scope',
		'$location',
		'$sessionStorage',
		'Idle',
		'DASHBOARD_DETALS',
		'DashboardSvc',
		'$window',
		'IMAGE_URLS',
		'BINDER_NAME',
		'LandingOperationsSvc',
		'ACL',
		function($rootScope, $scope, $location, $sessionStorage, Idle,
				DASHBOARD_DETALS, DashboardSvc, $window, IMAGE_URLS,
				BINDER_NAME, LandingOperationsSvc, ACL) {
			$scope.resize = function() {
				var newheight = $(window).height() - $('#pageHeader').height()
						- $('#footer').height();
				$("#allBookPage").height(newheight);
			};

			$scope.resize();

			$scope.bookView = function(book) {
				BINDER_NAME.name = book.bookName;
				$scope.range = [ 1, 2 ];
				var reqObj1 = {
					'customHeader' : {
						'userName' : ACL.username,
						'role' : ACL.role,
						'group' : ACL.group
					},
					"bookName" : BINDER_NAME.name,
					"classification" : book.classification,
					"rangeList" : $scope.range
				}
				LandingOperationsSvc.getImage(reqObj1).then(function(result) {
					IMAGE_URLS.url = result.data;
					DASHBOARD_DETALS.backview = "/books";
					$location.path('/landingPage');
				});
			}
			$scope.searchTerm = "";
			$scope.numberToDisplay = 20;
			$scope.bookList = DASHBOARD_DETALS.allbookslist;
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
		} ]);