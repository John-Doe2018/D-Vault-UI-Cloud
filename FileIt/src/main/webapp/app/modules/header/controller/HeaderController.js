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
								var reqObj = {
									bookName : $scope.searchContent
								}
								LandingOperationsSvc
										.searchBook(reqObj)
										.then(
												function(result) {
													if (result.data.errorId !== undefined) {
														$scope.searchContent = '';
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													} else {
														BINDER_NAME.name = result.data.jsonObject[$scope.searchContent].Name;
														$scope.searchContent = '';
														$location
																.path('/landingPage');
													}
												});
							}
						} ]);