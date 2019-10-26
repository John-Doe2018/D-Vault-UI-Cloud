fileItApp
		.controller(
				'LandingController',
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
						'BINDER_SVC',
						'DASHBOARD_DETALS',
						'$mdDialog',
						'ACL',
						'$mdToast',
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, AesEncoder,
								LandingOperationsSvc, BINDER_NAME, rfc4122,
								$route, IMAGE_URLS, LoadingService, $http,
								FILEIT_CONFIG, BINDER_SVC, DASHBOARD_DETALS,
								$mdDialog, ACL, $mdToast) {
							$scope.loadImageIndex = 2;
							if (DASHBOARD_DETALS.searchsave === '') {
								DASHBOARD_DETALS.searchsave = false;
							}
							$scope.minimizeModal = DASHBOARD_DETALS.searchsave;
							$scope.$on('minModal', function(event) {
								$scope.minimizeModal = true;
								DASHBOARD_DETALS.searchsave = true;
							});
							$scope.maximizemodal = function() {
								DASHBOARD_DETALS.searchsave = false;
								$scope.minimizeModal = false;
								$rootScope.$broadcast('maximizeModal');
							}

							$scope.closePopup = function() {
								DASHBOARD_DETALS.searchsave = false;
								$scope.minimizeModal = false;
							}

							$scope.$on('closePopUP', function(event) {
								$scope.closePopup();
							});
							$scope.rangeBegin = 2;
							$scope.zoomUrls = [];
							$scope.nodearray = [];
							$scope.fileList = [];
							$scope.viewSwitch = 'ThumbnailView';
							$scope.onViewChange = function() {
								$scope.viewSwitch = 'BookView';
								$location.path('/thumbnailView');
							};
							$scope.getData = function() {
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									"book" : {
										"bookName" : BINDER_NAME.name,
										"classification" : DASHBOARD_DETALS.booklist
									}
								}
								LandingOperationsSvc
										.getPageIndex(reqObj)
										.then(
												function(result) {
													if (result.data.errorId !== undefined) {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													} else {
														var resultObj = result.data;
														$scope.nodearray = [];
														for (var x = 0; x < resultObj.book.documents.length; x++) {
															var nodeObj = {
																'id' : resultObj.book.documents[x].serialNo,
																'title' : resultObj.book.documents[x].fileName,
																'firstIndex' : resultObj.book.documents[x].startIndex,
																'lastIndex' : resultObj.book.documents[x].endIndex
															}
															$scope.nodearray
																	.push(nodeObj);
														}

														var nodeObjMaster = {
															'id' : 1,
															'nodes' : $scope.nodearray
														};
														$scope.data = [];
														$scope.data
																.push(nodeObjMaster);
														$scope.totalpages = $scope.nodearray[$scope.nodearray.length - 1].lastIndex;

													}
												});
							};

							$scope.getImage = function() {
								for (var n = 0; n < IMAGE_URLS.url.length; n++) {
									$scope.zoomUrls.push(IMAGE_URLS.url[n]);
									var text1 = '<div><img id="'
											+ n
											+ '" src="data:image/jpeg;base64,'
											+ IMAGE_URLS.url[n]
											+ '" style="height: 465px; width: 370px; margin-top: 0px; margin-left: 2px !important;border: 3px solid blueviolet;" /></div>';
									$(text1).appendTo(".b-load");
								}
								$scope.getData();
							};
							$scope.getImage();

							$('input[type=radio]').click(function() {
								$scope.optselect = $(this).val();
							});

							$scope.openSideBar = function() {
								document.getElementById("main").style.marginLeft = "15%";
								document.getElementById("mySidebar1").style.width = "15%";
								document.getElementById("mySidebar1").style.display = "block";
								document.getElementById("openNav").style.display = 'none';
								$("#bookContainer").css("margin-top", "-1%");
								$rootScope.$broadcast('closesidebar');
							};

							$scope.closeSideBar = function() {
								document.getElementById("main").style.marginLeft = "0%";
								document.getElementById("mySidebar1").style.display = "none";
								document.getElementById("openNav").style.display = "inline-block";
								$("#bookContainer").css("margin-top", "-4%");
							}

							$scope.$on('closesidebarLanding', function(event) {
								$scope.closeSideBar();
							});

							$scope.addFlieClick = function() {
								$scope.fileList = [];
								$('#addFileModal').modal('show');
							}
							$scope.ImageProperty = {
								fileName : "",
								type : ""
							};

							$scope.convertImage = function() {
								if ($scope.gFiles && $scope.gFiles.length) {
									for (var i = 0; i < $scope.gFiles.length; i++) {
										var file = $scope.gFiles[i];
										if (!file.$error) {
											var fd = new FormData();
											fd.append('file', file);
											fd.append('filename', file.name);
											fd.append('classification',
													DASHBOARD_DETALS.booklist);
											fd.append('bookName',
													BINDER_NAME.name);
											fd.append('path', BINDER_NAME.name
													+ "/Images/");
											fd.append('type', file.type);
											$scope.progressvisible = true
											var xhr = new XMLHttpRequest()
											xhr.upload.onprogress = function(
													evt) {

												$scope
														.$apply(function() {
															if (evt.lengthComputable) {
																var progressPercentage = parseInt(100.0
																		* evt.loaded
																		/ evt.total);
																$scope.progress = progressPercentage
																		+ '% ';
															}

														})
											};
											xhr.addEventListener("load",
													uploadComplete, false)
											xhr.addEventListener("error",
													uploadFailed, false)
											xhr.addEventListener("abort",
													uploadCanceled, false)
											xhr
													.open(
															"POST",
															FILEIT_CONFIG.apiUrl
																	+ BINDER_SVC.convertImg);
											xhr.setRequestHeader("UserName",
													ACL.username);
											xhr.send(fd)

										}
									}
								}
							};

							function uploadComplete(evt) {
								$scope.resize();
							}

							function uploadFailed(evt) {
								alert("There was an error attempting to upload the file.")
							}

							function uploadCanceled(evt) {
								scope.$apply(function() {
									$scope.progressvisible = false
								})
								alert("The upload has been canceled by the user or the browser dropped the connection.")
							}
							$scope
									.$watch(
											'gFiles',
											function() {
												var files = $scope.gFiles;
												$scope.validFile = true;
												if ($scope.validFile) {
													for (var i = 0; i < files.length; i++) {
														var fileFound = false;
														for (var j = 0; j < $scope.fileList.length; j++) {
															if ($scope.fileList[j].name == files[i].name) {
																fileFound = true;
																break;
															}
														}
														if (!fileFound) {
															$scope.showSubmitButton = true;
															$scope.ImageProperty.fileName = files[i].name;
															$scope.ImageProperty.type = files[i].type;
															$scope.fileList
																	.push($scope.ImageProperty);
															$scope.ImageProperty = {};
														} else {
															alert("Cannot upload same file twice !!");
														}
													}
													$scope.convertImage();
												}

											});

							$scope.onAddFileClick = function() {
								var addFileObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									"book" : {
										"bookName" : BINDER_NAME.name,
										"classification" : DASHBOARD_DETALS.booklist,
										"documents" : $scope.fileList
									}
								};
								LandingOperationsSvc
										.addfile(addFileObj)
										.then(
												function(result) {
													if (result.data.errorId !== undefined) {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													} else {
														$scope.getData();
													}
												});

							};

							$scope.onAddfileCancel = function() {
								$('#addFileModal').modal('hide');
								$scope.fileList = undefined;
							}

							window.setInterval(function() {
								var elem = document.getElementById('mybook');
								elem.scrollTop = elem.scrollHeight;
							}, 5000);

							/*
							 * $scope.$on('onNodeClick', function(event, node) {
							 * console.log(node); $location.path('/docView');
							 * });
							 */

							$scope.indexChanged = false;

							$scope.onnodeclick = function(node) {
								$scope.indexChanged = true;
								var reqObj1 = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									"bookName" : BINDER_NAME.name,
									"classification" : DASHBOARD_DETALS.booklist,
									"rangeList" : [ node.firstIndex,
											node.firstIndex + 1 ]
								}
								LandingOperationsSvc
										.getImage(reqObj1)
										.then(
												function(result) {
													$scope.currentPage = 2;
													$scope.rangeBegin = 2;
													$scope.newBookRange = node.firstIndex + 2;
													IMAGE_URLS.url = result.data;
													$scope.zoomUrls = [];
													$scope.zoomUrls
															.push(IMAGE_URLS.url[0]);
													$scope.zoomUrls
															.push(IMAGE_URLS.url[1]);
													$("#0")
															.attr(
																	"src",
																	"data:image/jpeg;base64,"
																			+ IMAGE_URLS.url[0]);
													$("#1")
															.attr(
																	"src",
																	"data:image/jpeg;base64,"
																			+ IMAGE_URLS.url[1]);

													$('#mybook').booklet(
															"gotopage", 1);
												});

							};

							$scope.closeModal = function() {
								$scope.fileList = [];
							};

							$scope.deletebook = function(bookname) {
								var deleteObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									"book" : {
										"bookName" : bookname,
										"classification" : DASHBOARD_DETALS.booklist
									}
								}
								LandingOperationsSvc
										.deleteBook(deleteObj)
										.then(
												function(result) {
													if (result.data.errorId !== undefined) {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													} else {
														$location
																.path('/dashboard');
													}
												});
							}

							$scope.onFileDownload = function() {
								var reqObj = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									"bookName" : BINDER_NAME.name,
									'classification' : DASHBOARD_DETALS.booklist,
								}
								LandingOperationsSvc
										.downloadFile(reqObj)
										.then(
												function(result) {
													if (result.data.errorId !== undefined) {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													} else {
														console
																.log(result.data.URL);
														result.data.URL = "download/Reqres.zip";
														var a = document
																.createElement("a");
														a.href = result.data.URL;
														fileName = result.data.URL
																.split("/")
																.pop();
														a.download = fileName;
														document.body
																.appendChild(a);
														a.click();
														window.URL
																.revokeObjectURL(result.data.URL);
														a.remove();
													}
												});

							}

							$scope.removeBook = function(ev) {
								var confirm = $mdDialog
										.confirm()
										.title(
												'Would you like to delete the book?')
										.textContent(
												'All documents uploaded will be deleted...')
										.ariaLabel('Lucky day').targetEvent(ev)
										.ok('Yes').cancel('No');

								$mdDialog
										.show(confirm)
										.then(
												function() {
													$scope
															.deletebook(BINDER_NAME.name);
												},
												function() {
													$scope.status = 'You decided to keep your debt.';
												});

							}

							$scope.showZoom = function() {
								$(".carousel-inner").empty();
								for (var n = 0; n < $scope.zoomUrls.length; n++) {
									var text1 = '<div class="item active"><img src="data:image/jpeg;base64,'
											+ $scope.zoomUrls[n]
											+ ' "alt="Los Angeles" style="width: 100%;border: 3px solid blueviolet;"></div>';
									$(text1).appendTo(".carousel-inner");
								}

								$('#fsModal').modal('show');
							};

							$scope.loadImageZoom = function() {
								console.log($scope.rangeBegin);
								var reqObj1 = {
									'customHeader' : {
										'userName' : ACL.username,
										'role' : ACL.role,
										'group' : ACL.group
									},
									"bookName" : BINDER_NAME.name,
									"classification" : DASHBOARD_DETALS.booklist,
									"rangeList" : [ $scope.loadImageIndex + 1,
											$scope.loadImageIndex + 2 ]
								}

								LandingOperationsSvc
										.getImage(reqObj1)
										.then(
												function(result) {

													IMAGE_URLS.url = result.data;
													var text1 = '<div class="item active"><img src="data:image/jpeg;base64,'
															+ IMAGE_URLS.url[0]
															+ ' "alt="Los Angeles" style="width: 100%;border: 3px solid blueviolet;"></div>';
													$(text1).appendTo(
															".carousel-inner");
													var text2 = '<div class="item active"><img src="data:image/jpeg;base64,'
															+ IMAGE_URLS.url[1]
															+ ' "alt="Los Angeles" style="width: 100%;border: 3px solid blueviolet;"></div>';
													$(text2).appendTo(
															".carousel-inner");
													$scope.loadImageIndex += 2;
												});
							};

							var scrollRange = 1200;
							$('#bookViewModel')
									.on(
											"scroll",
											function() {
												var y = $(this).scrollTop();
												if (y > 20) {
													document
															.getElementById("myBtn").style.display = "block";
												} else {
													document
															.getElementById("myBtn").style.display = "none";
												}
												if (y > scrollRange) {
													scrollRange += 1200;
													$scope.loadImageZoom();
												}
											});

							$scope.topFunction = function() {
								$('#bookViewModel').scrollTop(0);
							}

							$scope
									.$on(
											'confirmAgreed',
											function() {
												var requestObj = {
													'customHeader' : {
														'userName' : ACL.username,
														'role' : ACL.role,
														'group' : ACL.group
													},

													"book" : {
														"bookName" : BINDER_NAME.name,
														"classification" : DASHBOARD_DETALS.booklist,
														"documents" : [ {
															"fileName" : $scope.deleteFileName
														} ]
													}
												}
												LandingOperationsSvc
														.deleteFile(requestObj)
														.then(
																function(result) {
																	if (result.data.successMessage !== undefined) {
																		$scope.nodeArrayLatest = $scope.data[0].nodes;
																		$scope.nodeArrayLatest
																				.splice(
																						$scope.selectedFIleIndex,
																						1);
																		var nodeObjMaster = {
																			'id' : 1,
																			'nodes' : $scope.nodearray
																		};
																		$scope.data = [];
																		$scope.data
																				.push(nodeObjMaster);
																		$scope.indexChanged = true;
																		var reqObj1 = {
																			'customHeader' : {
																				'userName' : ACL.username,
																				'role' : ACL.role,
																				'group' : ACL.group
																			},
																			"bookName" : BINDER_NAME.name,
																			"classification" : DASHBOARD_DETALS.booklist,
																			"rangeList" : [
																					1,
																					2 ]
																		}
																		LandingOperationsSvc
																				.getImage(
																						reqObj1)
																				.then(
																						function(
																								result) {
																							$scope.currentPage = 2;
																							$scope.rangeBegin = 2;
																							$scope.newBookRange = 3;
																							IMAGE_URLS.url = result.data;
																							$scope.zoomUrls = [];
																							$scope.zoomUrls
																									.push(IMAGE_URLS.url[0]);
																							$scope.zoomUrls
																									.push(IMAGE_URLS.url[1]);
																							$(
																									"#0")
																									.attr(
																											"src",
																											"data:image/jpeg;base64,"
																													+ IMAGE_URLS.url[0]);
																							$(
																									"#1")
																									.attr(
																											"src",
																											"data:image/jpeg;base64,"
																													+ IMAGE_URLS.url[1]);

																							$(
																									'#mybook')
																									.booklet(
																											"gotopage",
																											1);
																						});

																	} else {
																		$rootScope
																				.$broadcast(
																						'error',
																						result.data.description);
																	}
																});
											});

							$scope.removeFile = function(scope, fileName) {
								$rootScope.$broadcast('showConfirmModal');
								$scope.deleteFileName = fileName;
								bookScope = scope;
							};

							$scope.downloadFile = function(name) {
								$scope.filelist = [];
								if (name === 'multiple') {
									$.each($("input[name='sport']:checked"),
											function() {
												$scope.filelist.push($(this)
														.val());
											});
								} else {
									var obj = {
										"fileName" : name
									};
									$scope.filelist.push(name);
								}

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
								LandingOperationsSvc
										.downloadFile(reqObj)
										.then(
												function(result) {
													if (result.data.errorId !== undefined) {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													} else {

														var a = document
																.createElement("a");
														a.href = result.data.URL;
														fileName = result.data.URL
																.split("/")
																.pop();
														a.target = "_blank";
														document.body
																.appendChild(a);
														a.click();
														window.URL
																.revokeObjectURL(result.data.URL);
														a.remove();
													}
												});

							}

							$scope.backToBookView = function() {
								$location.path(DASHBOARD_DETALS.backview);
							}

							$scope.openBookPopUp = function(nodeName, index) {
								$scope.selectedFIleIndex = index;
								document.getElementById("checkbox"
										+ nodeName.firstIndex).checked = false;
								$scope.optselect = undefined;
								$scope.nodeNaME = nodeName;
								$('#fileModal').modal('show');
							};

							$scope.onOptionClick = function() {
								if ($scope.optselect === 'view') {
									$scope.onnodeclick($scope.nodeNaME);
								} else if ($scope.optselect === 'delete') {
									$scope.removeFile(this,
											$scope.nodeNaME.title);
								} else if ($scope.optselect === 'download') {
									$scope.downloadFile($scope.nodeNaME.title);
								}
							};

							$scope.currentPage = 2;
							$('.carousel-control.left').click(function() {
								$('#myCarousel').carousel('prev');
							});

							$('#prev_page_button').click(function() {
								if ($scope.currentPage > 2) {
									$scope.currentPage -= 2;
								}
							});

							$('#next_page_button')
									.click(
											function() {
												if (($scope.currentPage + 2) > $scope.rangeBegin) {
													if ($scope.indexChanged) {
														$scope.range = [
																$scope.newBookRange,
																$scope.newBookRange + 1 ];
													} else {
														$scope.range = [
																$scope.rangeBegin + 1,
																$scope.rangeBegin + 2 ];
													}

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
													LandingOperationsSvc
															.getImage(reqObj1)
															.then(
																	function(
																			result) {

																		IMAGE_URLS.url = result.data;
																		$scope.zoomUrls = [];
																		var indexadd = $scope.currentPage;
																		if ($scope.indexChanged) {
																			$scope.zoomUrls
																					.push(IMAGE_URLS.url[0]);
																			$scope.zoomUrls
																					.push(IMAGE_URLS.url[1]);
																			var id1 = "#"
																					+ indexadd;
																			var id2 = "#"
																					+ (indexadd + 1);
																			if ($(id1).length) {
																				$(
																						id1)
																						.attr(
																								"src",
																								"data:image/jpeg;base64,"
																										+ IMAGE_URLS.url[0]);
																			} else {
																				$(
																						'#mybook')
																						.booklet(
																								"add",
																								"end",
																								'<div><img id="'
																										+ id1
																										+ '"src="data:image/jpeg;base64,'
																										+ IMAGE_URLS.url[0]
																										+ '" style="height: 465px; width: 370px; margin-top: 0px; margin-left: 2px !important;border: 3px solid blueviolet;" /></div>');
																			}
																			if ($(id2).length) {
																				$(
																						id2)
																						.attr(
																								"src",
																								"data:image/jpeg;base64,"
																										+ IMAGE_URLS.url[1]);
																			} else {
																				$(
																						'#mybook')
																						.booklet(
																								"add",
																								"end",
																								'<div><img id="'
																										+ id2
																										+ '"src="data:image/jpeg;base64,'
																										+ IMAGE_URLS.url[1]
																										+ '" style="height: 465px; width: 370px; margin-top: 0px; margin-left: 2px !important;border: 3px solid blueviolet;" /></div>');
																			}
																		} else {
																			$(
																					'#mybook')
																					.booklet(
																							"add",
																							"end",
																							'<div><img id="'
																									+ indexadd
																									+ '"src="data:image/jpeg;base64,'
																									+ IMAGE_URLS.url[0]
																									+ '" style="height: 465px; width: 370px; margin-top: 0px; margin-left: 2px !important;border: 3px solid blueviolet;" /></div>');
																			$(
																					'#mybook')
																					.booklet(
																							"add",
																							"end",
																							'<div><img id="'
																									+ (indexadd + 1)
																									+ '"src="data:image/jpeg;base64,'
																									+ IMAGE_URLS.url[1]
																									+ '" style="height: 465px; width: 370px; margin-top: 0px; margin-left: 2px !important;border: 3px solid blueviolet;" /></div>');
																		}

																		$scope.currentPage += 2;
																		$scope.rangeBegin += 2;
																		$scope.newBookRange += 2;
																	});
												}

											});

							$('.scroll-top').click(function() {
								$("html, body").animate({
									scrollTop : 0
								}, 100);
								return false;
							});

							$('.carousel-control.right').click(function() {
								$('#myCarousel').carousel('next');
							});
							$(function() {
								var $mybook = $('#mybook');
								var $bttn_next = $('#next_page_button');
								var $bttn_prev = $('#prev_page_button');
								var $loading = $('#loading');
								var $mybook_images = $mybook.find('img');
								var cnt_images = $mybook_images.length;
								var loaded = 0;
								// preload all the images in the book,
								// and then call the booklet plugin

								$mybook_images.each(function() {
									var $img = $(this);
									var source = $img.attr('src');
									$('<img/>').load(function() {
										++loaded;
										if (loaded == cnt_images) {
											$loading.hide();
											$bttn_next.show();
											$bttn_prev.show();
											$mybook.show().booklet({
												name : null, // name of the
												// booklet to
												// display in
												// the document
												// title bar
												width : 1200, // container
												// width
												height : 735, // container
												// height
												speed : 600, // speed of the
												// transition
												// between pages
												direction : 'LTR', // direction
												// of the
												// overall
												// content
												// organization,
												// default
												// LTR, left
												// to right,
												// can be
												// RTL for
												// languages
												// which
												// read
												// right to
												// left
												startingPage : 0, // index of
												// the first
												// page to
												// be
												// displayed
												easing : 'easeInOutQuad', // easing
												// method
												// for
												// complete
												// transition
												easeIn : 'easeInQuad', // easing
												// method
												// for
												// first
												// half
												// of
												// transition
												easeOut : 'easeOutQuad', // easing
												// method
												// for
												// second
												// half
												// of
												// transition

												closed : true, // start with
												// the book
												// "closed",
												// will add
												// empty pages
												// to beginning
												// and end of
												// book
												closedFrontTitle : null, // used
												// with
												// "closed",
												// "menu"
												// and
												// "pageSelector",
												// determines
												// title
												// of
												// blank
												// starting
												// page
												closedFrontChapter : null, // used
												// with
												// "closed",
												// "menu"
												// and
												// "chapterSelector",
												// determines
												// chapter
												// name
												// of
												// blank
												// starting
												// page
												closedBackTitle : null, // used
												// with
												// "closed",
												// "menu"
												// and
												// "pageSelector",
												// determines
												// chapter
												// name
												// of
												// blank
												// ending
												// page
												closedBackChapter : null, // used
												// with
												// "closed",
												// "menu"
												// and
												// "chapterSelector",
												// determines
												// chapter
												// name
												// of
												// blank
												// ending
												// page
												covers : false, // used with
												// "closed",
												// makes first
												// and last
												// pages into
												// covers,
												// without page
												// numbers (if
												// enabled)

												pagePadding : 10, // padding
												// for each
												// page
												// wrapper
												pageNumbers : true, // display
												// page
												// numbers
												// on each
												// page

												hovers : false, // enables
												// preview
												// pageturn
												// hover
												// animation,
												// shows a small
												// preview of
												// previous or
												// next page on
												// hover
												overlays : false, // enables
												// navigation
												// using a
												// page
												// sized
												// overlay,
												// when
												// enabled
												// links
												// inside
												// the
												// content
												// will not
												// be
												// clickable
												tabs : false, // adds tabs
												// along the top
												// of the pages
												tabWidth : 60, // set the width
												// of the tabs
												tabHeight : 20, // set the
												// height of the
												// tabs
												arrows : false, // adds arrows
												// overlayed
												// over the book
												// edges
												cursor : 'pointer', // cursor
												// css
												// setting
												// for side
												// bar areas

												hash : false, // enables
												// navigation
												// using a hash
												// string, ex:
												// #/page/1 for
												// page 1, will
												// affect all
												// booklets with
												// 'hash'
												// enabled
												keyboard : true, // enables
												// navigation
												// with
												// arrow
												// keys
												// (left:
												// previous,
												// right:
												// next)
												next : $bttn_next, // selector
												// for
												// element
												// to use as
												// click
												// trigger
												// for next
												// page
												prev : $bttn_prev, // selector
												// for
												// element
												// to use as
												// click
												// trigger
												// for
												// previous
												// page

												menu : null, // selector for
												// element to
												// use as the
												// menu area,
												// required for
												// 'pageSelector'
												pageSelector : false, // enables
												// navigation
												// with
												// a
												// dropdown
												// menu
												// of
												// pages,
												// requires
												// 'menu'
												chapterSelector : false, // enables
												// navigation
												// with
												// a
												// dropdown
												// menu
												// of
												// chapters,
												// determined
												// by
												// the
												// "rel"
												// attribute,
												// requires
												// 'menu'

												shadows : true, // display
												// shadows on
												// page
												// animations
												shadowTopFwdWidth : 166, // shadow
												// width
												// for
												// top
												// forward
												// anim
												shadowTopBackWidth : 166, // shadow
												// width
												// for
												// top
												// back
												// anim
												shadowBtmWidth : 50, // shadow
												// width
												// for
												// bottom
												// shadow

												before : function() {
												}, // callback invoked before
												// each page turn animation
												after : function() {
												} // callback invoked after
											// each page turn animation
											});
											Cufon.refresh();
										}
									}).attr('src', source);
								});

							});
						} ]);