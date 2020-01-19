/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp
		.controller(
				'CreateBookController',
				[
						'$rootScope',
						'$scope',
						'HomeSvc',
						'FILEIT_CONFIG',
						'BINDER_SVC',
						'$route',
						'DASHBOARD_DETALS',
						'$mdToast',
						'LandingOperationsSvc',
						'$mdDialog',
						'ACL',
						function($rootScope, $scope, HomeSvc, FILEIT_CONFIG,
								BINDER_SVC, $route, DASHBOARD_DETALS, $mdToast,
								LandingOperationsSvc, $mdDialog, ACL) {
							$scope.disableSubmitButton = false;
							$scope.hgt = $(window).height()
							- $('#pageHeader').height()- $('#pageFooter').height();
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
							$('form input').keydown(function(e) {
								if (e.keyCode == 13) {
									e.preventDefault();
									return false;
								}
							});
							$scope.convertImage = function() {
								if ($scope.gFiles && $scope.gFiles.length) {
									$scope.disableSubmitButton = true;
									for (var i = 0; i < $scope.gFiles.length; i++) {
										var file = $scope.gFiles[i];
										if (!file.$error) {
											var fd = new FormData();
											fd.append('file', file);
											fd.append('filename', file.name);
											fd.append('classification',
													$scope.classificationName);
											fd.append('bookName',
													$scope.bookName);
											fd.append('path', $scope.bookName
													+ "/Images/");
											fd.append('group', ACL.group);
											fd.append('type', file.type);
											$scope.progressvisible = true
											var xhr = new XMLHttpRequest();
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
									for(var le=0; le < $scope.fileList.length; le++){
										if($scope.fileList[le].fileName === evt.currentTarget.response.substring(evt.currentTarget.response.lastIndexOf('<') + 1, evt.currentTarget.response.lastIndexOf('>'))){
											$scope.fileList.pop();
											$scope.progress = 0;
											alert(evt.currentTarget.response.substring(evt.currentTarget.response.lastIndexOf('<') + 1, evt.currentTarget.response.lastIndexOf('>')) + " Already present !!");
										}
									}
								} else {
									$scope.disableSubmitButton = false;
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

							$scope.classfound = false;
							$scope.classlist = [];
							if (DASHBOARD_DETALS.classname !== '') {
								$scope.classfound = true;
								var dataObj = {
									'name' : DASHBOARD_DETALS.classname,
									'selected' : true
								}
								$scope.classlist.push(dataObj);
							} else {
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									}
								}
								HomeSvc
										.getClassification(reqObj)
										.then(
												function(result) {
													if (result.data.description !== undefined) {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													} else {
														var keys = Object
																.keys(result.data);
														for (var i = 0; i < keys.length; i++) {
															var dataObj = {
																'selected' : false,
																'name' : keys[i]
															}
															$scope.classlist
																	.push(dataObj);

														}
														
													}
												});
							}
							DASHBOARD_DETALS.classname = '';
							$rootScope.$broadcast('loginSuccess');
							$scope.fileList = [];
							$scope.ImageProperty = {
								fileName : "",
								type : ""
							};

							$scope.deleteFile = function(index, filename, ev) {
								$scope.deletedFiledName = filename;
								var confirm = $mdDialog.confirm().title(
										'Would you like to delete the file?')
										.ariaLabel('Lucky day').targetEvent(ev)
										.ok('Yes').cancel('No');

								$mdDialog
										.show(confirm)
										.then(
												function() {
													var requestObj = {
														'customHeader' : {
															'userName' : ACL.username,
															'role' : ACL.role,
															'group' : ACL.group
														},
														"book" : {
															"bookName" : $scope.bookName,
															"classification" : $scope.classificationName,
															"documents" : [ {
																"fileName" : $scope.deletedFiledName
															} ]
														}
													}
													LandingOperationsSvc
															.deleteFile(
																	requestObj)
															.then(
																	function(
																			result) {
																		if (result.data.successMessage !== undefined) {
																			$scope.fileList
																					.splice(
																							index,
																							1);
																			if($scope.fileList.length === 0){
																				$scope.progressvisible = false;
																			}
																		} else {
																			$rootScope
																					.$broadcast(
																							'error',
																							result.data.description);
																		}
																	});
												},
												function() {
													$scope.status = 'You decided to keep your debt.';
												});

							};

							$scope.onSubmitClick = function() {

								var reqObj = {
									"customHeader" : {
										"userName" : ACL.username,
										"role" : ACL.role,
										"group" : ACL.group
									},
									"book" : {
										"bookName" : $scope.bookName,
										"classification" : $scope.classificationName,
										"documents" : $scope.fileList
									}
								}

								HomeSvc
										.createBinder(reqObj)
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
																				'Book Created Successfully !!')
																		.position(
																				'bottom')
																		.theme(
																				'success-toast')
																		.hideDelay(
																				3000));
														$route.reload();
													}
												});

							};

							function bar_progress(progress_line_object,
									direction) {
								var number_of_steps = progress_line_object
										.data('number-of-steps');
								var now_value = progress_line_object
										.data('now-value');
								var new_value = 0;
								if (direction == 'right') {
									new_value = now_value
											+ (100 / number_of_steps);
								} else if (direction == 'left') {
									new_value = now_value
											- (100 / number_of_steps);
								}
								progress_line_object.attr('style',
										'width: ' + new_value + '%;').data(
										'now-value', new_value);
							}

							jQuery(document)
									.ready(
											function() {
												/*
												 * Form
												 */
												$('.f1 fieldset:first').fadeIn(
														'slow');

												$(
														'.f1 input[type="text"], .f1 input[type="password"], .f1 textarea')
														.on(
																'focus',
																function() {
																	$(this)
																			.removeClass(
																					'input-error');
																});

												// next step
												$('.f1 .btn-next')
														.on(
																'click',
																function() {
																	var parent_fieldset = $(
																			this)
																			.parents(
																					'fieldset');
																	var next_step = true;
																	// navigation
																	// steps /
																	// progress
																	// steps
																	var current_active_step = $(
																			this)
																			.parents(
																					'.f1')
																			.find(
																					'.f1-step.active');
																	var progress_line = $(
																			this)
																			.parents(
																					'.f1')
																			.find(
																					'.f1-progress-line');

																	// fields
																	// validation
																	parent_fieldset
																			.find(
																					'input[type="text"], input[type="password"], textarea')
																			.each(
																					function() {
																						if ($(
																								this)
																								.val() == "") {
																							$(
																									this)
																									.addClass(
																											'input-error');
																							next_step = false;
																						} else {
																							$(
																									this)
																									.removeClass(
																											'input-error');
																						}
																					});
																	// fields
																	// validation

																	if (next_step) {
																		parent_fieldset
																				.fadeOut(
																						400,
																						function() {
																							// change
																							// icons
																							current_active_step
																									.removeClass(
																											'active')
																									.addClass(
																											'activated')
																									.next()
																									.addClass(
																											'active');
																							// progress
																							// bar
																							bar_progress(
																									progress_line,
																									'right');
																							// show
																							// next
																							// step
																							$(
																									this)
																									.next()
																									.fadeIn();
																							// scroll
																							// window
																							// to
																							// beginning
																							// of
																							// the
																							// form
																							scroll_to_class(
																									$('.f1'),
																									20);
																						});
																	}

																});

												// previous step
												$('.f1 .btn-previous')
														.on(
																'click',
																function() {
																	// navigation
																	// steps /
																	// progress
																	// steps
																	var current_active_step = $(
																			this)
																			.parents(
																					'.f1')
																			.find(
																					'.f1-step.active');
																	var progress_line = $(
																			this)
																			.parents(
																					'.f1')
																			.find(
																					'.f1-progress-line');

																	$(this)
																			.parents(
																					'fieldset')
																			.fadeOut(
																					400,
																					function() {
																						// change
																						// icons
																						current_active_step
																								.removeClass(
																										'active')
																								.prev()
																								.removeClass(
																										'activated')
																								.addClass(
																										'active');
																						// progress
																						// bar
																						bar_progress(
																								progress_line,
																								'left');
																						// show
																						// previous
																						// step
																						$(
																								this)
																								.prev()
																								.fadeIn();
																						// scroll
																						// window
																						// to
																						// beginning
																						// of
																						// the
																						// form
																						scroll_to_class(
																								$('.f1'),
																								20);
																					});
																});

												// submit
												$('.f1')
														.on(
																'submit',
																function(e) {

																	// fields
																	// validation
																	$(this)
																			.find(
																					'input[type="text"], input[type="password"], textarea')
																			.each(
																					function() {
																						if ($(
																								this)
																								.val() == "") {
																							e
																									.preventDefault();
																							$(
																									this)
																									.addClass(
																											'input-error');
																						} else {
																							$(
																									this)
																									.removeClass(
																											'input-error');
																						}
																					});
																	// fields
																	// validation

																});
												
											});

						} ]);
