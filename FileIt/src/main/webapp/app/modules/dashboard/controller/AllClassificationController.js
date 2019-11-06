/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp.controller('AllClassificationController', [
		'$scope',
		'$location',
		'DASHBOARD_DETALS',
		function($scope, $location, DASHBOARD_DETALS) {
			angular.element(document).ready(
					function() {
						$scope.hgt = $(window).height()
								- $('#pageHeader').height()
								- $('#footer').height();
						if ($scope.hgt < $('#classHeight').height()) {
							$scope.hgt = $('#classHeight').height();
						}
					});
			$scope.initialize = function() {
				$scope.records = DASHBOARD_DETALS.classificationlist;
				$scope.count = $scope.records.length;
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