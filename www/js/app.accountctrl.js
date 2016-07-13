'use strict';


// inject deps
AccountCtrl.$inject=['$scope','geoService','$cordovaSocialSharing','$ionicLoading','$ionicPlatform','$cordovaDevice','$log'];

// implement service
function AccountCtrl($scope, geoService, $cordovaSocialSharing, $ionicLoading, $ionicPlatform, $cordovaDevice,$log) {
	$scope.uuid=''
	$ionicPlatform.ready(function(){
		try{
			$scope.uuid=$cordovaDevice.getUUID();			
		}catch(e){}
	});

}

