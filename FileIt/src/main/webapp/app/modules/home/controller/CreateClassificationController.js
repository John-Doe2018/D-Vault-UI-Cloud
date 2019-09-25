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
						'DASHBOARD_DETALS',
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, HomeSvc, $route,
								$mdToast, ACL, DASHBOARD_DETALS) {
							if (DASHBOARD_DETALS.searchsave === '') {
								DASHBOARD_DETALS.searchsave = false;
							}
							$scope.minimizeModal = DASHBOARD_DETALS.searchsave;
							$scope.$on('minModal', function(event) {
								$scope.minimizeModal = true;
								DASHBOARD_DETALS.searchsave = true;
							});
							$scope.maximizemodal = function() {
								DASHBOARD_DETALS.searchsave = false;
								$scope.minimizeModal = false;
								$rootScope.$broadcast('maximizeModal');
							}

							$scope.closePopup = function() {
								DASHBOARD_DETALS.searchsave = false;
								$scope.minimizeModal = false;
							}
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