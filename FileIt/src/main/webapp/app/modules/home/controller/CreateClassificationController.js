fileItApp.controller('CreateClassificationController',
		[
				'$rootScope',
				'$scope',
				'$location',
				'$sessionStorage',
				'Idle',
				'rfc4122',
				'HomeSvc',
				'LoadingService',
				'$http',
				'FILEIT_CONFIG',
				'BINDER_SVC',
				'$route',
				'DASHBOARD_DETALS',
				function($rootScope, $scope, $location, $sessionStorage, Idle,
						rfc4122, HomeSvc, LoadingService, $http, FILEIT_CONFIG,
						BINDER_SVC, $route, DASHBOARD_DETALS) {
					var newheight = $(window).height()
							- $('#pageHeader').height();
					$("#createClassPage").height(newheight);
					$scope.onCreateClassification = function() {
						if ($scope.classificationName === undefined) {
							$rootScope.$broadcast('error',
									"Blank Classification Name");
						}
					};
				} ]);