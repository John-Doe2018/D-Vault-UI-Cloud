/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp
		.controller(
				'DashboardController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'DASHBOARD_DETALS',
						'DashboardSvc',
						'LOGGED_USER',
						'$filter',
						'LandingOperationsSvc',
						'ACL',
						'HomeSvc',
						function($rootScope, $scope, $location,
								DASHBOARD_DETALS, DashboardSvc, LOGGED_USER,
								$filter, LandingOperationsSvc, ACL, HomeSvc) {
							if (DASHBOARD_DETALS.searchsave === '') {
								DASHBOARD_DETALS.searchsave = false;
							}
							$scope.minimizeModal = DASHBOARD_DETALS.searchsave;
							$scope.$on('minModal', function(event) {
								$scope.minimizeModal = true;
								DASHBOARD_DETALS.searchsave = true;
							});
							$scope.maximizemodal = function() {
								DASHBOARD_DETALS.searchsave = false;
								$scope.minimizeModal = false;
								$rootScope.$broadcast('maximizeModal');
							}

							$scope.closePopup = function() {
								DASHBOARD_DETALS.searchsave = false;
								$scope.minimizeModal = false;
							}

							$scope.$on('closePopUP', function(event) {
								$scope.closePopup();
							});
							var sortingOrder = 'no';
							$rootScope.$broadcast('closesidebar');

							$scope.gotoClassification = function() {
								$rootScope.$broadcast('closesidebar');
								$location.path('/classification');
							};

							$scope.gotoComments = function() {
								$rootScope.$broadcast('closesidebar');
								$location.path('/comments');
							};

							$scope.gotoUsers = function() {
								$rootScope.$broadcast('closesidebar');
								$location.path('/users');
							};

							$scope.gotoBooks = function() {
								$rootScope.$broadcast('closesidebar');
								$location.path('/books');
							};

							$scope.sortingOrder = sortingOrder;
							$scope.reverse = false;
							$scope.filteredItems = [];
							$scope.groupedItems = [];
							$scope.itemsPerPage = 5;
							$scope.pagedItems = [];
							$scope.currentPage = 0;

							DASHBOARD_DETALS.classname = '';
							$scope.items = [];
							$scope.colorArray = [];
							$scope.chartDATA = [];
							$rootScope.$broadcast('loginSuccess');
							var dynamicColors = function() {
								var r = Math.floor(Math.random() * 255);
								var g = Math.floor(Math.random() * 255);
								var b = Math.floor(Math.random() * 255);
								return "rgb(" + r + "," + g + "," + b + ")";
							};

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
								LandingOperationsSvc.getImage(reqObj1).then(
										function(result) {
											IMAGE_URLS.url = result.data;
											$location.path('/landingPage');
										});
							};

							$scope.activeUsers = 0;
							$scope.getActiveUsers = function() {
								DashboardSvc
										.getActiveUsers()
										.then(
												function(result) {
													if (result.data.errorMessage === undefined) {
														$scope.activeUsers = result.data;
													}

												});

							};

							$scope.getActiveUsers();

							$scope.commentListCount = 0;
							$scope.getAllComments = function() {
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									}
								}
								DashboardSvc
										.getAllComments(reqObj)
										.then(
												function(result) {
													if (result.data.errorMessage === undefined) {
														DASHBOARD_DETALS.commentlist = result.data.comments;
														$scope.commentListCount = DASHBOARD_DETALS.commentlist.length;
													}

												});

							};

							$scope.getNewComments = function() {
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									}
								}
								DashboardSvc
										.getNewComments(reqObj)
										.then(
												function(result) {
													if (result.data.errorMessage === undefined) {
														$scope.commentListCount = result.data.newCommentCount;
														$scope.getAllComments();
													}

												});

							};

							$scope.getNewComments();

							$scope.gotoAllDocs = function() {
								$location.path('/allDocs');
							}
							$scope.createBooks = function(classification) {
								$rootScope.$broadcast('closesidebar');
								DASHBOARD_DETALS.classname = classification;
								$location.path('/createBook');
							};

							var searchMatch = function(haystack, needle) {
								if (!needle) {
									return true;
								}
								return haystack.toLowerCase().indexOf(
										needle.toLowerCase()) !== -1;
							};

							// init the filtered items
							$scope.search = function() {
								$scope.filteredItems = $filter('filter')(
										$scope.items,
										function(item) {
											for ( var attr in item) {
												if (searchMatch(
														item['classification'],
														$scope.query))
													return true;
											}
											return false;
										});
								// take care of the sorting order
								if ($scope.sortingOrder !== '') {
									$scope.filteredItems = $filter('orderBy')
											($scope.filteredItems,
													$scope.sortingOrder,
													$scope.reverse);
								}
								$scope.currentPage = 0;
								// now group by pages
								$scope.groupToPages();
							};

							// calculate page in place
							$scope.groupToPages = function() {
								$scope.pagedItems = [];

								for (var i = 0; i < $scope.filteredItems.length; i++) {
									if (i % $scope.itemsPerPage === 0) {
										$scope.pagedItems[Math.floor(i
												/ $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
									} else {
										$scope.pagedItems[Math.floor(i
												/ $scope.itemsPerPage)]
												.push($scope.filteredItems[i]);
									}
								}
							};

							$scope.range = function(start, end) {
								var ret = [];
								if (!end) {
									end = start;
									start = 0;
								}
								for (var i = start; i < end; i++) {
									ret.push(i);
								}
								return ret;
							};

							$scope.prevPage = function() {
								if ($scope.currentPage > 0) {
									$scope.currentPage--;
								}
							};

							$scope.nextPage = function() {
								if ($scope.currentPage < $scope.pagedItems.length - 1) {
									$scope.currentPage++;
								}
							};

							$scope.setPage = function() {
								$scope.currentPage = this.n;
							};

							// functions have been describe process the data for
							// display

							// change sorting order
							$scope.sort_by = function(newSortingOrder) {
								if ($scope.sortingOrder == newSortingOrder)
									$scope.reverse = !$scope.reverse;

								$scope.sortingOrder = newSortingOrder;

								// icon setup
								$('th i').each(
										function() {
											// icon reset
											$(this).removeClass().addClass(
													'icon-sort');
										});
								if ($scope.reverse)
									$('th.' + new_sorting_order + ' i')
											.removeClass().addClass(
													'icon-chevron-up');
								else
									$('th.' + new_sorting_order + ' i')
											.removeClass().addClass(
													'icon-chevron-down');
							};

							$scope.getData = function() {
								Morris.Donut({
									element : 'bar-example',
									data : $scope.chartDATA
								});
								$scope.search();
							};
							$scope.getDashboard = function() {
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									}
								}
								DashboardSvc
										.classifiedData(reqObj)
										.then(
												function(result) {
													var keys = Object
															.keys(result.data);
													for (var i = 0; i < keys.length; i++) {
														if (keys[i] !== "BlankArray") {
															var recObj = {
																'no' : i + 1,
																'classification' : keys[i],
																'count' : result.data[keys[i]]
															};
															$scope.items
																	.push(recObj);
															$scope.colorArray
																	.push(dynamicColors());
															var dataObj = {
																	label : keys[i],
																	value : result.data[keys[i]]
															}
															$scope.chartDATA
																	.push(dataObj);
														}
													}
													$scope.getData();
												});
							};
							$scope.getDashboard();

							$scope.getClassification = function() {
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									}
								}
								$scope.classList = [];
								HomeSvc
										.getClassification(reqObj)
										.then(
												function(result) {
													if (result.data.description !== undefined) {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													} else {
														var keys = Object
																.keys(result.data);
														for (var i = 0; i < keys.length; i++) {
															var dataObj = {
																'no' : i + 1,
																'classification' : keys[i],
																'count' : result.data[keys[i]]
															}
															$scope.classList
																	.push(dataObj);

														}
														DASHBOARD_DETALS.classificationlist = $scope.classList;
														$scope.classCount = $scope.classList.length;
													}
												});

							};

							$scope.getClassification();

							$scope.getBooksList = function() {
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									}
								}
								DashboardSvc
										.getAllBooks(reqObj)
										.then(
												function(result) {
													console.log(result.data);
													$scope.docCount = result.data.length;
													DASHBOARD_DETALS.allbookslist = result.data;
												});
							};
							$scope.getBooksList();
							$scope.shelfView = function(bookList) {
								$rootScope.$broadcast('closesidebar');
								DASHBOARD_DETALS.booklist = bookList;
								$location.path('/home');
							};
						} ]);