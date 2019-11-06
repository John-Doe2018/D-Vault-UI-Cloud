/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp
		.controller(
				'DocViewController',
				[
						'$rootScope',
						'$scope',
						'$location',
						'$sessionStorage',
						'Idle',
						'AesEncoder',
						'LandingOperationsSvc',
						'BINDER_NAME',
						'rfc4122',
						'$route',
						'IMAGE_URLS',
						'LoadingService',
						'$http',
						'FILEIT_CONFIG',
						'$interval',
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, AesEncoder,
								LandingOperationsSvc, BINDER_NAME, rfc4122,
								$route, IMAGE_URLS, LoadingService, $http,
								FILEIT_CONFIG, $interval) {
							$scope.imageList = [];
							angular.element(document).ready(function() {
								init();
							});
							function init() {
								$('#myCanvas')
										.annotate(
												{
													color : 'red',
													linewidth : 4,
													bootstrap : true,
													images : [ 'https://dl.dropboxusercontent.com/s/32e9lwck01bd44f/Koala.jpg' ]
												});

								$(".export-image").click();
							}

						} ]);