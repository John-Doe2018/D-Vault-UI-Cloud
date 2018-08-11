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
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, AesEncoder, BINDER_NAME,
								HomeSvc, rfc4122, $compile, LoadingService,
								$route, FILEIT_CONFIG, BINDER_SVC, $http,
								IMAGE_URLS, LandingOperationsSvc, $interval,
								DASHBOARD_DETALS, DashboardSvc) {
							function adceSearch() {
								$rootScope.$broadcast('advSaerch');
							}
							;
							$interval(adceSearch(), 1000);
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
							}

							$scope.convertImage = function(files) {
								var fd = new FormData();
								fd.append('file', files[0]);
								fd.append('filename', files[0].name);
								fd.append('bookName', BINDER_NAME.name);
								fd
										.append('path', BINDER_NAME.name
												+ "/Images/");
								fd.append('type', files[0].type);
								LoadingService.showLoad();
								$http
										.post(
												FILEIT_CONFIG.apiUrl
														+ BINDER_SVC.convertImg,
												fd,
												{
													transformRequest : angular.identity,
													headers : {
														'Content-Type' : undefined
													}
												}).then(function() {
											LoadingService.hideLoad();
										});
							}
							$scope.noBookPresent = true;
							$scope.initialize = function() {
								DashboardSvc
										.classifiedData()
										.then(
												function(result) {
													var keys = Object
															.keys(result.data);
													for (var i = 0; i < keys.length; i++) {
														if (keys[i] === DASHBOARD_DETALS.booklist) {
															if (result.data[keys[i]].length === 0) {
																$scope.noBookPresent = false;
															} else {
																$scope.noBookPresent = true;
																for (var j = 0; j < result.data[keys[i]].length; j++) {
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
														$route.reload();
													}
												});
							};

							$scope.setFile = function(element) {
								// get the files
								var files = element.files;
								$scope.validFile = true;
								var allowedFiles = [ ".pptx", ".docx", ".pdf" ];
								for (var i = 0; i < files.length; i++) {
									var regex = new RegExp(
											"([a-zA-Z0-9\s_\\.\-:])+("
													+ allowedFiles.join('|')
													+ ")$");
									if (regex.test(files[i].name.toLowerCase())) {
										$scope.validFile = true;
									} else {
										$scope.validFile = false;
									}
								}
								if ($scope.validFile) {
									for (var i = 0; i < files.length; i++) {
										$scope.convertImage(files);
										$scope.showSubmitButton = true;
										$scope.ImageProperty.name = files[i].name;
										$scope.ImageProperty.path = document
												.getElementById("file").value;
										$scope.ImageProperty.type = files[i].type;

										$scope.fileList
												.push($scope.ImageProperty);
										$scope.ImageProperty = {};
										$scope.$apply();

									}
								}
							};

							$scope.onAddFileClick = function() {
								var addFileObj = {
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
								var reqObj1 = {
									"bookName" : BINDER_NAME.name
								}
								LandingOperationsSvc.getImage(reqObj1).then(
										function(result) {
											IMAGE_URLS.url = result.data;
											$location.path('/landingPage');
										});
							};

							$scope.onFileDownload = function() {
								var reqObj = {
									"bookName" : BINDER_NAME.name
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