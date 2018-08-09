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
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, HomeSvc, $route) {
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
														if (result.data.businessErrorData.description !== undefined) {
															$rootScope
																	.$broadcast(
																			'error',
																			result.data.businessErrorData.description);
														} else {
															$route.reload();
														}
													});
								}
							};
						} ]);