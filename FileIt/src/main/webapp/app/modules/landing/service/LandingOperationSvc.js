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
				}
			};
		} ]);