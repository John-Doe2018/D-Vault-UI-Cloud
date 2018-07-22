fileItApp.factory('DashboardSvc', [ 'RestSvc', 'EncoderSvc', '$sessionStorage',
		'BINDER_SVC',
		function(RestSvc, EncoderSvc, $sessionStorage, BINDER_SVC) {
			return {
				classifiedData : function() {

					return RestSvc.postData(BINDER_SVC.classifiedData);
				}
			};
		} ]);