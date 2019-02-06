fileItApp
		.controller(
				'SettingController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'$sessionStorage',
						'UserOperationsSvc',
						'$mdToast',
						'$route',
						'ACL',
						function($rootScope, $scope, $location,
								$sessionStorage, UserOperationsSvc, $mdToast,
								$route, ACL) {
							$scope.gotoDashboardPage = function() {
								$location.path('/dashboard');
							}
							if (ACL.role === 'RL001') {
								$scope.showPage = true;
							} else {
								$scope.showPage = false;
							}
							$scope.roleArray = [];
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
							$scope.adminitems = [];
							$scope.roleSelected = false;
							$scope.onChange = function(rolenew) {
								$scope.adminitems = [];
								console.log(rolenew);
								$scope.role = rolenew;
								var reqObj = {
									role : rolenew
								}
								UserOperationsSvc
										.getAccessList(reqObj)
										.then(
												function(result) {
													$scope.roleSelected = true;
													console.log(result.data);
													var keys = Object
															.keys(result.data);
													var createPresent = keys
															.includes("AC001");
													var viewPresent = keys
															.includes("AC002");
													var modifyPresent = keys
															.includes("AC003");
													var deletePresent = keys
															.includes("AC004");
													var dwdPresent = keys
															.includes("AC005");
													if (createPresent) {
														var obj = {
															"code" : "AC001",
															"name" : "Create",
															"selected" : true
														}
														$scope.adminitems
																.push(obj);
													} else {
														var obj = {
															"code" : "AC001",
															"name" : "Create",
															"selected" : false
														}
														$scope.adminitems
																.push(obj);
													}
													if (viewPresent) {
														var obj = {
															"code" : "AC002",
															"name" : "View",
															"selected" : true
														}
														$scope.adminitems
																.push(obj);
													} else {
														var obj = {
															"code" : "AC002",
															"name" : "View",
															"selected" : false
														}
														$scope.adminitems
																.push(obj);
													}
													if (modifyPresent) {
														var obj = {
															"code" : "AC003",
															"name" : "Modification",
															"selected" : true
														}
														$scope.adminitems
																.push(obj);
													} else {
														var obj = {
															"code" : "AC003",
															"name" : "Modification",
															"selected" : false
														}
														$scope.adminitems
																.push(obj);
													}
													if (deletePresent) {
														var obj = {
															"code" : "AC004",
															"name" : "Delete",
															"selected" : true
														}
														$scope.adminitems
																.push(obj);
													} else {
														var obj = {
															"code" : "AC004",
															"name" : "Delete",
															"selected" : false
														}
														$scope.adminitems
																.push(obj);
													}
													if (dwdPresent) {
														var obj = {
															"code" : "AC005",
															"name" : "Download",
															"selected" : true
														}
														$scope.adminitems
																.push(obj);
													} else {
														var obj = {
															"code" : "AC005",
															"name" : "Download",
															"selected" : false
														}
														$scope.adminitems
																.push(obj);
													}

												});
							}

							$scope.toggleAdmin = function(item) {
								for (var i = 0; i < $scope.adminitems.length; i++) {
									if ($scope.adminitems[i].name === item) {
										if ($scope.adminitems[i].selected === true) {
											$scope.adminitems[i].selected = false;
										} else {
											$scope.adminitems[i].selected = true;
										}
									}
								}
							};

							$scope.exists = function(item, list) {
								return list.indexOf(item) > -1;
							};

							$scope.onSettingsClicked = function() {
								$scope.accesslist = [];
								for (var j = 0; j < $scope.adminitems.length; j++) {
									if ($scope.adminitems[j].selected) {
										$scope.accesslist
												.push($scope.adminitems[j].code);
									}
								}
								var reqObj = {
									"role" : $scope.role,
									"accesslist" : $scope.accesslist
								}
								UserOperationsSvc
										.updateAccess(reqObj)
										.then(
												function(result) {
													if (result.data.Success !== undefined) {

														$mdToast
																.show($mdToast
																		.simple()
																		.textContent(
																				result.data.Success)
																		.position(
																				'bottom')
																		.theme(
																				'success-toast')
																		.hideDelay(
																				3000));
														$route.reload();

													} else {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.businessErrorData.description);
													}
												});
							}
						} ]);