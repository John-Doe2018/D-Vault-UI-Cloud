fileItApp.controller('SettingController', [ '$rootScope', '$scope',
		'$location', '$sessionStorage',
		function($rootScope, $scope, $location, $sessionStorage) {
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
			$scope.moderatoritems = [ {
				'name' : "Create",
				'selected' : false
			}, {
				'name' : "View",
				'selected' : true
			}, {
				'name' : "Modification",
				'selected' : true
			}, {
				'name' : "Delete",
				'selected' : false
			}, {
				'name' : "Download",
				'selected' : true
			} ];
			$scope.testeritems = [ {
				'name' : "Create",
				'selected' : false
			}, {
				'name' : "View",
				'selected' : true
			}, {
				'name' : "Modification",
				'selected' : false
			}, {
				'name' : "Delete",
				'selected' : false
			}, {
				'name' : "Download",
				'selected' : true
			} ];
			$scope.developeritems = [ {
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
				'selected' : false
			}, {
				'name' : "Download",
				'selected' : true
			} ];
			$scope.manageritems = [ {
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

			$scope.toggleModerator = function(item) {
				for (var i = 0; i < $scope.moderatoritems.length; i++) {
					if ($scope.moderatoritems[i].name === item) {
						if ($scope.moderatoritems[i].selected === true) {
							$scope.moderatoritems[i].selected = false;
						} else {
							$scope.moderatoritems[i].selected = true;
						}
					}
				}
			};

			$scope.toggleTester = function(item) {
				for (var i = 0; i < $scope.testeritems.length; i++) {
					if ($scope.testeritems[i].name === item) {
						if ($scope.testeritems[i].selected === true) {
							$scope.testeritems[i].selected = false;
						} else {
							$scope.testeritems[i].selected = true;
						}
					}
				}
			};

			$scope.toggleDeveloper = function(item) {
				for (var i = 0; i < $scope.developeritems.length; i++) {
					if ($scope.developeritems[i].name === item) {
						if ($scope.developeritems[i].selected === true) {
							$scope.developeritems[i].selected = false;
						} else {
							$scope.developeritems[i].selected = true;
						}
					}
				}
			};

			$scope.toggleManager = function(item) {
				for (var i = 0; i < $scope.manageritems.length; i++) {
					if ($scope.manageritems[i].name === item) {
						if ($scope.manageritems[i].selected === true) {
							$scope.manageritems[i].selected = false;
						} else {
							$scope.manageritems[i].selected = true;
						}
					}
				}
			};

			$scope.exists = function(item, list) {
				return list.indexOf(item) > -1;
			};
		} ]);