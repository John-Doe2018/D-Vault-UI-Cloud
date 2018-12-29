fileItApp
		.controller(
				'DashboardController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'$sessionStorage',
						'Idle',
						'DASHBOARD_DETALS',
						'DashboardSvc',
						'LOGGED_USER',
						'$filter',
						'LandingOperationsSvc',
						'ACL',
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, DASHBOARD_DETALS,
								DashboardSvc, LOGGED_USER, $filter,
								LandingOperationsSvc, ACL) {
							var sortingOrder = 'classification';
							$rootScope.$broadcast('closesidebar');
							$scope.onViewBookmark = function() {
								$rootScope.$broadcast('closesidebar');
								$location.path('/bookmarks');
							};

							$scope.gotoClassification = function() {
								$rootScope.$broadcast('closesidebar');
								$location.path('/classification');
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
							$scope.labels = [];
							$scope.data = [];
							$rootScope.$broadcast('loginSuccess');
							var dynamicColors = function() {
								var r = Math.floor(Math.random() * 255);
								var g = Math.floor(Math.random() * 255);
								var b = Math.floor(Math.random() * 255);
								return "rgb(" + r + "," + g + "," + b + ")";
							};
							$scope.bookmarkList = [];

							$scope.gotoBookView = function(bookName, className) {
								$scope.range = [ 1, 2 ];
								var reqObj1 = {
									"bookName" : bookName,
									"classification" : className,
									"rangeList" : $scope.range
								}
								LandingOperationsSvc.getImage(reqObj1).then(
										function(result) {
											IMAGE_URLS.url = result.data;
											$location.path('/landingPage');
										});
							}

							$scope.getBookMarks = function() {
								var reqObj = {
									'userName' : LOGGED_USER.name,
									'bookName' : "",
									'classificationName' : ""
								}
								DashboardSvc
										.getbookmark(reqObj)
										.then(
												function(result) {
													if (result.data.errorMessage === null) {
														DASHBOARD_DETALS.bookmarklist = result.data.bookmarkDetailsList;
														var length = 0;
														if (DASHBOARD_DETALS.bookmarklist.length < 5) {
															length = DASHBOARD_DETALS.bookmarklist.length;
														} else {
															length = 5;
														}
														for (var k = 0; k < length; k++) {
															$scope.bookmarkList
																	.push(DASHBOARD_DETALS.bookmarklist[k]);
														}
													}

												});

							};
							$scope.getBookMarks();

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
								new Chart(
										document.getElementById("chart-area"),
										{
											type : 'doughnut',
											data : {
												labels : $scope.labels,
												datasets : [ {
													label : "Documents",
													backgroundColor : $scope.colorArray,
													data : $scope.data
												} ]
											},
											options : {
												title : {
													display : true,
													text : 'Active Documents'
												},
												segmentShowStroke : true,
												segmentStrokeColor : "#fff",
												segmentStrokeWidth : 2,
												percentageInnerCutout : 50,
												animationSteps : 100,
												animationEasing : "easeOutBounce",
												animateRotate : true,
												animateScale : false,
												responsive : true,
												maintainAspectRatio : true,
												showScale : true,
												animateScale : true
											}
										});
								$scope.search();
							};
							$scope.getDashboard = function() {
								DashboardSvc
										.classifiedData()
										.then(
												function(result) {
													$scope.docCount = 0;
													var keys = Object
															.keys(result.data);
													for (var i = 0; i < keys.length; i++) {
														if (keys[i] !== "BlankArray") {
															var recObj = {
																'no' : i + 1,
																'classification' : keys[i],
																'count' : result.data[keys[i]].length
															};
															$scope.items
																	.push(recObj);
															$scope.colorArray
																	.push(dynamicColors());
															$scope.labels
																	.push(keys[i]);
															$scope.docCount += result.data[keys[i]].length;
															$scope.data
																	.push(result.data[keys[i]].length);
														}
													}
													DASHBOARD_DETALS.classificationlist = $scope.items;
													$scope.classCount = $scope.labels.length;
													$scope.getData();
												});
							};
							$scope.getDashboard();
							$scope.shelfView = function(bookList) {
								$rootScope.$broadcast('closesidebar');
								DASHBOARD_DETALS.booklist = bookList;
								$location.path('/home');
							};
						} ]);