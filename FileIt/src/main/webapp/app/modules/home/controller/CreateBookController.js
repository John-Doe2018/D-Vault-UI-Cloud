fileItApp
		.controller(
				'CreateBookController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'$sessionStorage',
						'Idle',
						'rfc4122',
						'HomeSvc',
						'LoadingService',
						'$http',
						'FILEIT_CONFIG',
						'BINDER_SVC',
						'$route',
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, rfc4122, HomeSvc,
								LoadingService, $http, FILEIT_CONFIG,
								BINDER_SVC, $route) {
							$rootScope.$broadcast('loginSuccess');
							$scope.fileList = [];
							$scope.ImageProperty = {
								id : rfc4122.newuuid(),
								name : "",
								path : "",
								type : "",
								version : "1.0 ",
								note : "NA"
							};

							$scope.deleteFile = function(index) {
								$scope.fileList.splice(index, 1);
								if ($scope.fileList.length < 1) {
									$scope.showSubmitButton = false;
								}
							};

							$scope.onSubmitClick = function() {

								var reqObj = {
									"id" : rfc4122.newuuid(),
									"name" : $scope.bookName,
									"classification" : $scope.classificationName,
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
								HomeSvc
										.createBinder(str1)
										.then(
												function(result) {
													if (result.data.description !== undefined) {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													} else {
														$route.reload();
													}
												});

							};
							$scope.convertImage = function(files) {
								var fd = new FormData();
								fd.append('file', files[0]);
								fd.append('filename', files[0].name);
								fd.append('bookName', $scope.bookName);
								fd.append('path', $scope.bookName + "/Images/");
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
										var fileFound = false;
										for (var j = 0; j < $scope.fileList.length; j++) {
											if ($scope.fileList[j].name == files[i].name) {
												fileFound = true;
											}
										}
										if (!fileFound) {
											$scope.convertImage(files);
											$scope.showSubmitButton = true;
											$scope.ImageProperty.name = files[i].name;
											$scope.ImageProperty.path = $scope.binderName
													+ "/Images/";
											$scope.ImageProperty.type = files[i].type;

											$scope.fileList
													.push($scope.ImageProperty);
											$scope.ImageProperty = {};
											$scope.$apply();
										}
									}
								}
								element.files = null;
							}

							function scroll_to_class(element_class,
									removed_height) {
								var scroll_to = $(element_class).offset().top
										- removed_height;
								if ($(window).scrollTop() != scroll_to) {
									$('html, body').stop().animate({
										scrollTop : scroll_to
									}, 0);
								}
							}

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
												 * Fullscreen background
												 */

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