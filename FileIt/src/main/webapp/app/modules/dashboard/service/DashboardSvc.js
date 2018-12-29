fileItApp.factory('DashboardSvc', [ 'RestSvc', 'EncoderSvc', '$sessionStorage',
		'BINDER_SVC',
		function(RestSvc, EncoderSvc, $sessionStorage, BINDER_SVC) {
			return {
				classifiedData : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.classifiedData, reqObj);
				},
				getbookmark : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.getbookmark, reqObj);
				}
			};
		} ]);