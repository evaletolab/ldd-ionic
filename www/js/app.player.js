'use strict';



// inject deps
LddPlayer.$inject=['$window','$rootScope','$cordovaMedia','$q','$log'];

// implement service
function LddPlayer($window, $rootScope, $cordovaMedia, $q, $log) {


	function LddPlayer(){
		this.deferred=$q.defer();
	}


	LddPlayer.prototype.toggle = function(item) {

	};




	return new LddPlayer();
}

