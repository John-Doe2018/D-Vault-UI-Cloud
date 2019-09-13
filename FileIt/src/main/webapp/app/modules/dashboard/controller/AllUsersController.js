fileItApp.controller('AllUsersController', [
		'$rootScope',
		'$scope',
		'$location',
		'$sessionStorage',
		'Idle',
		'DashboardSvc',
		'ACL',
		function($rootScope, $scope, $location, $sessionStorage, Idle,
				DashboardSvc, ACL) {
			$scope.resize = function() {
				var newheight = $(window).height() - $('#pageHeader').height()
						- $('#footer').height();
				$("#allUsersPage").height(newheight);
			};

			$scope.resize();
			$scope.getAllUsers = function() {
				var reqObj = {
					'customHeader' : {
						'userName' : ACL.username,
						'role' : ACL.role,
						'group' : ACL.group
					}
				}
				DashboardSvc.getAllUsers(reqObj).then(function(result) {
					$scope.users = result.data.users.User;
				});
			};

			$scope.getAllUsers();

		} ]);