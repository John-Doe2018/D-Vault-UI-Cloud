/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp
		.controller(
				'SignUpController',
				[
						'$scope',
						'$location',
						'$mdToast',
						'UserOperationsSvc',
						'LoginLoadingService',
						'$route',
						function($scope, $location, $mdToast,
								UserOperationsSvc, LoginLoadingService, $route) {
							$scope.roleArray = [];
							$scope.groupArray = [];
							$scope.onCancelClick = function() {
								$location.path('/users');
							};
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
								if ($scope.fName !== undefined
										&& $scope.lName !== undefined
										&& $scope.userName !== undefined
										&& $scope.pwdd !== undefined
										&& $scope.rpwd !== undefined
										&& $scope.role !== undefined
										&& $scope.group !== undefined) {
									if ($scope.pwdd === $scope.rpwd) {
										LoginLoadingService.showLoad();
										var loginObj = {
											firstName : $scope.fName,
											lastName : $scope.lName,
											userName : $scope.userName,
											password : $scope.pwdd,
											role : $scope.role,
											group : $scope.group,
											status : "Active"
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
																$route.reload();
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
														.position('bottom')
														.theme('error-toast')
														.hideDelay(3000));
									}
								} else {
									$mdToast
											.show($mdToast
													.simple()
													.textContent(
															"Please provide all required fields !!")
													.position('bottom').theme(
															'error-toast')
													.hideDelay(3000));
								}

							}
						} ]);