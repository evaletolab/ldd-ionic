'use strict';



// inject deps
Nora.$inject=['$window','$interval','$q','$log'];

// implement service
function Nora($window, $interval, $q, $log) {

	if(!window.nora){
		console.log('ERROR ------------------------ NORA IS REQUIRED');
	}

	return new nora();
}

