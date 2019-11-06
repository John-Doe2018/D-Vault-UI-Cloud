/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
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
	IdleProvider.idle(1);
	IdleProvider.timeout(1);
	KeepaliveProvider.interval(1);
});
