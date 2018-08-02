fileItApp
		.controller(
				'LoginController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'$sessionStorage',
						'Idle',
						'AesEncoder',
						'UserOperationsSvc',
						'LoginLoadingService',
						'LoadingService',
						'LOGGED_USER',
						'DashboardSvc',
						'DASHBOARD_DETALS',
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, AesEncoder,
								UserOperationsSvc, LoginLoadingService,
								LoadingService, LOGGED_USER, DashboardSvc,
								DASHBOARD_DETALS) {

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

							}
						} ]);