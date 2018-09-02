fileItApp.factory('UserOperationsSvc', [ 'RestSvc', 'EncoderSvc',
		'$sessionStorage', 'BINDER_SVC',
		function(RestSvc, EncoderSvc, $sessionStorage, BINDER_SVC) {
			return {
				login : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.login, reqObj);
				},
				signup : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.signup, reqObj);
				}
			};
		} ]);