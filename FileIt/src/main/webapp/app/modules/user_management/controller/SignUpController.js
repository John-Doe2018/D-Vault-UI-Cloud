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
						'ACL',
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, AesEncoder, $mdToast,
								UserOperationsSvc, LoginLoadingService, ACL) {
							$scope.roleArray = [];
							$scope.groupArray = [];
							$scope.getGroup = function() {
								UserOperationsSvc
										.getAllGroups()
										.then(
												function(result) {
													console.log(result.data);
													var keysgrp = Object
															.keys(result.data);
													for (var i = 0; i < keysgrp.length; i++) {
														var obj = {
															"code" : keysgrp[i],
															"name" : result.data[keysgrp[i]]
														}
														$scope.groupArray
																.push(obj);
													}
												});
							};
							$scope.getRole = function() {
								UserOperationsSvc
										.getAllRoles()
										.then(
												function(result) {
													console.log(result.data);
													var keys = Object
															.keys(result.data);
													for (var i = 0; i < keys.length; i++) {
														var obj = {
															"code" : keys[i],
															"name" : result.data[keys[i]]
														}
														$scope.roleArray
																.push(obj);
													}
												});
							};
							$scope.getRole();
							$scope.getGroup();
							$scope.onSignUpClick = function() {
								if ($scope.pwdd === $scope.rpwd) {
									LoginLoadingService.showLoad();
									var loginObj = {
										firstName : $scope.fName,
										lastName : $scope.lName,
										userName : $scope.userName,
										password : $scope.pwdd,
										role : $scope.role,
										group : $scope.group
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