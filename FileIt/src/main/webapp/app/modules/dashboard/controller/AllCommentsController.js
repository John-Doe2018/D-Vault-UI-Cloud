fileItApp.controller('AllCommentsController', [
		'$rootScope',
		'$scope',
		'$location',
		'$sessionStorage',
		'Idle',
		'DASHBOARD_DETALS',
		'DashboardSvc',
		'LOGGED_USER',
		'ACL',
		function($rootScope, $scope, $location, $sessionStorage, Idle,
				DASHBOARD_DETALS, DashboardSvc, LOGGED_USER, ACL) {
			$scope.resize = function() {
				var newheight = $(window).height() - $('#pageHeader').height()
						- $('#footer').height();
				$("#allCommentPage").height(newheight);
			};

			$scope.resize();
			$scope.initialize = function() {
				$scope.comments = DASHBOARD_DETALS.commentlist;
			};

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
				});
			};

			$scope.initialize();

		} ]);