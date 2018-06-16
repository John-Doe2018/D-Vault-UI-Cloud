fileItApp.factory('LandingOperationsSvc', [ 'RestSvc', 'EncoderSvc',
		'$sessionStorage', 'BINDER_SVC',
		function(RestSvc, EncoderSvc, $sessionStorage, BINDER_SVC) {
			return {
				treeList : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.listview, reqObj);
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

				getFileCount : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.getFileCount, reqObj);
				},
				advSearch : function() {

					return RestSvc.postData(BINDER_SVC.advancedSearch);
				},
				deleteFile : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.deleteFile, reqObj);
				}
			};
		} ]);