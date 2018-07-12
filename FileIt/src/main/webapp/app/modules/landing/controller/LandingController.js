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
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, AesEncoder,
								LandingOperationsSvc, BINDER_NAME, rfc4122,
								$route, IMAGE_URLS, LoadingService, $http,
								FILEIT_CONFIG, BINDER_SVC) {

							$scope.getData = function() {
								LandingOperationsSvc
										.treeList(BINDER_NAME.name)
										.then(
												function(result) {
													if (result.data.errorId !== undefined) {
														$rootScope
																.$broadcast(
																		'error',
																		result.data.description);
													} else {
														var resultObj = result.data;
														var a = resultObj.map.body.topicref.topic;
														if (angular.isArray(a)) {
															for (var x = 0; x < a.length; x++) {
																var nodeObj = {
																	'id' : a[x].id,
																	'title' : a[x].name,
																	'path' : a[x].path
																}
																$scope.nodearray
																		.push(nodeObj);
															}
														} else {
															var nodeObj = {
																'id' : a.id,
																'title' : a.name,
																'path' : a.path
															}
															$scope.nodearray
																	.push(nodeObj);
														}

														var nodeObjMaster = {
															'id' : resultObj.map.id,
															'title' : resultObj.map.body.topicref.navtitle,
															'nodes' : $scope.nodearray
														};
														$scope.data = [];
														$scope.data
																.push(nodeObjMaster);
													}
												});
							};

							$scope.getImage = function() {
								for (var n = 0; n < IMAGE_URLS.url.length; n++) {
									var text1 = '<div><img src="'
											+ IMAGE_URLS.url[n]
											+ '"style="height: 465px; width: 370px; margin-top: 0px; margin-left: 2px !important;" /></div>';
									$(text1).appendTo(".b-load");
								}
								$scope.getData();
							};
							$scope.getImage();

							$scope.onFileDownload = function() {
								var reqObj = {
									"bookName" : BINDER_NAME.name
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

							var bookScope;

							$scope.removeFile = function(scope, fileName) {
								$rootScope.$broadcast('showConfirmModal');
								$scope.deleteFileName = fileName;
								bookScope = scope;
							};

							$scope
									.$on(
											'confirmAgreed',
											function() {
												var requestObj = {
													'bookName' : BINDER_NAME.name,
													'fileName' : $scope.deleteFileName
												}
												LandingOperationsSvc
														.deleteFile(requestObj)
														.then(
																function(result) {
																	if (result.data.Success !== undefined) {
																		bookScope
																				.remove(this);
																		bookScope = null;
																		$route
																				.reload();
																	} else {
																		$rootScope
																				.$broadcast(
																						'error',
																						result.data.description);
																	}
																});
											});

							$scope.closeModal = function() {
								$scope.fileList = [];
							}

							$scope.fileList = [];

							$scope.addFlieClick = function() {
								$('#addFileModal').modal('show');
							}
							$scope.ImageProperty = {
								id : rfc4122.newuuid(),
								name : "",
								path : "",
								type : "",
								version : "1.0 ",
								note : "NA"
							};

							$scope.convertImage = function(files) {
								var fd = new FormData();
								fd.append('file', files[0]);
								fd.append('filename', files[0].name);
								fd.append('bookName', BINDER_NAME.name);
								fd.append('path', $scope.binderName
										+ "/Images/");
								fd.append('type', files[0].type);
								LoadingService.showLoad();
								$http
										.post(
												FILEIT_CONFIG.apiUrl
														+ BINDER_SVC.convertImg,
												fd,
												{
													transformRequest : angular.identity,
													headers : {
														'Content-Type' : undefined
													}
												}).then(function() {
											LoadingService.hideLoad();
										});
							}

							$scope.setFile = function(element) {
								// get the files
								var files = element.files;
								var validFile = false;
								var allowedFiles = [ ".pptx", ".docx", ".pdf",
										".txt" ];
								for (var i = 0; i < files.length; i++) {
									var regex = new RegExp(
											"([a-zA-Z0-9\s_\\.\-:])+("
													+ allowedFiles.join('|')
													+ ")$");
									if (regex.test(files[i].name.toLowerCase())) {
										validFile = true;
									}
								}
								if (validFile) {
									for (var i = 0; i < files.length; i++) {
										$scope.convertImage(files);
										$scope.showSubmitButton = true;
										$scope.ImageProperty.name = files[i].name;
										$scope.ImageProperty.path = document
												.getElementById("file").value;
										$scope.ImageProperty.type = files[i].type;

										$scope.fileList
												.push($scope.ImageProperty);
										$scope.ImageProperty = {};
										$scope.$apply();

									}
								}
							};

							$scope.onAddFileClick = function() {
								var addFileObj = {
									bookName : BINDER_NAME.name,
									oBookRequests : $scope.fileList
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
														$route.reload();
													}
												});

							};

							$scope.onAddfileCancel = function() {
								$('#addFileModal').modal('hide');
								$scope.fileList = undefined;
							}

							$scope.openSideBar = function() {
								document.getElementById("main").style.marginLeft = "20%";
								document.getElementById("mySidebar").style.width = "20%";
								document.getElementById("mySidebar").style.display = "block";
								document.getElementById("openNav").style.display = 'none';
							};

							$scope.closeSideBar = function() {
								document.getElementById("main").style.marginLeft = "0%";
								document.getElementById("mySidebar").style.display = "none";
								document.getElementById("openNav").style.display = "inline-block";
							}

							$scope.$on('onNodeClick', function(event, node) {
								console.log(node);
								$('#pdfModal').modal('show');
							});

							$scope.deletebook = function(bookname) {
								var deleteObj = {
									bookName : bookname
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
														$location.path('/home');
													}
												});
							}

							$scope.removeBook = function() {
								$scope.deletebook(BINDER_NAME.name);
							}

							$scope.toggle = function(scope) {
								scope.toggle();
							};

							$scope.moveLastToTheBeginning = function() {
								var a = $scope.data.pop();
								$scope.data.splice(0, 0, a);
							};

							$scope.newSubItem = function(scope) {
								var nodeData = scope.$modelValue;
								nodeData.nodes.push({
									id : nodeData.id * 10
											+ nodeData.nodes.length,
									title : nodeData.title + '.'
											+ (nodeData.nodes.length + 1),
									nodes : []
								});
							};

							$scope.collapseAll = function() {
								$scope
										.$broadcast('angular-ui-tree:collapse-all');
							};

							$scope.expandAll = function() {
								$scope.$broadcast('angular-ui-tree:expand-all');
							};

							$scope.testArray = [ "1", "2" ];

							$scope.pageCount = 0;

							$scope.nodearray = [];

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
												width : 800, // container
												// width
												height : 500, // container
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