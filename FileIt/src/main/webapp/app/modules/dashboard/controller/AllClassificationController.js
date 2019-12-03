/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp
		.controller(
				'AllClassificationController',
				[
						'$scope',
						'$location',
						'DASHBOARD_DETALS',
						'ACL',
						'$mdToast',
						'HomeSvc',
						function($scope, $location, DASHBOARD_DETALS, ACL,
								$mdToast, HomeSvc) {
							angular.element(document).ready(
									function() {
										$scope.hgt = $(window).height()
												- $('#pageHeader').height()
												- $('#footer').height();
										if ($scope.hgt < $('#classHeight')
												.height()) {
											$scope.hgt = $('#classHeight')
													.height();
										}
									});
							$scope.initialize = function() {
								$scope.records = DASHBOARD_DETALS.classificationlist;
								$scope.count = $scope.records.length;

								$scope.hgt = $(window).height()
										- $('#pageHeader').height()
										- $('#footer').height();
								if ($scope.hgt < $('#classHeight').height()) {
									$scope.hgt = $('#classHeight').height();
								}

							};

							$scope.initialize();

							$scope.shelfView = function(bookList) {

								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									'classification' : bookList
								}
								HomeSvc
										.getBookLists(reqObj)
										.then(
												function(result) {
													$scope.booklength = result.data.length;
													if ($scope.booklength === 0) {

														$mdToast
																.show($mdToast
																		.simple()
																		.textContent(
																				'No Book is  Present, Please create a book to proceed !!')
																		.position(
																				'bottom')
																		.theme(
																				'error-toast')
																		.hideDelay(
																				3000));

													} else {
														DASHBOARD_DETALS.booklist = bookList;
														$location.path('/home');
													}

												});

							};

							$scope.createBooks = function(classification) {
								DASHBOARD_DETALS.classname = classification;
								$location.path('/createBook');
							};
						} ]);
