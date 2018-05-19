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
						function($rootScope, $scope, $location,
								$sessionStorage, Idle, AesEncoder,
								LandingOperationsSvc, BINDER_NAME) {
							$scope.remove = function(scope) {
								scope.remove();
							};

							$scope.$on('onNodeClick', function(event, node) {
								console.log(node);
								$('#pdfModal').modal('show');
							});

							$scope.$on('onRemoveBookClick', function(event,
									bookname) {
								LandingOperationsSvc.deleteBook(bookname).then(
										function(result) {
											$location.path('/home');
										});
							});

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

							$scope.nodearray = [];
							$scope.getData = function() {
								$scope.pdf = {
									src : 'Test.pdf',
								};
								LandingOperationsSvc
										.treeList(BINDER_NAME.name)
										.then(
												function(result) {
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
												});
							};

							$scope.getData();
							/*
							 * $scope.data = [ { 'id' : 1, 'title' : 'Book
							 * Name', 'nodes' : [ { 'id' : 11, 'title' :
							 * 'node1.1.pdf', 'nodes' : [] }, { 'id' : 12,
							 * 'title' : 'node1.2.pdf', 'nodes' : [] } ] }, ];
							 */

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
							$scope.viewerProps = {
								serviceUrl : 'http://demos.componentone.com/ASPNET/c1webapi/4.0.20172.105/api/pdf',
								filePath : 'Test.pdf',
								fullScreen : false,
								mouseMode : 'SelectTool',
								zoomFactor : 1,
								continuousViewMode : false
							};

							$scope.pdfViewer = null;

							$scope
									.$watch(
											'viewerProps.continuousViewMode',
											function() {
												var continuousViewMode = $scope.viewerProps.continuousViewMode;
												if ($scope.pdfViewer) {
													$scope.pdfViewer.viewMode = continuousViewMode ? wijmo.viewer.ViewMode.Continuous
															: wijmo.viewer.ViewMode.Single;
												}
											});
						} ]);