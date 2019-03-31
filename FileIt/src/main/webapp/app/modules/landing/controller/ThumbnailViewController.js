fileItApp
		.controller(
				'ThumbnailViewController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'$sessionStorage',
						'Idle',
						'ACL',
						'BINDER_NAME',
						'DASHBOARD_DETALS',
						'LandingOperationsSvc',
						'IMAGE_URLS',
						'$sce',
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, ACL, BINDER_NAME,
								DASHBOARD_DETALS, LandingOperationsSvc,
								IMAGE_URLS, $sce) {
							$scope.viewSwitch = 'BookView';
							$scope.onViewChange = function() {
								$scope.viewSwitch = 'BookView';
								$scope.range = [ 1, 2 ];
								var reqObj1 = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									"bookName" : BINDER_NAME.name,
									"classification" : DASHBOARD_DETALS.booklist,
									"rangeList" : $scope.range
								}
								LandingOperationsSvc.getImage(reqObj1).then(
										function(result) {
											IMAGE_URLS.url = result.data;
											$location.path('/landingPage');
										});

							};

							$scope.showPdf = function(name) {
								$scope.filelist = [];
								$scope.filelist.push(name);
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									"bookName" : BINDER_NAME.name,
									'classificationname' : DASHBOARD_DETALS.booklist,
									"fileName" : $scope.filelist
								}
								LandingOperationsSvc
										.downloadFile(reqObj)
										.then(
												function(result) {
													if (result.data.errorId !== undefined) {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													} else {
														$scope.content = $sce
																.trustAsResourceUrl(result.data.URL);
														$scope.pdf = {
															src : result.data.URL,
															data : null
														};
													}
												});

							};

							$scope.nodearray = [];
							$scope.getData = function() {
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									'bookname' : BINDER_NAME.name,
									'classificationname' : DASHBOARD_DETALS.booklist
								}
								LandingOperationsSvc
										.treeList(reqObj)
										.then(
												function(result) {
													if (result.data.errorId !== undefined) {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													} else {
														var resultObj = result.data;
														var a = resultObj.map.body.topicref.topic;
														if (angular.isArray(a)) {
															for (var x = 0; x < a.length; x++) {
																var nodeObj = {
																	'id' : a[x].id,
																	'title' : a[x].name,
																	'path' : a[x].path,
																	'firstIndex' : '',
																	'lastIndex' : ''
																}
																$scope.nodearray
																		.push(nodeObj);
															}
														} else {
															var nodeObj = {
																'id' : a.id,
																'title' : a.name,
																'path' : a.path,
																'firstIndex' : '',
																'lastIndex' : ''
															}
															$scope.nodearray
																	.push(nodeObj);
														}

														var nodeObjMaster = {
															'id' : resultObj.map.id,
															'title' : resultObj.map.body.topicref.navtitle,
															'nodes' : $scope.nodearray
														};
														$scope.data = [];
														$scope.data
																.push(nodeObjMaster);
														$scope.nodeslt = $scope.data[0].nodes;
														$scope.showPdf($scope.nodeslt[0].title);
													}
												});
							};

							$scope.getData();
						} ]);