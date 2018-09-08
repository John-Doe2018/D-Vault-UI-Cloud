fileItApp.controller('BookMarkController', [
		'$rootScope',
		'$scope',
		'$location',
		'$sessionStorage',
		'Idle',
		'AesEncoder',
		'LandingOperationsSvc',
		'BINDER_NAME',
		'$route',
		'LoadingService',
		'$http',
		'FILEIT_CONFIG',
		'DASHBOARD_DETALS',
		function($rootScope, $scope, $location, $sessionStorage, Idle,
				AesEncoder, LandingOperationsSvc, BINDER_NAME, $route,
				LoadingService, $http, FILEIT_CONFIG, DASHBOARD_DETALS) {
			$scope.init = function() {
				$scope.count = DASHBOARD_DETALS.bookmarklist.length;
				$scope.records = DASHBOARD_DETALS.bookmarklist;
			};

			$scope.init();

			$scope.gotoBookView = function(bookName, className) {
				var reqObj1 = {
					"bookName" : bookName,
					"classification" : className
				}
				LandingOperationsSvc.getImage(reqObj1).then(function(result) {
					IMAGE_URLS.url = result.data;
					$location.path('/landingPage');
				});
			}

		} ]);