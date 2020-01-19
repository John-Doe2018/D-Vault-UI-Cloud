/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp
		.controller(
				'LoginController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'UserOperationsSvc',
						'LoginLoadingService',
						'LOGGED_USER',
						'ACL',
						'$localStorage',
						'$http',
						function($rootScope, $scope, $location,
								UserOperationsSvc, LoginLoadingService,
								LOGGED_USER, ACL, $localStorage, $http) {

							function create_UUID() {
								var dt = new Date().getTime();
								var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
										.replace(
												/[xy]/g,
												function(c) {
													var r = (dt + Math.random() * 16) % 16 | 0;
													dt = Math.floor(dt / 16);
													return (c == 'x' ? r
															: (r & 0x3 | 0x8))
															.toString(16);
												});
								return uuid;
							}
							angular.element(document).ready(function() {
								if (LOGGED_USER.browser_refresh) {
									$route.reload();
								}
							});

							if ($localStorage.ip !== undefined) {
								LOGGED_USER.ip = $localStorage.ip;
							} else {
								LOGGED_USER.ip = create_UUID();
								$localStorage.ip = LOGGED_USER.ip;
							}

							$rootScope.$broadcast('LogoutSucess');
							(function($) {
								"use strict";

								/*
								 * ================================================================== [
								 * Focus input ]
								 */
								$('.input100').each(function() {
									$(this).on('blur', function() {
										if ($(this).val().trim() != "") {
											$(this).addClass('has-val');
										} else {
											$(this).removeClass('has-val');
										}
									})
								})

								/*
								 * ================================================================== [
								 * Validate ]
								 */
								var input = $('.validate-input .input100');

								$('.validate-form').on('submit', function() {
									var check = true;

									for (var i = 0; i < input.length; i++) {
										if (validate(input[i]) == false) {
											showValidate(input[i]);
											check = false;
										}
									}

									return check;
								});

								$('.validate-form .input100').each(function() {
									$(this).focus(function() {
										hideValidate(this);
									});
								});

								function validate(input) {
									if ($(input).attr('type') == 'email'
											|| $(input).attr('name') == 'email') {
										if ($(input)
												.val()
												.trim()
												.match(
														/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
											return false;
										}
									} else {
										if ($(input).val().trim() == '') {
											return false;
										}
									}
								}

								function showValidate(input) {
									var thisAlert = $(input).parent();

									$(thisAlert).addClass('alert-validate');
								}

								function hideValidate(input) {
									var thisAlert = $(input).parent();

									$(thisAlert).removeClass('alert-validate');
								}

								/*
								 * ================================================================== [
								 * Show pass ]
								 */
								var showPass = 0;
								$('.btn-show-pass').on(
										'click',
										function() {
											if (showPass == 0) {
												$(this).next('input').attr(
														'type', 'text');
												$(this).addClass('active');
												showPass = 1;
											} else {
												$(this).next('input').attr(
														'type', 'password');
												$(this).removeClass('active');
												showPass = 0;
											}

										});

							})(jQuery);

							$scope.onLoginClick = function() {
								LoginLoadingService.showLoad();
								var loginObj = {
									userName : $scope.uName,
									password : $scope.pwd
								};
								UserOperationsSvc
										.login(loginObj)
										.then(
												function(result) {
													LoginLoadingService
															.hideLoad();
													if (result.data.successMsg !== undefined) {
														ACL.group = result.data.customHeader.group;
														ACL.role = result.data.customHeader.role;
														ACL.username = result.data.customHeader.userName;
														$rootScope
																.$broadcast('loginSuccess');
														LOGGED_USER.name = $scope.uName;
														$location
																.path('/dashboard');
													} else {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													}
												});

							};

						} ]);