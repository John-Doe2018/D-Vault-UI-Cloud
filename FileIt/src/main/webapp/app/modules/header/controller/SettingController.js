fileItApp.controller('SettingController', [
		'$rootScope',
		'$scope',
		'$location',
		'$sessionStorage',
		'UserOperationsSvc',
		function($rootScope, $scope, $location, $sessionStorage,
				UserOperationsSvc) {
			$scope.roleArray = [];
			$scope.getRole = function() {
				UserOperationsSvc.getAllRoles().then(function(result) {
					console.log(result.data);
					var keys = Object.keys(result.data);
					for (var i = 0; i < keys.length; i++) {
						var obj = {
							"code" : keys[i],
							"name" : result.data[keys[i]]
						}
						$scope.roleArray.push(obj);
					}
				});
			};
			$scope.getRole();
			$scope.adminitems = [ {
				'name' : "Create",
				'selected' : true
			}, {
				'name' : "View",
				'selected' : true
			}, {
				'name' : "Modification",
				'selected' : true
			}, {
				'name' : "Delete",
				'selected' : true
			}, {
				'name' : "Download",
				'selected' : true
			} ];

			$scope.onChange = function(role) {
				console.log(role);
			}

			$scope.toggleAdmin = function(item) {
				for (var i = 0; i < $scope.adminitems.length; i++) {
					if ($scope.adminitems[i].name === item) {
						if ($scope.adminitems[i].selected === true) {
							$scope.adminitems[i].selected = false;
						} else {
							$scope.adminitems[i].selected = true;
						}
					}
				}
			};

			$scope.exists = function(item, list) {
				return list.indexOf(item) > -1;
			};
		} ]);