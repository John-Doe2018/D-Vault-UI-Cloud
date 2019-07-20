fileItApp
		.controller(
				'HeaderController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'$sessionStorage',
						'LandingOperationsSvc',
						'BINDER_NAME',
						'LOGGED_USER',
						'$timeout',
						'dateFilter',
						'$q',
						'DashboardSvc',
						'IMAGE_URLS',
						'ACL',
						'$mdToast',
						'$route',
						'LOGGED_USER',
						function($rootScope, $scope, $location,
								$sessionStorage, LandingOperationsSvc,
								BINDER_NAME, LOGGED_USER, $timeout, dateFilter,
								$q, DashboardSvc, IMAGE_URLS, ACL, $mdToast,
								$route, LOGGED_USER) {
							$rootScope.searchResult = [];
							$scope.gotoSettings = function() {
								$location.path('/settings');
							};
							$scope.getMatches = function(searchText) {
								$scope.people = [];
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									'query' : searchText
								}
								LandingOperationsSvc
										.contentSearch(reqObj)
										.then(
												function(result) {
													$rootScope.searchResult = [];
													if (result.data.docList === null
															|| result.data.docList.length === 0) {
														$mdToast
																.show($mdToast
																		.simple()
																		.textContent(
																				'No result found !!')
																		.position(
																				'bottom')
																		.theme(
																				'error-toast')
																		.hideDelay(
																				3000));
													} else {
														for (var a = 0; a < result.data.docList.length; a++) {
															var dataObj = {
																'classification' : result.data.docList[a].classification,
																'book' : result.data.docList[a].bookName,
																'fileName' : result.data.docList[a].fileName,
																'date' : result.data.docList[a].date,
																'filePath' : result.data.docList[a].filePath,
																'user' : result.data.docList[a].userName
															}
															$rootScope.searchResult
																	.push(dataObj);
														}
														$('#searchModal')
																.modal('show');

													}

												});

							};

							var myVar = setInterval(myTimer, 1000);

							function myTimer() {
								var d = new Date();
								document.getElementById("demo").innerHTML = d
										.toLocaleTimeString();
							}
							$scope.loggeduser = LOGGED_USER.name;

							$scope.w3_open = function() {
								document.getElementById("mainPage").style.marginLeft = "15%";
								document.getElementById("mySidebar").style.width = "15%";
								document.getElementById("mySidebar").style.display = "block";
								$rootScope.$broadcast('closesidebarLanding');
							}

							$scope.logout = function() {
								$rootScope.$broadcast('LogoutSucess');
								LOGGED_USER.browser_refresh = true;
								var myEl = angular.element(document
										.querySelector('#headerDiv'));
								myEl.remove();
								$location.path('/login');
							};

							$scope.gotoProfile = function() {
								$location.path('/profile');
							}
							$scope.backtoHome = function() {
								$location.path('/dashboard');
							};

							$scope.goTOHome = function() {
								if (document.getElementById("profilenav").style.width === "250px") {
									document.getElementById("profilenav").style.width = "0";
								}
								if (document.getElementById("mySidenav").style.width === "250px") {
									document.getElementById("mySidenav").style.width = "0";
								}
								$location.path('/home');
							}

							$rootScope.selectedBook = function(selected) {
								$scope.booksname = selected.book;
								$scope.claasesname = selected.classification;
								BINDER_NAME.name = $scope.booksname;
								$scope.range = [ 1, 2 ];
								var reqObj1 = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									"bookName" : $scope.booksname,
									"classification" : $scope.claasesname,
									"rangeList" : $scope.range
								}
								LandingOperationsSvc.getImage(reqObj1).then(
										function(result) {
											IMAGE_URLS.url = result.data;
											$('#searchModal').modal('hide');
											$location.path('/landingPage');
										});

							};
						} ]);