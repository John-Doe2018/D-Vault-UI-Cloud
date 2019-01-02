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
						'ACL',
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, HomeSvc, $route,
								$mdToast, ACL) {
							var newheight = $(window).height()
									- $('#pageHeader').height();
							document.getElementById("createClassPage").style.height = newheight
									+ "px";
							$scope.onCreateClassification = function() {
								if ($scope.classificationName === undefined) {
									$rootScope.$broadcast('error',
											"Blank Classification Name");
								} else {
									var reqObj = {
										'customHeader' : {
											'userName' : ACL.username,
											'role' : ACL.role,
											'group' : ACL.group
										},
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