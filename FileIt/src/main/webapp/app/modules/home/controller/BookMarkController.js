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
				$scope.records = DASHBOARD_DETALS.bookmarklist;
			};

			$scope.init();

		} ]);