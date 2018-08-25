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
						function($rootScope, $scope, $location,
								$sessionStorage, LandingOperationsSvc,
								BINDER_NAME, LOGGED_USER, $timeout, dateFilter,
								$q) {
							function adavnceSearch() {
								LandingOperationsSvc.advSearch().then(
										function(result) {
											$scope.people = result.data;
										});
							}
							$scope.getMatches = function(searchText) {
								var deferred = $q.defer();
								adavnceSearch();
								$timeout(
										function() {
											var states = $scope.people
													.filter(function(state) {
														return (state
																.toUpperCase()
																.indexOf(
																		searchText
																				.toUpperCase()) !== -1 || state
																.toUpperCase()
																.indexOf(
																		searchText
																				.toUpperCase()) !== -1);
													});
											deferred.resolve(states);
										}, 1500);

								return deferred.promise;
							}

							var myVar = setInterval(myTimer, 1000);

							function myTimer() {
								var d = new Date();
								document.getElementById("demo").innerHTML = d
										.toLocaleTimeString();
							}
							$scope.loggeduser = LOGGED_USER.name;

							$scope.w3_open = function() {
								document.getElementById("mainPage").style.marginLeft = "20%";
								document.getElementById("mySidebar").style.width = "20%";
								document.getElementById("mySidebar").style.display = "block";
							}

							$scope.logout = function() {
								$rootScope.$broadcast('LogoutSucess');
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

							$scope.selectedBook = function(selected) {
								if ($scope.selectedItem) {
									var reqObj = {
										bookName : $scope.selectedItem
									}
									LandingOperationsSvc
											.searchBook(reqObj)
											.then(
													function(result) {
														if (result.data.errorId !== undefined) {
															$rootScope
																	.$broadcast(
																			'error',
																			result.data.description);
														} else {
															BINDER_NAME.name = result.data.jsonObject.BookName;
															$location
																	.path('/landingPage');
														}
													});

								} else {
									console.log('cleared');
								}
							};

							$scope.onSearch = function(selectedBook) {
							}
						} ]);