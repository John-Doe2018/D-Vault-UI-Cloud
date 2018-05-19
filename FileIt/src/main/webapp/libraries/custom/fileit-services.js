fileItApp.service('LoadingService', function($rootScope) {
	this.showLoad = function() {
		$('#loadingScreen').addClass('display-flex');
		$('#loadingScreen').removeClass('display-none');
	};
	this.hideLoad = function() {
		$('#loadingScreen').removeClass('display-flex');
		$('#loadingScreen').addClass('display-none');
	};
});

fileItApp.factory("rfc4122", function() {
	return {
		newuuid : function() {
			// http://www.ietf.org/rfc/rfc4122.txt
			var s = [];
			var hexDigits = "0123456789abcdef";
			for (var i = 0; i < 36; i++) {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
			s[14] = "4"; // bits 12-15 of the time_hi_and_version field to
							// 0010
			s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of
																// the
																// clock_seq_hi_and_reserved
																// to 01
			s[8] = s[13] = s[18] = s[23] = "-";
			return s.join("");
		}
	}
});

// Service for REST API Call
fileItApp.factory('RestSvc', [
		'$http',
		'$q',
		'FILEIT_CONFIG',
		'LoadingService',
		function($http, $q, FILEIT_CONFIG, LoadingService) {
			return {

				getData : function(relURL) {
					LoadingService.showLoad();
					var appGetUrl = FILEIT_CONFIG.apiUrl + relURL;
					return $http.get(appGetUrl).then(function(response) {
						console.log('Success : ' + response.status);
						return response;
					}, function(error) {
						console.log('Error : ' + error.status);
						return $q.reject(error.data);
					})['finally'](function() {
						LoadingService.hideLoad();
					});
				},

				postData : function(relURL, data) {
					LoadingService.showLoad();
					var appPostUrl = FILEIT_CONFIG.apiUrl + relURL;
					return $http.post(appPostUrl, data).then(
							function(response) {
								console.log('Success : ' + response.status);
								return response;
							}, function(error) {
								console.log('Error : ' + error.status);
								return $q.reject(error.data);
							})['finally'](function() {
						LoadingService.hideLoad();
					});
				},

				getDataWithParams : function(relURL, data) {
					LoadingService.showLoad();
					var appGetUrl = FILEIT_CONFIG.apiUrl + relURL + data;
					return $http.get(appGetUrl).then(function(response) {
						console.log('Success : ' + response.status);
						return response;
					}, function(error) {
						console.log('Error : ' + error.status);
						return $q.reject(error.data);
					})['finally'](function() {
						LoadingService.hideLoad();
					});
				}
			};
		} ]);

fileItApp
		.factory(
				'authInterceptor',
				function($rootScope, $q, $sessionStorage) {
					return {
						request : function(config) {
							config.headers = config.headers || {};

							if (config.url.includes == undefined) {
								config.headers = {
									'Accept' : 'application/json',
									'Content-type' : 'application/json'
								};
							} else if (config.url.includes == 'getMasterJson') {
								config.headers = {
									'Accept' : 'text/plain',
									'Content-type' : 'application/json'
								};
							} else {
								config.headers = {
									'Accept' : 'application/json',
									'Content-type' : 'application/json'
								};
							}

							console.log(config);
							return config;
						},

						requestError : function(rejection) {

							console.log('Request Error - ' + rejection.status);
							console.log(rejection.data);
							console.log(rejection.statusText);
							return $q.reject(rejection);
						},

						responseError : function(rejection) {

							var rejectionData;

							if (rejection.status == 0) {
								rejectionData = 888;
							} else if (rejection.status == 401) {
								if (rejection.data.AuthenticationDetails.ErrorMessage == "Password Expired") {
									$('#chngePwdModal').modal('show');
								} else {
									rejectionData = rejection.data.AuthenticationDetails.ErrorMessage;
								}
							} else {

								if (rejection.data.BusinessError != undefined) {
									rejectionData = rejection.data.BusinessError.Code;
								} else {
									rejectionData = 888;
								}

							}

							console.log('Rejection Status : ' + rejectionData);

							if (rejectionData != undefined) {
								$rootScope.$broadcast('ErrorData', {
									errStatus : rejectionData
								});

							}
							return $q.reject(rejection);
						}
					};
				});

fileItApp.config(function($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
});

fileItApp
		.service(
				'EncoderSvc',
				function() {
					this.encodeData = function(s) {

						var base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
								.split("");

						var r = "";
						var p = "";
						var c = s.length % 3;

						if (c > 0) {
							for (; c < 3; c++) {
								p += '=';
								s += "\0";
							}
						}

						for (c = 0; c < s.length; c += 3) {
							if (c > 0 && (c / 3 * 4) % 76 == 0) {
								r += "\r\n";
							}

							var n = (s.charCodeAt(c) << 16)
									+ (s.charCodeAt(c + 1) << 8)
									+ s.charCodeAt(c + 2);

							n = [ (n >>> 18) & 63, (n >>> 12) & 63,
									(n >>> 6) & 63, n & 63 ];

							r += base64chars[n[0]] + base64chars[n[1]]
									+ base64chars[n[2]] + base64chars[n[3]];
						}
						return r.substring(0, r.length - p.length) + p;
					};
				});

fileItApp.service('AesEncoder', function() {
	this.encodeData = function(data) {
		var iv = "00000000000000000000000000000000";
		var salt = "00000000000000000000000000000000";
		var keySize = 128;
		var iterationCount = 10000;
		var passPhrase = "aesalgoforpos";
		var aesUtil = new AesUtil(keySize, iterationCount);
		var encrypt = aesUtil.encrypt(salt, iv, passPhrase, data);
		return encrypt;
	};
});

fileItApp.factory('CURR_DATE_TIME', function() {

	return {
		formattedDateTime : function() {
			var currDate = new Date();
			var formattedDate = currDate.getFullYear() + '-'
					+ (currDate.getMonth() + 1) + '-' + currDate.getDate()
					+ ' ' + currDate.getHours() + ':' + currDate.getMinutes()
					+ ':' + currDate.getSeconds();
			return formattedDate;
		}
	};
});

fileItApp.factory('FORMATTED_DATE_TIME', function() {

	return {
		formattedDateTime : function(currDate) {
			var formattedDate = currDate.getFullYear() + '-'
					+ (currDate.getMonth() + 1) + '-' + currDate.getDate()
					+ ' ' + currDate.getHours() + ':' + currDate.getMinutes()
					+ ':' + currDate.getSeconds();
			return formattedDate;
		}
	};
});

fileItApp.factory('FORMATTED_DATE', function() {

	return {
		formattedDate : function(date) {

			function getFormattedData(data) {
				if (data < 10) {
					data = '0' + data;
				}

				return data;
			}

			var formattedDate = date.getFullYear() + '-'
					+ getFormattedData(date.getMonth() + 1) + '-'
					+ getFormattedData(date.getDate());

			return formattedDate;
		}
	};
});

fileItApp.value('BINDER_NAME', {
	name : ''
});