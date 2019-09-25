fileItApp
		.controller(
				'HomeController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'$sessionStorage',
						'Idle',
						'AesEncoder',
						'BINDER_NAME',
						'HomeSvc',
						'rfc4122',
						'$compile',
						'LoadingService',
						'$route',
						'FILEIT_CONFIG',
						'BINDER_SVC',
						'$http',
						'IMAGE_URLS',
						'LandingOperationsSvc',
						'$interval',
						'DASHBOARD_DETALS',
						'DashboardSvc',
						'LOGGED_USER',
						'$mdToast',
						'ACL',
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, AesEncoder, BINDER_NAME,
								HomeSvc, rfc4122, $compile, LoadingService,
								$route, FILEIT_CONFIG, BINDER_SVC, $http,
								IMAGE_URLS, LandingOperationsSvc, $interval,
								DASHBOARD_DETALS, DashboardSvc, LOGGED_USER,
								$mdToast, ACL) {
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
							$scope.validFile = true;
							$scope.fileList = [];
							$scope.curFile;
							$scope.ImageProperty = {
								id : rfc4122.newuuid(),
								name : "",
								path : "",
								type : "",
								version : "1.0 ",
								note : "NA"
							};
							$scope.convertImage = function() {
								if ($scope.gFiles && $scope.gFiles.length) {
									for (var i = 0; i < $scope.gFiles.length; i++) {
										var file = $scope.gFiles[i];
										if (!file.$error) {
											var fd = new FormData();
											fd.append('file', file);
											fd.append('filename', file.name);
											fd.append('bookName',
													$scope.bookName);
											fd.append('classification',
													DASHBOARD_DETALS.booklist);
											fd.append('path', $scope.bookName
													+ "/Images/");
											fd.append('type', file.type);
											$scope.progressvisible = true
											var xhr = new XMLHttpRequest()
											xhr.upload.onprogress = function(
													evt) {

												$scope
														.$apply(function() {
															if (evt.lengthComputable) {
																var progressPercentage = parseInt(100.0
																		* evt.loaded
																		/ evt.total);
																$scope.progress = progressPercentage
																		+ '% ';
															}

														})
											};
											xhr.addEventListener("load",
													uploadComplete, false)
											xhr.addEventListener("error",
													uploadFailed, false)
											xhr.addEventListener("abort",
													uploadCanceled, false)
											xhr
													.open(
															"POST",
															FILEIT_CONFIG.apiUrl
																	+ BINDER_SVC.convertImg)
											xhr.send(fd)

										}
									}
								}
							};

							function uploadComplete(evt) {
								$scope.resize();
							}

							function uploadFailed(evt) {
								alert("There was an error attempting to upload the file.")
							}

							function uploadCanceled(evt) {
								scope.$apply(function() {
									$scope.progressvisible = false
								})
								alert("The upload has been canceled by the user or the browser dropped the connection.")
							}
							$scope
									.$watch(
											'gFiles',
											function() {
												var files = $scope.gFiles;
												$scope.validFile = true;
												if ($scope.validFile) {
													for (var i = 0; i < files.length; i++) {
														var fileFound = false;
														for (var j = 0; j < $scope.fileList.length; j++) {
															if ($scope.fileList[j].name == files[i].name) {
																fileFound = true;
																break;
															}
														}
														if (!fileFound) {
															$scope.showSubmitButton = true;
															$scope.ImageProperty.name = files[i].name;
															$scope.ImageProperty.path = $scope.binderName
																	+ "/Images/";
															$scope.ImageProperty.type = files[i].type;

															$scope.fileList
																	.push($scope.ImageProperty);
															$scope.ImageProperty = {};
														} else {
															alert("Cannot upload same file twice !!");
														}
													}
													$scope.convertImage();
												}

											});

							$scope.noBookPresent = true;
							$scope.initialize = function() {
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									}
								}
								DashboardSvc
										.classifiedData(reqObj)
										.then(
												function(result) {
													var keys = Object
															.keys(result.data);
													for (var i = 0; i < keys.length; i++) {
														$scope.bookshelfcount = 0;
														if (keys[i] === DASHBOARD_DETALS.booklist) {
															if (result.data[keys[i]].length === 0) {
																$scope.noBookPresent = false;
															} else {
																$scope.noBookPresent = true;
																$scope.booklength = result.data[keys[i]].length;
																for (var j = 0; j < result.data[keys[i]].length; j++) {
																	$scope.bookshelfcount += 1;
																	$scope.h2name = result.data[keys[i]][j];
																	var text1;
																	if (j % 5 == 0) {
																		text1 = "<div class='book-tilted'><div class='book' id='"
																				+ $scope.h2name
																				+ "'><h2>"
																				+ $scope.h2name
																				+ "</h2></div></div>";
																	} else {
																		text1 = "<div class='book' id='"
																				+ $scope.h2name
																				+ "'><h2>"
																				+ $scope.h2name
																				+ "</h2></div>";
																	}
																	var id = '#'
																			+ $scope.h2name;
																	$(text1)
																			.appendTo(
																					".bookshelf");
																	var array = [
																			"book-green",
																			"book-blue",
																			"book-umber",
																			"book-springer" ];
																	var colorNumber = Math
																			.round((Math
																					.random() * (array.length - 1)));
																	$(id)
																			.addClass(
																					array[colorNumber]);

																	$(id)
																			.replaceWith(
																					$(id));
																	$(id)
																			.attr(
																					'ng-click',
																					"onBinderClick('"
																							+ $scope.h2name
																							+ "')");
																	$compile(
																			$(id))
																			(
																					$scope);
																}

															}
															if ($scope.bookshelfcount <= 60) {
																$('.bookshelf')
																		.css(
																				'height',
																				'534px');
															} else {
																$('.bookshelf')
																		.css(
																				'height',
																				'100%');
															}
															break;
														}
													}
												});

							};

							$rootScope.$broadcast('loginSuccess');
							$scope.initialize();
							$scope.openModal = function() {
								$('#createNew').modal('show');
							}

							$scope.onBinderClick = function(value) {
								BINDER_NAME.name = value;
								$scope.addFiles = false;
								$('#myModal').modal('show');
							};

							$scope.addTag = function() {
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									"book" : {
										"bookName" : BINDER_NAME.name,
										"classification" : DASHBOARD_DETALS.booklist
									},
									"action" : "Add"
								}
								HomeSvc
										.updateFav(reqObj)
										.then(
												function(result) {
													if (result.data.errorId !== undefined) {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													} else {
														$rootScope
																.$broadcast('getBM');
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
													}

												});
							}

							$('input[type=radio]').click(function() {
								$scope.optselect = $(this).val();
								$scope.fileList = [];
								if ($scope.optselect === 'landing') {
									$scope.addFiles = false;
								} else if ($scope.optselect === 'bookmark') {
									$scope.addFiles = false;
								} else if ($scope.optselect === 'delete') {
									$scope.addFiles = false;
								} else if ($scope.optselect === 'add') {
									$scope.addFiles = true;
								} else if ($scope.optselect === 'download') {
									$scope.addFiles = false;
								}

							});

							$scope.deletebook = function() {
								var deleteObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									bookName : BINDER_NAME.name,
									classificationName : DASHBOARD_DETALS.booklist
								}
								LandingOperationsSvc
										.deleteBook(deleteObj)
										.then(
												function(result) {
													if (result.data.errorId !== undefined) {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													} else {
														$mdToast
																.show($mdToast
																		.simple()
																		.textContent(
																				"Book Deleted Successfully !!!")
																		.position(
																				'bottom')
																		.theme(
																				'success-toast')
																		.hideDelay(
																				3000));
														if ($scope.booklength === 1) {
															$location
																	.path('/dashboard');
														} else {
															$route.reload();
														}

													}
												});
							};

							$scope.onAddFileClick = function() {
								var addFileObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									bookName : BINDER_NAME.name,
									oBookRequests : $scope.fileList
								};
								LandingOperationsSvc
										.addfile(addFileObj)
										.then(
												function(result) {
													if (result.data.errorId !== undefined) {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													}
												});

							};

							$scope.gotolandingPage = function() {
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

							$scope.onFileDownload = function() {
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									"bookName" : BINDER_NAME.name,
									'classificationname' : DASHBOARD_DETALS.booklist
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
														console
																.log(result.data.URL);
														var a = document
																.createElement("a");
														a.href = result.data.URL;
														fileName = result.data.URL
																.split("/")
																.pop();
														a.download = fileName;
														document.body
																.appendChild(a);
														a.click();
														window.URL
																.revokeObjectURL(result.data.URL);
														a.remove();
													}
												});

							}
							$scope.onOptionClick = function() {
								if ($scope.optselect === 'landing') {
									$scope.gotolandingPage();
								} else if ($scope.optselect === 'bookmark') {
									$scope.addFiles = false;
									$scope.addTag();
								} else if ($scope.optselect === 'delete') {
									$scope.deletebook();
								} else if ($scope.optselect === 'add') {
									$scope.onAddFileClick();
								} else if ($scope.optselect === 'download') {
									$scope.onFileDownload();
								}
							};

							$scope.deleteFile = function(index) {
								$scope.fileList.splice(index, 1);
								if ($scope.fileList.length < 1) {
									$scope.showSubmitButton = false;
								}
							}
							$scope.showSubmitButton = true;
							$scope.steps = [ 'Binder Name', 'Classification',
									'Upload' ];
							$scope.selection = $scope.steps[0];

							$scope.getCurrentStepIndex = function() {
								return $scope.steps.indexOf($scope.selection);
							};

							$scope.onBookNameChange = function(bookName) {
								if (bookName !== undefined
										&& ($scope.uploadFIleValue === undefined || $scope.uploadFIleValue === false)) {
									$scope.showSubmitButton = true;
								} else {
									$scope.showSubmitButton = false;
								}
							}

							$scope.onCancelClick = function() {
								$scope.fileCHoosed = undefined;
								$scope.fileCHoosedName = undefined;
								$scope.selection = $scope.steps[0];
								$scope.executionName = '';
								$scope.files = [];
								$scope.errorMessage = '';
								$scope.binderName = '';
								$scope.classification = '';
								$scope.fileList = [];
								$scope.uploadFIleValue = false;
								$scope.showSubmitButton = false;
								$scope.createVersionForm.$setValidity();
								$scope.createVersionForm.$setPristine();
								$scope.createVersionForm.$setUntouched();
							};

							$scope.goToStep = function(index) {
								if (($scope.steps[index]) !== undefined) {
									$scope.selection = $scope.steps[index];
								}
							};

							$scope.hasNextStep = function() {
								var stepIndex = $scope.getCurrentStepIndex();
								var nextStep = stepIndex + 1;
								return (($scope.steps[nextStep]) !== undefined);
							};

							$scope.hasPreviousStep = function() {
								var stepIndex = $scope.getCurrentStepIndex();
								var previousStep = stepIndex - 1;
								return (($scope.steps[previousStep]) !== undefined);
							};

							$scope.enableNext = function() {
								if ($scope.binderName == undefined
										|| ($scope.classification == undefined && $scope
												.getCurrentStepIndex() == 2)
										|| !$scope.uploadFIleValue) {
									return false;
								} else {
									return true;
								}

							}

							$scope.incrementStep = function() {
								if ($scope.uploadFIleValue) {
									if ($scope.hasNextStep()) {
										var stepIndex = $scope
												.getCurrentStepIndex();
										var nextStep = stepIndex + 1;
										$scope.selection = $scope.steps[nextStep];
									}
								}

							};

							$scope.showButton = function(uploadFIleValue) {
								if (uploadFIleValue === true) {
									$scope.showSubmitButton = false;
								} else {
									$scope.showSubmitButton = true;
								}
							};

							$scope.fileCHoosed = undefined;

							$scope.onSubmitClick = function() {
								$scope.createVersionForm.$setValidity();
								$scope.createVersionForm.$setPristine();
								$scope.createVersionForm.$setUntouched();
								if ($scope.selection === "Binder Name") {
									$scope.onAddBinder();
								} else {
									$scope.uploadFIle();
								}
							};

							$scope.onAddBinder = function() {

							};

							$scope.uploadFIle = function() {
								var reqObj = {
									"id" : rfc4122.newuuid(),
									"name" : $scope.binderName,
									"classification" : $scope.classification,
									"children" : $scope.fileList
								}
								var str = angular.toJson(reqObj).replace(
										'/"/g', '\"');
								var reqObj1 = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									"htmlContent" : str
								}
								var str1 = angular.toJson(reqObj1);
								var res = str1.replace("\\\\\\\\", "/")
										.replace("\\\\\\\\", "/");
								HomeSvc.createBinder(str1).then(
										function(result) {
											$route.reload();
										});
							};

							$scope.changehost = function(hostname) {
								$scope.hostName = hostname;
							};

							$scope.dropText = 'Drag file here ...'

							$scope.decrementStep = function() {
								if ($scope.hasPreviousStep()) {
									var stepIndex = $scope
											.getCurrentStepIndex();
									var previousStep = stepIndex - 1;
									$scope.selection = $scope.steps[previousStep];
								}
							};

							$scope.fileCHoosedName = undefined;
							// code here

						} ]);