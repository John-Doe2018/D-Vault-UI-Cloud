fileItApp.factory('LandingOperationsSvc', [ 'RestSvc', 'EncoderSvc',
		'$sessionStorage', 'BINDER_SVC',
		function(RestSvc, EncoderSvc, $sessionStorage, BINDER_SVC) {
			return {
				treeList : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.listview, reqObj);
				},

				getPageIndex : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.getPageIndex, reqObj);
				},

				deleteBook : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.deleteBook, reqObj);
				},
				searchBook : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.search, reqObj);
				},

				getImage : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.getImage, reqObj);
				},

				advSearch : function() {

					return RestSvc.postData(BINDER_SVC.advancedSearch);
				},
				deleteFile : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.deleteFile, reqObj);
				},
				downloadFile : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.downloadFile, reqObj);
				},
				addfile : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.addfile, reqObj);
				}
			};
		} ]);