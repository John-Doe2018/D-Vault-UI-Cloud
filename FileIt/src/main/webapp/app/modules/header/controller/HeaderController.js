fileItApp
		.controller(
				'HeaderController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'$sessionStorage',
						'LandingOperationsSvc',
						'BINDER_NAME',
						function($rootScope, $scope, $location,
								$sessionStorage, LandingOperationsSvc,
								BINDER_NAME) {

							$scope.backtoHome = function() {
								$location.path('/home');
							}

							$scope.onSearch = function() {
								LandingOperationsSvc
										.searchBook($scope.searchContent)
										.then(
												function(result) {
													console.log(result.data);
													BINDER_NAME.name = result.data.jsonObject[$scope.searchContent].Name;
													$location
															.path('/landingPage');
												});
							}
						} ]);