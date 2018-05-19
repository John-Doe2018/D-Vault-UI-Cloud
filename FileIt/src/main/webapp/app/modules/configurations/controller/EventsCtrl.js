fileItApp.controller('EventsCtrl', [

'$rootScope', '$scope', '$location', function($rootScope, $scope, $location) {
	$scope.events = [];

	$scope.$on('IdleTimeout', function() {
		console.log("Timed Out");
		if ($location.path() !== '/login') {
			$rootScope.$broadcast('LockUser');
		}
	});

} ]).config(function(IdleProvider, KeepaliveProvider) {
	IdleProvider.idle(1); // 15 min
	IdleProvider.timeout(1);
	KeepaliveProvider.interval(1); // in seconds
});
