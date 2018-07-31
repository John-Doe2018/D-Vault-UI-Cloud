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
						function($rootScope, $scope, $location,
								$sessionStorage, LandingOperationsSvc,
								BINDER_NAME, LOGGED_USER) {

							$scope.loggeduser = LOGGED_USER.name;

							$scope.w3_open = function() {
								document.getElementById("mainPage").style.marginLeft = "25%";
								document.getElementById("mySidebar").style.width = "25%";
								document.getElementById("mySidebar").style.display = "block";
							}

							function adavnceSearch() {
								LandingOperationsSvc.advSearch().then(
										function(result) {
											$scope.people = result.data;
										});
							}
							;
							adavnceSearch();
							$scope.$on('advSaerch', function() {
								adavnceSearch();
							});
							$scope.localSearch = function(str, people) {
								var matches = [];
								$scope.people
										.forEach(function(person) {
											if ((person.toLowerCase().indexOf(
													str.toString()
															.toLowerCase()) >= 0)) {
												var obj = {
													"bookname" : person
												}
												matches.push(obj);
											}
										});
								return matches;
							};

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
								if (selected) {
									var selectedbook = selected.title;
									var reqObj = {
										bookName : selectedbook
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