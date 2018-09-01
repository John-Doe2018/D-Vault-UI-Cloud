fileItApp
		.controller(
				'CreateClassificationController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'$sessionStorage',
						'Idle',
						'HomeSvc',
						'$route',
						'$mdToast',
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, HomeSvc, $route,
								$mdToast) {
							var newheight = $(window).height()
									- $('#pageHeader').height();
							$("#createClassPage").height(newheight);
							$scope.onCreateClassification = function() {
								if ($scope.classificationName === undefined) {
									$rootScope.$broadcast('error',
											"Blank Classification Name");
								} else {
									var reqObj = {
										'classificationName' : $scope.classificationName
									}
									HomeSvc
											.addClassification(reqObj)
											.then(
													function(result) {
														if (result.data.businessErrorData !== null) {
															$rootScope
																	.$broadcast(
																			'error',
																			result.data.businessErrorData.description);
														} else {

															$mdToast
																	.show($mdToast
																			.simple()
																			.textContent(
																					result.data.successMsg)
																			.position(
																					'bottom')
																			.theme(
																					'success-toast')
																			.hideDelay(
																					3000));
															$route.reload();
														}
													});
								}
							};
						} ]);