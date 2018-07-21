fileItApp
		.controller(
				'DashboardController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'$sessionStorage',
						'Idle',
						function($rootScope, $scope, $location,
								$sessionStorage, Idle) {
							$rootScope.$broadcast('loginSuccess');
							$scope.initialize = function() {
								new Chart(
										document.getElementById("chart-area"),
										{
											type : 'pie',
											data : {
												labels : [ "Education", "Invoice",
														"Health Care",
														"Movies",
														"Office Docs" ],
												datasets : [ {
													label : "Population (millions)",
													backgroundColor : [
															"#3e95cd",
															"#8e5ea2",
															"#3cba9f",
															"#e8c3b9",
															"#c45850" ],
													data : [ 20, 4, 14,
															9, 23 ]
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
							$scope.initialize();
							$scope.onClickSlice = function(points, evt) {
								console.log(points);
							};
						} ]);