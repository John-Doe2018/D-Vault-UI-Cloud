/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp
		.controller(
				'AllUsersController',
				[
						'$scope',
						'DashboardSvc',
						'ACL',
						'$location',
						'UserOperationsSvc',
						'$mdToast',
						function($scope, DashboardSvc, ACL, $location,
								UserOperationsSvc, $mdToast) {
							$scope.dummypassword = "XXX";
							$scope.roleArray = [];
							$scope.groupArray = [];
							$scope.statusArray = [];
							$scope.getGroup = function() {
								UserOperationsSvc
										.getAllGroups()
										.then(
												function(result) {
													var keysgrp = Object
															.keys(result.data);
													for (var i = 0; i < keysgrp.length; i++) {
														$scope.selectGrp = false;
														if (result.data[keysgrp[i]] === $scope.group) {
															$scope.selectGrp = true;
														}
														var obj = {
															"code" : keysgrp[i],
															"name" : result.data[keysgrp[i]],
															"selected" : $scope.selectGrp
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
													var keys = Object
															.keys(result.data);
													for (var i = 0; i < keys.length; i++) {
														$scope.selectRole = false;
														if (result.data[keys[i]] === $scope.role) {
															$scope.selectRole = true;
														}
														var obj = {
															"code" : keys[i],
															"name" : result.data[keys[i]],
															"selected" : $scope.selectRole
														}
														$scope.roleArray
																.push(obj);
													}
												});
							};

							$scope.getStatus = function() {
								$scope.activeStatus = false;
								$scope.inactiveStatus = false;
								if ($scope.status === "Active") {
									$scope.activeStatus = true;
									$scope.inactiveStatus = false;
								} else {
									$scope.activeStatus = false;
									$scope.inactiveStatus = true;
								}
								var activeObj = {
									"value" : "Active",
									"selected" : $scope.activeStatus
								};
								$scope.statusArray.push(activeObj);

								var inactiveObj = {
									"value" : "InActive",
									"selected" : $scope.inactiveStatus
								};
								$scope.statusArray.push(inactiveObj);

							}
							$scope.updateUser = function(x) {
								$scope.roleArray = [];
								$scope.groupArray = [];
								$scope.statusArray = [];
								$scope.firstName = x.firstName;
								$scope.lastName = x.lastName;
								$scope.userName = x.userName;
								$scope.role = x.role;
								$scope.group = x.group;
								$scope.status = x.status;
								$scope.getRole();
								$scope.getGroup();
								$scope.getStatus();
								$('#updateUserModal').modal('show');
							}

							$scope.updateUserClicked = function() {
								var reqObj1 = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									"firstName" : $scope.firstName,
									"lastName" : $scope.lastName,
									"userName" : $scope.userName,
									"password" : $scope.dummypassword,
									"role" : $scope.role,
									"group" : $scope.group,
									"status" : $scope.status
								}

								UserOperationsSvc
										.updateUser(reqObj1)
										.then(
												function(result) {
													if (result.data.successMessage !== null
															|| result.data.successMessage !== undefined) {
														$mdToast
																.show($mdToast
																		.simple()
																		.textContent(
																				result.data.successMessage)
																		.position(
																				'bottom')
																		.theme(
																				'success-toast')
																		.hideDelay(
																				3000));
														$('#updateUserModal')
																.modal('hide');
														$scope.getAllUsers();
													} else {
														$mdToast
																.show($mdToast
																		.simple()
																		.textContent(
																				result.data.businessErrorData.description)
																		.position(
																				'bottom')
																		.theme(
																				'error-toast')
																		.hideDelay(
																				3000));

													}
												});
							};

							$scope.onAddUserClicked = function() {
								$location.path('/signup');
							}
							if (ACL.role === 'RL001') {
								$scope.showPage = true;
							} else {
								$scope.showPage = false;
							}
							$scope.resize = function() {
								var newheight = $(window).height()
										- $('#pageHeader').height()
										- $('#footer').height();
								$("#allUsersPage").height(newheight);
							};

							$scope.resize();
							$scope.getAllUsers = function() {
								$scope.users = [];
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									}
								}
								DashboardSvc
										.getAllUsers(reqObj)
										.then(
												function(result) {
													$scope.users = result.data.users.User;
												});
							};

							$scope.getAllUsers();

						} ]);