/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp.factory('DashboardSvc', [ 'RestSvc', 'BINDER_SVC',
		function(RestSvc, BINDER_SVC) {
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

				getAllBooks : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.getAllBooks, reqObj);
				},

				getAllComments : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.getAllComments, reqObj);
				},

				addComment : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.addComment, reqObj);
				},

				getAllUsers : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.getAllUsers, reqObj);
				},

				getNewComments : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.getNewComments, reqObj);
				},

				getFav : function(reqObj) {

					return RestSvc.postData(BINDER_SVC.getFav, reqObj);
				}

			};
		} ]);