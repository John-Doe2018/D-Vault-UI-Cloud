fileItApp.controller('ProfileController', [ '$rootScope', '$scope',
		'$location', '$sessionStorage', 'ACL',
		function($rootScope, $scope, $location, $sessionStorage, ACL) {
			$scope.userName = ACL.username;
			$scope.role = ACL.role;
			$scope.group = ACL.group;
		} ]);