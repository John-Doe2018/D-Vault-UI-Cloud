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
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, DASHBOARD_DETALS,
								DashboardSvc, LOGGED_USER) {
							$scope.onViewBookmark = function() {
								$location.path('/bookmarks');
							}
							
							DASHBOARD_DETALS.classname = '';
							$scope.records = [];
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
												});

							};
							$scope.getBookMarks();

							$scope.gotoAllDocs = function() {
								$location.path('/allDocs');
							}
							$scope.createBooks = function(classification) {
								DASHBOARD_DETALS.classname = classification;
								$location.path('/createBook');
							};
							$scope.getData = function() {
								new Chart(
										document.getElementById("chart-area"),
										{
											type : 'pie',
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
												}
											}
										});
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
															$scope.records
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
													$scope.classCount = $scope.labels.length;
													$scope.getData();
												});
							};
							$scope.getDashboard();
							$scope.shelfView = function(bookList) {
								DASHBOARD_DETALS.booklist = bookList;
								$location.path('/home');
							};
						} ]);