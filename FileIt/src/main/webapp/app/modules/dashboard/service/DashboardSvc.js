fileItApp.factory('DashboardSvc', [ 'RestSvc', 'EncoderSvc', '$sessionStorage',
		'BINDER_SVC',
		function(RestSvc, EncoderSvc, $sessionStorage, BINDER_SVC) {
			return {
				classifiedData : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.classifiedData, reqObj);
				},
				getbookmark : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.getbookmark, reqObj);
				},

				getActiveUsers : function() {

					return RestSvc.getData(BINDER_SVC.getActiveUsers);
				},

				getAllBooks : function() {

					return RestSvc.getData(BINDER_SVC.getAllBooks);
				},

				getAllComments : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.getAllComments, reqObj);
				},

				addComment : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.addComment, reqObj);
				},

				getAllUsers : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.getAllUsers, reqObj);
				}

			};
		} ]);