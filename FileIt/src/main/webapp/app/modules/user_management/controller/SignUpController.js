fileItApp
		.controller(
				'SignUpController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'$sessionStorage',
						'Idle',
						'AesEncoder',
						'$mdToast',
						'UserOperationsSvc',
						'LoginLoadingService',
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, AesEncoder, $mdToast,
								UserOperationsSvc, LoginLoadingService) {
							$scope.onSignUpClick = function() {
								if ($scope.pwdd === $scope.rpwd) {
									LoginLoadingService.showLoad();
									var loginObj = {
										firstName : $scope.fName,
										lastName : $scope.lName,
										userName : $scope.userName,
										password : $scope.pwdd,
										role : $scope.role
									};
									UserOperationsSvc
											.signup(loginObj)
											.then(
													function(result) {
														LoginLoadingService
																.hideLoad();
														if (result.data.signupSuccessMsg !== undefined) {
															$mdToast
																	.show($mdToast
																			.simple()
																			.textContent(
																					"Sign Up done successfully !! Please login to continue")
																			.position(
																					'bottom')
																			.theme(
																					'success-toast')
																			.hideDelay(
																					3000));
															$location
																	.path('/login');
														} else {

															$mdToast
																	.show($mdToast
																			.simple()
																			.textContent(
																					result.data.description)
																			.position(
																					'bottom')
																			.theme(
																					'error-toast')
																			.hideDelay(
																					3000));

														}
													});

								} else {
									$mdToast
											.show($mdToast
													.simple()
													.textContent(
															"Passwords don't match !!!")
													.position('bottom').theme(
															'error-toast')
													.hideDelay(3000));
								}
							}
						} ]);