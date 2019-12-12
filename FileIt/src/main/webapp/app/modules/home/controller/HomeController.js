/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp
		.controller(
				'HomeController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'BINDER_NAME',
						'HomeSvc',
						'rfc4122',
						'$compile',
						'$route',
						'FILEIT_CONFIG',
						'BINDER_SVC',
						'IMAGE_URLS',
						'LandingOperationsSvc',
						'DASHBOARD_DETALS',
						'$mdToast',
						'ACL',
						function($rootScope, $scope, $location, BINDER_NAME,
								HomeSvc, rfc4122, $compile, $route,
								FILEIT_CONFIG, BINDER_SVC, IMAGE_URLS,
								LandingOperationsSvc, DASHBOARD_DETALS,
								$mdToast, ACL) {
							$scope.errorCase = false;
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

							$scope.$on('closePopUP', function(event) {
								$scope.closePopup();
							});
							$scope.validFile = true;
							$scope.fileList = [];
							$scope.curFile;
							$scope.ImageProperty = {
								fileName : "",
								type : ""
							};
							$scope.convertImage = function() {
								if ($scope.gFiles && $scope.gFiles.length) {
									for (var i = 0; i < $scope.gFiles.length; i++) {
										var file = $scope.gFiles[i];
										if (!file.$error) {
											var fd = new FormData();
											fd.append('file', file);
											fd.append('filename', file.name);
											fd.append('classification',
													DASHBOARD_DETALS.booklist);
											fd.append('bookName',
													BINDER_NAME.name);
											fd.append('group', ACL.group);
											fd.append('path', BINDER_NAME.name
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
																	+ BINDER_SVC.convertImg);
											xhr.setRequestHeader("UserName",
													ACL.username);
											xhr.send(fd)

										}
									}
								}
							};

							function uploadComplete(evt) {
								if(evt.currentTarget.response.includes("Error")){
									alert(evt.currentTarget.response)
									for(var le=0; le < $scope.fileList.length; le++){
										if($scope.fileList[le].fileName === evt.currentTarget.response.substring(evt.currentTarget.response.lastIndexOf('<') + 1, evt.currentTarget.response.lastIndexOf('>'))){
											$scope.fileList.pop();
										}
									}
								}
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
												var filesize = (($scope.gFiles[0].size/1024)/1024).toFixed(4);
												if(filesize > 5 ){
													$scope.validFile = false;
												}
												if ($scope.validFile) {
													for (var i = 0; i < files.length; i++) {
														var fileFound = false;
														for (var j = 0; j < $scope.fileList.length; j++) {
															if ($scope.fileList[j].fileName == files[i].name) {
																fileFound = true;
																break;
															}
														}
														if (!fileFound) {
															$scope.showSubmitButton = true;
															$scope.ImageProperty.fileName = files[i].name;
															$scope.ImageProperty.type = files[i].type;
															$scope.fileList
																	.push($scope.ImageProperty);
															$scope.ImageProperty = {};
														} else {
															alert("Cannot upload same file twice !!");
														}
													}
													$scope.convertImage();
												} else {
													alert("File size exceeds 5MB !!");
												}

											});

							$scope.noBookPresent = true;
							$scope.initialize = function() {
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									'classification' : DASHBOARD_DETALS.booklist
								}
								HomeSvc
										.getBookLists(reqObj)
										.then(
												function(result) {
													$scope.booklength = result.data.length;
													if ($scope.booklength === 0) {
														$scope.noBookPresent = false;
													} else {
														for (var i = 0; i < $scope.booklength; i++) {
															$scope.h2name = result.data[i];
															var text1;
															if (i % 5 == 0) {
																text1 = "<div class='book-tilted'><div class='book' id='"
																		+ (i+1)
																		+ "'><h2>"
																		+ $scope.h2name
																		+ "</h2></div></div>";
															} else {
																text1 = "<div class='book' id='"
																		+ (i+1)
																		+ "'><h2>"
																		+ $scope.h2name
																		+ "</h2></div>";
															}
															var id = '#'
																	+ (i+1);
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

															$(id).replaceWith(
																	$(id));
															$(id)
																	.attr(
																			'ng-click',
																			"onBinderClick('"
																					+ $scope.h2name
																					+ "')");
															$compile($(id))(
																	$scope);
														}

															$('.bookshelf')
																	.css(
																			'height',
																			$(window).height()
																			- $('#pageHeader').height()- $('#pageFooter').height());
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
								$scope.errorCase = false;
								$scope.optselect = undefined;
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
													if (result.data.successMessage !== null) {

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

													} else {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.businessErrorData.description);
													}

												});
							}

							$('input[type=radio]').click(function() {
								$scope.optselect = $(this).val();
								$scope.fileList = [];
								if ($scope.optselect === 'landing') {
								} else if ($scope.optselect === 'bookmark') {
								} else if ($scope.optselect === 'delete') {
								} else if ($scope.optselect === 'add') {
									$('#myModal').modal('hide');
									$('input[type=radio]').attr("checked",
											false);
									$('#addFileModal').modal('show');
								} else if ($scope.optselect === 'download') {
								}

							});

							$scope.deletebook = function() {
								var deleteObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									"book" : {
										"bookName" : BINDER_NAME.name,
										"classification" : DASHBOARD_DETALS.booklist
									}
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
									"book" : {
										"bookName" : BINDER_NAME.name,
										"classification" : DASHBOARD_DETALS.booklist,
										"documents" : $scope.fileList
									}
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
													} else {
														$scope.optselect = undefined;
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
								LandingOperationsSvc
										.getImage(reqObj1)
										.then(
												function(result) {
													DASHBOARD_DETALS.backview = "/home";
													IMAGE_URLS.url = result.data;
													$location
															.path('/landingPage');
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
									'classification' : DASHBOARD_DETALS.booklist
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
								if ($scope.optselect === undefined) {
									$scope.errorCase = true;
								} else {
									$scope.errorCase = false;
									$('input[type=radio]').attr("checked",
											false);
									if ($scope.optselect === 'landing') {
										$scope.optselect === undefined;
										$('#myModal').modal('hide');
										$scope.gotolandingPage();
									} else if ($scope.optselect === 'bookmark') {
										$scope.optselect === undefined;
										$('#myModal').modal('hide');
										$scope.addTag();
									} else if ($scope.optselect === 'delete') {
										$scope.optselect === undefined;
										$('#myModal').modal('hide');
										$scope.deletebook();
									} else if ($scope.optselect === 'add') {
										$scope.optselect === undefined;
										$scope.onAddFileClick();
									} else if ($scope.optselect === 'download') {
										$scope.optselect === undefined;
										$('#myModal').modal('hide');
										$scope.onFileDownload();
									}
								}
							};
							
							$scope.closeModal = function() {
								$('#myModal').modal('hide');
								$('input[type=radio]').attr("checked",
										false);
							}

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