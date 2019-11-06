/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp.controller('AllCommentsController', [
		'$scope',
		'DASHBOARD_DETALS',
		'DashboardSvc',
		'LOGGED_USER',
		'ACL',
		function($scope, DASHBOARD_DETALS, DashboardSvc, LOGGED_USER, ACL) {
			$scope.resize = function() {
				var newheight = $(window).height() - $('#pageHeader').height()
						- $('#footer').height();
				$("#allCommentPage").height(newheight);
			};
			$scope.comments = DASHBOARD_DETALS.commentlist;
			$scope.resize();
			$scope.count = 1;
			$scope.loggeduser = ACL.username;
			$scope.addComment = function(myTextarea) {
				var reqObj = {
					'customHeader' : {
						'userName' : ACL.username,
						'role' : ACL.role,
						'group' : ACL.group
					},
					'comment' : {
						'userName' : LOGGED_USER.name,
						'message' : myTextarea
					}
				}
				DashboardSvc.addComment(reqObj).then(function(result) {
					$scope.comments = result.data.comments;
					DASHBOARD_DETALS.commentlist = $scope.comments;
					$scope.myTextarea = '';
				});
			};

		} ]);