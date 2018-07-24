fileItApp.controller('DashboardController', [
		'$rootScope',
		'$scope',
		'$location',
		'$sessionStorage',
		'Idle',
		'DASHBOARD_DETALS',
		function($rootScope, $scope, $location, $sessionStorage, Idle,
				DASHBOARD_DETALS) {
			$rootScope.$broadcast('loginSuccess');
			$rootScope.$broadcast('dbData');
			$scope.records = DASHBOARD_DETALS.records;
			$scope.docCount = DASHBOARD_DETALS.doccount;
			$scope.classCount = DASHBOARD_DETALS.classcount;
			$scope.getData = function() {
				new Chart(document.getElementById("chart-area"), {
					type : 'pie',
					data : {
						labels : DASHBOARD_DETALS.lable,
						datasets : [ {
							label : "Documents",
							backgroundColor : DASHBOARD_DETALS.colors,
							data : DASHBOARD_DETALS.data
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
			$scope.getData();
			$scope.shelfView = function(bookList) {
				DASHBOARD_DETALS.booklist = bookList;
				$location.path('/home');
			};
		} ]);