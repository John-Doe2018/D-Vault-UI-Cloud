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
							$scope.loginState = false;
							$scope.headerPath = "app/modules/header/views/header.html";
							$scope.footerPath = "app/modules/header/views/footer.html";
							// below field controls the currency position
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

							/**
							 * It is the common route change success call back.
							 * It will be triggered when the router changes
							 */
							$scope.$on('$routeChangeSuccess', function(next,
									current) {
								// $translate.use(OMNI_PROP.locale);
								// $scope.fitScreen();
							});

							/**
							 * Window resize call back. Call fitScreen() when
							 * window is resized.
							 */
							var windowObj = angular.element($window);
							windowObj.bind('resize', function() {
								// $scope.fitScreen();
							});

							/**
							 * This method sets height of ng-view area. To
							 * initiate fitScreen() method call after 100ms
							 * delay Reason: ng-view takes time to load the page
							 */
							$scope.fitScreen = function() {
								var fitScreenDelay = $interval(function() {
									$interval.cancel(fitScreenDelay);
									var windowHeight = $(window).height();
									var headerHeight = $('#pageHeader')
											.height();

									var footerHeight = $('#pageFooter')
											.height();

									var appPageContainer = windowHeight
											- headerHeight - footerHeight;

									$('.app-page-container').height(
											appPageContainer + 'px');
								}, 50);
								$rootScope.$broadcast('FitSideMenu');
							};

							// call fit screen when App loads for the first time
							// $scope.fitScreen();
							$scope.$on('FitScreen', function() {
								// $scope.fitScreen();
							});

							/**
							 * Successful login callback
							 */

							$scope.$on('OnLogOut', function() {
								RESOURCE_SVC.setResourceList([]);
								$scope.sideMenuPath = '';
								$scope.loginState = false;
							});

							$scope.$on('loginSuccess', function() {
								$scope.loginState = true;
							});

							$scope.$on('LogoutSucess', function() {
								$scope.headerPath = null;
								$scope.footerPath = null;
							});

							$scope.$on('fullWidth', function() {
								$scope.loginState = false;
							});

							$scope.$on('partialWidth', function() {
								$scope.loginState = true;
							});

							/**
							 * This is the common function can be used to
							 * convert the amount with standard format
							 */
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