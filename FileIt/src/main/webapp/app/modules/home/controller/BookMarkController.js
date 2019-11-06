/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp.controller('BookMarkController', [
		'$rootScope',
		'$scope',
		'$location',
		'LandingOperationsSvc',
		'$route',
		'DASHBOARD_DETALS',
		'ACL',
		'IMAGE_URLS',
		'HomeSvc',
		'$mdToast',
		'DashboardSvc',
		function($rootScope, $scope, $location, LandingOperationsSvc, $route,
				DASHBOARD_DETALS, ACL, IMAGE_URLS, HomeSvc, $mdToast,
				DashboardSvc) {
			jQuery(document).ready(
					function() {
						$scope.hgt = $(window).height()
								- $('#pageHeader').height()
								- $('#footer').height();
						if ($scope.hgt < $('#bookHeight').height()) {
							$scope.hgt = $('#bookHeight').height();
						}
					});

			$scope.init = function() {
				var reqObj = {
					'customHeader' : {
						'userName' : ACL.username,
						'role' : ACL.role,
						'group' : ACL.group
					}
				}
				DashboardSvc.getFav(reqObj).then(function(result) {
					if (result.data.errorMessage === undefined) {
						DASHBOARD_DETALS.bookmarklist = result.data.books;
						$scope.count = DASHBOARD_DETALS.bookmarklist.length;
						$scope.records = DASHBOARD_DETALS.bookmarklist;
					}
					$scope.resize();
				});
			};

			$scope.init();

			$scope.gotoBookView = function(bookName, className) {
				$scope.range = [ 1, 2 ];
				var reqObj1 = {
					'customHeader' : {
						'userName' : ACL.username,
						'role' : ACL.role,
						'group' : ACL.group
					},
					"bookName" : bookName,
					"classification" : className,
					"rangeList" : $scope.range
				}
				LandingOperationsSvc.getImage(reqObj1).then(function(result) {
					IMAGE_URLS.url = result.data;
					DASHBOARD_DETALS.backview = "/bookmarks";
					$location.path('/landingPage');
				});
			};

			$scope.remove = function(bookName, className) {
				var reqObj1 = {
					'customHeader' : {
						'userName' : ACL.username,
						'role' : ACL.role,
						'group' : ACL.group
					},
					"book" : {
						"bookName" : bookName,
						"classification" : className
					},
					"action" : "Remove"
				}
				HomeSvc.updateFav(reqObj1).then(
						function(result) {
							$rootScope.$broadcast('getBM');
							$mdToast.show($mdToast.simple().textContent(
									result.data.successMessage).position(
									'bottom').theme('success-toast').hideDelay(
									3000));
							$route.reload();
						});
			}

		} ]);