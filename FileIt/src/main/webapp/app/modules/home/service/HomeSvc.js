fileItApp.factory('HomeSvc', [ 'RestSvc', 'EncoderSvc', '$sessionStorage',
		'BINDER_SVC',
		function(RestSvc, EncoderSvc, $sessionStorage, BINDER_SVC) {
			return {
				createBinder : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.createBinder, reqObj);
				},

				shelfBook : function() {

					return RestSvc.getData(BINDER_SVC.shelf);
				}
			};
		} ]);