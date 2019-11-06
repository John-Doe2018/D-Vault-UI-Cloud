/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp.controller('ProfileController', [
		'$scope',
		'ACL',
		function($scope, ACL) {
			$scope.userName = ACL.username;
			$scope.role = ACL.role;
			$scope.group = ACL.group;
			$scope.resize = function() {
				var newheight = $(window).height() - $('#pageHeader').height()
						- $('#footer').height();
				$("#profileDiv").height(newheight);
			};
			$scope.resize();
		} ]);