fileItApp.factory('HomeSvc', [
		'RestSvc',
		'EncoderSvc',
		'$sessionStorage',
		'BINDER_SVC',
		function(RestSvc, EncoderSvc, $sessionStorage, BINDER_SVC) {
			return {
				createBinder : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.createBinder, reqObj);
				},

				addClassification : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.addClassification,
							reqObj);
				},

				getClassification : function() {
					return RestSvc.getData(BINDER_SVC.getClassification);
				},
				tag : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.bookmark, reqObj);
				}
			};
		} ]);