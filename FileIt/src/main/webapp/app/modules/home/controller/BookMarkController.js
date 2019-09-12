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
		'ACL',
		'IMAGE_URLS',
		function($rootScope, $scope, $location, $sessionStorage, Idle,
				AesEncoder, LandingOperationsSvc, BINDER_NAME, $route,
				LoadingService, $http, FILEIT_CONFIG, DASHBOARD_DETALS, ACL,
				IMAGE_URLS) {
			$scope.init = function() {
				$scope.count = DASHBOARD_DETALS.bookmarklist.length;
				$scope.records = DASHBOARD_DETALS.bookmarklist;
			};

			$scope.init();

			$scope.gotoBookView = function(bookName, className) {
				$scope.range = [ 1, 2 ];
				var reqObj1 = {
					'customHeader' : {
						'userName' : ACL.username,
						'role' : ACL.role,
						'group' : ACL.group
					},
					"bookName" : bookName,
					"classification" : className,
					"rangeList" : $scope.range
				}
				LandingOperationsSvc.getImage(reqObj1).then(function(result) {
					IMAGE_URLS.url = result.data;
					$location.path('/landingPage');
				});
			}

		} ]);