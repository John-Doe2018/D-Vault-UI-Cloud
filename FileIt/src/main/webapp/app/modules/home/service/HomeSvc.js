/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp.factory('HomeSvc', [
		'RestSvc',
		'BINDER_SVC',
		function(RestSvc, BINDER_SVC) {
			return {
				createBinder : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.createBinder, reqObj);
				},

				addClassification : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.addClassification,
							reqObj);
				},

				getBookLists : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.getBookLists, reqObj);
				},

				getClassification : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.getClassification,
							reqObj);
				},
				tag : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.bookmark, reqObj);
				},

				updateFav : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.updateFav, reqObj);
				}

			};
		} ]);