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

			$(document).ready(function() {

				initUIEvents();

			});

			function initUIEvents() {

				$(".comment").unbind().click(function() {

					var currentComment = $(this).data("commentid");

					$("#commentactions-" + currentComment).slideDown("fast");

				});

				$(".commentLi").hover(function() {

					var currentComment = $(this).data("commentid");

					$("#comment-" + currentComment).stop().animate({
						opacity : "1",
						backgroundColor : "#f8f8f8",
						borderLeftWidth : "4px"
					}, {
						duration : 100,
						complete : function() {
						}
					});

				}, function() {

					var currentComment = $(this).data("commentid");

					$("#comment-" + currentComment).stop().animate({
						opacity : "1",
						backgroundColor : "#fff",
						borderLeftWidth : "1px"
					}, {
						duration : 100,
						complete : function() {
						}
					});

					$("#commentactions-" + currentComment).slideUp("fast");

				});

			}

			$scope.resize();
			$scope.clear = function() {
				$scope.myTextarea = '';
			}
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
					$scope.myTextarea = '';
				});
			};

			$scope.initialize();

		} ]);