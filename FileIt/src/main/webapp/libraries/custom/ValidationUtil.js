/*******************************************************************************
 * "© Copyright 2014, Tata Consultancy Services Limited and its licensors. All
 * rights reserved."
 * 
 * TCS OmniStore Product
 * 
 * This software is the confidential and proprietary information of TCS
 * ("Confidential Information"). You shall not disclose such confidential
 * Information and shall use it only in accordance with the terms of the license
 * agreement you entered into with TCS.
 ******************************************************************************/

(function(r, e, s) {
	'use strict';

	var app = e.module('validationUtil', []);

	/**
	 * Validation For Exact Length. Allows exactLength number of character only.
	 */

	app
			.directive(
					'exactlength',
					function() {
						return {
							restrict : 'A',
							require : 'ngModel',
							scope : {
								exactlength : '='
							},
							link : function(scope, element, attrs, ctrl) {
								ctrl.$attributes = attrs;
								var regEx = new RegExp('^[\\S\\s]{'
										+ scope.exactlength + '}$');

								ctrl.$validators.exactlength = function(
										modelValue, viewValue) {
									var isValid = true;
									if (viewValue != undefined) {
										isValid = regEx.test(viewValue);
									}
									return isValid;
								}
							}
						}
					})

			/**
			 * Validation For Limit length.
			 */

			.directive('limitTo', function() {
				return {
					restrict : 'A',
					require : 'ngModel',
					link : function(scope, elem, attrs) {
						var limit = parseInt(attrs.limitTo);
						angular.element(elem).on("keypress", function() {
							if (this.value.length == limit)
								return false;
						});
					}
				}
			})

			/**
			 * Validation For Special Characters along with space. Allows
			 * alphanumeric characters only.
			 */

			.directive(
					'alphanumeric',
					function() {
						return {
							restrict : 'A',
							require : 'ngModel',
							link : function(scope, element, attrs, ctrl) {

								var regEx = new RegExp('^[a-zA-Z0-9]*$');

								ctrl.$validators.alphanumeric = function(
										modelValue, viewValue) {
									var isValid = true;
									if (viewValue != undefined) {
										isValid = regEx.test(viewValue);
									}
									return isValid;
								}
							}
						}
					})

			/**
			 * Validation For Special Characters. Allows alphanumeric characters
			 * with space only.
			 */
			.directive(
					'alphanumericws',
					function() {
						return {
							restrict : 'A',
							require : 'ngModel',
							link : function(scope, element, attrs, ctrl) {

								var regEx = new RegExp('^[a-zA-Z0-9\s ]*$');

								ctrl.$validators.alphanumericws = function(
										modelValue, viewValue) {
									var isValid = true;
									if (viewValue != undefined) {
										isValid = regEx.test(viewValue);
									}
									return isValid;
								}
							}
						}
					})

			/**
			 * Validation to allow only Alphabets.
			 */

			.directive(
					'alphabets',
					function() {
						return {
							restrict : 'A',
							require : 'ngModel',
							link : function(scope, element, attrs, ctrl) {

								var regEx = new RegExp('/^[a-zA-Z]$/');

								ctrl.$validators.alphabets = function(
										modelValue, viewValue) {
									var isValid = true;
									if (viewValue != undefined) {
										isValid = regEx.test(viewValue);
									}
									return isValid;
								}
							}
						}
					})

			/**
			 * Validation to allow only Alphabets with blank space only.
			 */

			.directive(
					'decimallength',
					function() {
						return {
							restrict : 'A',
							require : 'ngModel',
							scope : {
								decimallength : '='
							},
							link : function(scope, element, attrs, ctrl) {
								ctrl.$validators.decimallength = function(
										modelValue, viewValue) {
									var isValid = true;
									if (viewValue != undefined) {
										var spiltArray = String(viewValue)
												.split(".");
										if (spiltArray[0].length > scope.decimallength) {
											isValid = false;
										}
									}
									return isValid;
								}
							}
						}
					})

			/**
			 * Validation to allow only Alphabets with blank space only.
			 */

			.directive(
					'alphabetsws',
					function() {
						return {
							restrict : 'A',
							require : 'ngModel',
							link : function(scope, element, attrs, ctrl) {

								var regEx = new RegExp('/^[a-zA-Z\s]*$/');

								ctrl.$validators.alphabets = function(
										modelValue, viewValue) {
									var isValid = true;
									if (viewValue != undefined) {
										isValid = regEx.test(viewValue);
									}
									return isValid;
								}
							}
						}
					})

			/**
			 * Phone number validation
			 */

			.directive(
					'positivedecimal1',
					function() {
						return {
							restrict : 'A',
							require : 'ngModel',
							link : function(scope, element, attrs, ctrl) {

								var regEx = new RegExp(
										'^(?=.*[1-9])\\d*(?:\\.\\d{1,2})?$');

								ctrl.$validators.positivedecimal1 = function(
										modelValue, viewValue) {
									var isValid = false;
									if (viewValue != undefined) {
										if (viewValue == "0.0"
												|| viewValue == "0.00"
												|| viewValue == "0") {
											isValid = true;
										} else {
											isValid = regEx.test(viewValue);
										}
									}
									return isValid;
								}
							}
						}
					})

			.directive(
					'phoneNumber',
					function() {
						return {
							restrict : 'A',
							require : 'ngModel',
							link : function(scope, element, attrs, ctrl) {

								var regEx = new RegExp(
										'/^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/');

								ctrl.$validators.alphabets = function(
										modelValue, viewValue) {
									var isValid = true;
									if (viewValue != undefined) {
										isValid = regEx.test(viewValue);
									}
									return isValid;
								}
							}
						}
					})

			.directive(
					'positivedecimalOpt',
					function() {
						return {
							restrict : 'A',
							require : 'ngModel',
							link : function(scope, element, attrs, ctrl) {

								var regEx = new RegExp(
										'^(?=.*[1-9])\\d*(?:\\.\\d{1,2})?$');

								ctrl.$validators.positivedecimalOpt = function(
										modelValue, viewValue) {
									var isValid = true;
									if (viewValue != undefined) {
										isValid = regEx.test(viewValue);
									}
									return isValid;
								}
							}
						}
					})
			/**
			 * Validation For Special Characters along with space. Allows
			 * alphanumeric characters only.
			 */

			.directive(
					'positivedecimal',
					function() {
						return {
							restrict : 'A',
							require : 'ngModel',
							link : function(scope, element, attrs, ctrl) {

								// var regEx = new
								// RegExp('^[0-9]{1,100}(\.[0-9]{1,2})?$');
								var regEx = new RegExp(
										'^(?=.*[1-9])\\d*(?:\\.\\d{1,2})?$');

								ctrl.$validators.positivedecimal = function(
										modelValue, viewValue) {

									var isValid = false;

									if (viewValue != undefined) {
										isValid = regEx.test(viewValue);
									}

									if (isValid) {
										if (viewValue == 0.0
												|| viewValue == 0.00
												|| viewValue == 0) {
											isValid = true;
										}
									}

									return isValid;
								}
							}
						}
					})

			/**
			 * Validation For email-id
			 */

			.directive(
					'emailid',
					function() {
						return {
							restrict : 'A',
							require : 'ngModel',
							link : function(scope, element, attrs, ctrl) {

								/* alert(viewValue); */
								/* var regEx = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/); */
								/*
								 * var regEx = new RegExp(
								 * /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
								 */
								/*
								 * var regEx = new RegExp(
								 * /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ );
								 */
								var regEx = new RegExp(
										/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);

								ctrl.$validators.emailid = function(modelValue,
										viewValue) {
									var isValid = true;
									if (viewValue != undefined) {
										isValid = regEx.test(viewValue);
									}
									return isValid;
								}
							}
						}
					})

			/**
			 * Validation For Special Characters along with space. Allows
			 * alphanumeric characters only.
			 */

			.directive(
					'nonzerodecimal',
					function() {
						return {
							restrict : 'A',
							require : 'ngModel',
							link : function(scope, element, attrs, ctrl) {

								var regEx = new RegExp(
										'/^-?(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)$/');

								ctrl.$validators.positivedecimal = function(
										modelValue, viewValue) {
									var isValid = true;
									if (viewValue != undefined) {
										isValid = regEx.test(viewValue);
									}
									if (isValid) {
										if (viewValue == 0.0
												|| viewValue == 0.00
												|| viewValue == 0) {
											isValid = false;
										}
									}
									return isValid;
								}
							}
						}
					})
			/**
			 * Validation For combobox select optionh space. Allows alphanumeric
			 * characters only.
			 */

			.directive(
					'comborequired',
					function() {
						return {
							restrict : 'A',
							require : 'ngModel',
							link : function(scope, element, attrs, ctrl) {

								alert(viewValue);

								ctrl.$validators.comborequired = function(
										modelValue, viewValue) {
									var isValid = true;
									alert(viewValue);
									if (viewValue.val() === "") {
										isValid = false
										return;
									} else {
										isValid = true
									}
									return isValid;
								}
							}
						}
					})
			/**
			 * Validation For Positive Non-Zero Numbers. Allows only numeric
			 * digits greater than zero.
			 * ^(?!0*[.,]0*$|[.,]0*$|0*$)\d+[,.]?\d{0,2}$
			 */

			.directive(
					'positivenum',
					function() {
						return {
							restrict : 'A',
							require : 'ngModel',
							link : function(scope, element, attrs, ctrl) {

								var regEx = new RegExp('^[0-9]*[1-9][0-9]*$');

								ctrl.$validators.positivenum = function(
										modelValue, viewValue) {
									var isValid = true;
									if (viewValue != undefined) {
										isValid = regEx.test(viewValue);
									}
									return isValid;
								}
							}
						}
					});
})(window, window.angular);