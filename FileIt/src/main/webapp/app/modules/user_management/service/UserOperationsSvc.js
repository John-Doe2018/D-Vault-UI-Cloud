/*
 * Copyright (C) Tranfode Technologies to Present 
 *
 * All Rights Reserved.
 */
fileItApp.factory('UserOperationsSvc', [ 'RestSvc', 'BINDER_SVC',
		function(RestSvc, BINDER_SVC) {
			return {
				login : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.login, reqObj);
				},

				signup : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.signup, reqObj);
				},

				getAllRoles : function() {
					return RestSvc.getData(BINDER_SVC.getAllRoles);
				},

				getAllGroups : function() {
					return RestSvc.getData(BINDER_SVC.getAllGroups);
				},

				getAccessList : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.getAccessList, reqObj);
				},

				updateAccess : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.updateAccess, reqObj);
				},

				updateUser : function(reqObj) {
					return RestSvc.postData(BINDER_SVC.updateUser, reqObj);
				}
			};
		} ]);