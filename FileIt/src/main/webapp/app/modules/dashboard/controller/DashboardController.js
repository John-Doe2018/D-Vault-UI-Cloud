fileItApp.controller('DashboardController', [ '$rootScope', '$scope',
		'$location', '$sessionStorage', 'Idle',
		function($rootScope, $scope, $location, $sessionStorage, Idle) {
			$rootScope.$broadcast('loginSuccess');
		} ]);