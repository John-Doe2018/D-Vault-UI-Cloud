/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp.controller('ThumbnailViewController', [
		'$rootScope',
		'$scope',
		'$location',
		'ACL',
		'BINDER_NAME',
		'DASHBOARD_DETALS',
		'LandingOperationsSvc',
		'IMAGE_URLS',
		'$sce',
		function($rootScope, $scope, $location, ACL, BINDER_NAME,
				DASHBOARD_DETALS, LandingOperationsSvc, IMAGE_URLS, $sce) {
			$scope.viewSwitch = 'BookView';
			$scope.onViewChange = function() {
				$scope.viewSwitch = 'BookView';
				$scope.range = [ 1, 2 ];
				var reqObj1 = {
					'customHeader' : {
						'userName' : ACL.username,
						'role' : ACL.role,
						'group' : ACL.group
					},
					"bookName" : BINDER_NAME.name,
					"classification" : DASHBOARD_DETALS.booklist,
					"rangeList" : $scope.range
				}
				LandingOperationsSvc.getImage(reqObj1).then(function(result) {
					IMAGE_URLS.url = result.data;
					$location.path('/landingPage');
				});

			};

			$scope.showPdf = function(name) {
				$scope.filelist = [];
				$scope.filelist.push(name);
				var reqObj = {
					'customHeader' : {
						'userName' : ACL.username,
						'role' : ACL.role,
						'group' : ACL.group
					},
					"bookName" : BINDER_NAME.name,
					'classification' : DASHBOARD_DETALS.booklist,
					"fileName" : $scope.filelist
				}
				LandingOperationsSvc.downloadFile(reqObj).then(
						function(result) {
							if (result.data.errorId !== undefined) {
								$rootScope.$broadcast('error',
										result.data.description);
							} else {

								$scope.content = $sce
										.trustAsResourceUrl(result.data.URL
												+ "#toolbar=0");

								$('#showThumbnailPdf').attr("data",
										$scope.content);
								$scope.pdf = {
									src : $scope.content,
									data : null
								};
							}
						});

			};
			angular.element(function() {
				$scope.content = DASHBOARD_DETALS.pdfdata.src;
				$('#showThumbnailPdf').attr("data", $scope.content);
				$scope.pdf = DASHBOARD_DETALS.pdfdata;
				$scope.data = DASHBOARD_DETALS.nodedata;
				$scope.nodeslt = $scope.data[0].nodes;
				$scope.showPdf($scope.nodeslt[0].title);
			});

		} ]);