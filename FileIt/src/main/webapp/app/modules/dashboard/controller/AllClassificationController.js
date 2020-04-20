/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp.controller('AllClassificationController', [
		'$scope',
		'$location',
		'DASHBOARD_DETALS',
		'ACL',
		'$mdToast',
		'HomeSvc',
		function($scope, $location, DASHBOARD_DETALS, ACL, $mdToast, HomeSvc) {
			angular.element(document).ready(
					function() {
						$('#classHeight').height(
								$(window).height() - $('#pageHeader').height()
										- $('#footer').height());
					});
			$scope.initialize = function() {
				$scope.records = DASHBOARD_DETALS.classificationlist;
				$scope.count = $scope.records.length;
				$('#classHeight').height(
						$(window).height() - $('#pageHeader').height()
								- $('#footer').height());

			};

			$scope.initialize();

			$scope.shelfView = function(bookList) {
				DASHBOARD_DETALS.booklist = bookList;
				$location.path('/home');
			};

			$scope.createBooks = function(classification) {
				DASHBOARD_DETALS.classname = classification;
				$location.path('/createBook');
			};
		} ]);