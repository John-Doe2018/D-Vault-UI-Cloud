/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp
		.controller(
				'MainController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'$window',
						'$translate',
						'$interval',
						'LoadingService',
						function($rootScope, $scope, $location, $window,
								$translate, $interval, LoadingService) {

							console.log = function() {
							};
							$scope.w3_close = function() {
								document.getElementById("mainPage").style.marginLeft = "0%";
								document.getElementById("mySidebar").style.display = "none";
							};
							$scope.goTOCreateBook = function() {
								$scope.w3_close();
								$location.path('/createBook');
							};

							$scope.miniMizeModal = function() {
								$('#searchModal').modal('hide');
								$rootScope.$broadcast('minModal');
							}

							$scope.$on('minModalAfterSerach', function(event) {
								$('#searchModal').modal('hide');
								$rootScope.$broadcast('minModal');
							});

							$scope.$on('closesidebar', function(event) {
								$scope.w3_close();
							});

							$scope.createClassification = function() {
								$scope.w3_close();
								$location.path('/createClassification');
							};

							LoadingService.showLoad();
							var locale;
							$translate.use("en");
							$scope.onnodeclick = function(node) {
								$rootScope.$broadcast('onNodeClick', node);
							}

							$scope.removeBook = function(bookname) {
								$rootScope.$broadcast('onRemoveBookClick',
										bookname);
							}
							$scope.$on('error', function(event, errorMsg) {
								$scope.errorMessage = errorMsg;
								$('#errorModal').modal('show');
							});
							$rootScope.$on('showConfirmModal', function() {

								$('#confirmationModal').modal('show');
							});

							$scope.yesClicked = function() {
								$scope.$broadcast('confirmAgreed');
							}
							$location.path('/login');
							$scope.headerPath = "app/modules/header/views/header.html";
							$scope.footerPath = "app/modules/header/views/footer.html";
							$scope.leftPlacing = true;

							$(document)
									.on(
											"keydown",
											function(e) {
												if (e.which === 8
														&& !$(e.target)
																.is(
																		"input:not([readonly]):not([type=radio]):not([type=checkbox]), textarea, [contentEditable], [contentEditable=true]")) {
													e.preventDefault();
												}
											});

							var windowObj = angular.element($window);
							windowObj.bind('resize', function() {
							});

							$scope.$on('loginSuccess', function() {
								$scope.loginState = true;
							});

							$scope.$on('LogoutSucess', function() {
								$scope.loginState = false;
							});

							$scope.parseFloat = function(amount) {
								amount = parseFloat(amount).toFixed(2);
								if (isNaN(amount)) {
									amount = 0.00;
								}
								return amount;
							};
						} ]);

fileItApp.directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if (event.which === 13) {
				scope.$apply(function() {
					scope.$eval(attrs.ngEnter);
				});

				event.preventDefault();
			}
		});
	};
});